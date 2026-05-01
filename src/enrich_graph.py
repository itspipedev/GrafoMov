"""
GrafoMov — Enriquecer grafo con features de siniestralidad, demanda y tráfico
"""
import json
import csv
import networkx as nx
from collections import Counter, defaultdict
from pathlib import Path
import math

BASE = Path(__file__).resolve().parent.parent
RAW = BASE / "data" / "raw"
GRAPHS = BASE / "data" / "graphs"


def haversine(lat1, lon1, lat2, lon2):
    """Distancia en km entre dos puntos."""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))


def load_graph():
    G = nx.read_graphml(GRAPHS / "grafo_movilidad_bogota.graphml")
    print(f"📥 Grafo cargado: {G.number_of_nodes()} nodos, {G.number_of_edges()} aristas")
    return G


def add_siniestralidad(G):
    """Asigna score de siniestralidad a nodos cercanos a sectores críticos."""
    with open(RAW / "siniestralidad" / "datos_gov_co" / "sectores_criticos_siniestralidad.csv") as f:
        sectores = list(csv.DictReader(f))

    # Inicializar todos los nodos
    for n in G.nodes:
        G.nodes[n]["siniestralidad_score"] = 0.0
        G.nodes[n]["fallecidos_cercanos"] = 0

    asignados = 0
    for s in sectores:
        try:
            slat, slon = float(s["latitud"]), float(s["longitud"])
            score = float(s.get("gizscore", 0))
            fallecidos = int(s.get("fallecidos", 0))
        except (ValueError, KeyError):
            continue

        # Buscar nodos dentro de 2km
        for n, d in G.nodes(data=True):
            nlat = float(d.get("lat", 0))
            nlon = float(d.get("lon", 0))
            if nlat == 0 or nlon == 0:
                continue
            dist = haversine(slat, slon, nlat, nlon)
            if dist < 2.0:
                G.nodes[n]["siniestralidad_score"] = max(
                    float(G.nodes[n].get("siniestralidad_score", 0)), score
                )
                G.nodes[n]["fallecidos_cercanos"] = (
                    int(G.nodes[n].get("fallecidos_cercanos", 0)) + fallecidos
                )
                asignados += 1

    nodos_con = sum(1 for _, d in G.nodes(data=True) if float(d.get("siniestralidad_score", 0)) > 0)
    print(f"✅ Siniestralidad: {nodos_con} nodos con score > 0 ({asignados} asignaciones)")


def add_accidentes_stats(G):
    """Agrega estadísticas de accidentes como features globales."""
    with open(RAW / "siniestralidad" / "fuentes_alternativas" / "vehiculos_accidentes_bogota.csv") as f:
        accidentes = list(csv.DictReader(f))

    gravedad = Counter(a["gravedad_accidente"] for a in accidentes)
    tipos = Counter(a["tipo_vehiculo"] for a in accidentes)

    # Agregar como atributo del grafo
    G.graph["accidentes_total"] = len(accidentes)
    G.graph["accidentes_con_heridos"] = gravedad.get("CON HERIDOS", 0)
    G.graph["accidentes_con_muertos"] = gravedad.get("CON MUERTOS", 0)
    G.graph["accidentes_periodo"] = "02/2024-12/2024"
    G.graph["accidentes_top_vehiculo"] = tipos.most_common(1)[0][0]

    print(f"✅ Accidentes: {len(accidentes)} registros (heridos: {gravedad.get('CON HERIDOS',0)}, muertos: {gravedad.get('CON MUERTOS',0)})")


def add_demanda(G):
    """Agrega datos de demanda de pasajeros como features."""
    with open(RAW / "demanda" / "pasajeros_transporte_masivo.csv") as f:
        pasajeros = list(csv.DictReader(f))

    # Filtrar Transmilenio/SITP
    tm = [p for p in pasajeros if "TRANSMILENIO" in p.get("sistema", "").upper()]

    if tm:
        vals = []
        for p in tm:
            try:
                v = int(p["pasajeros_dia"].replace(".", "").replace(",", ""))
                vals.append(v)
            except (ValueError, KeyError):
                continue

        if vals:
            G.graph["demanda_promedio_dia"] = sum(vals) // len(vals)
            G.graph["demanda_max_dia"] = max(vals)
            G.graph["demanda_min_dia"] = min(vals)
            G.graph["demanda_periodo"] = "03/2020-09/2020"
            G.graph["demanda_sistema"] = "TRANSMILENIO/SITP"

    print(f"✅ Demanda: {len(tm)} registros Transmilenio")


def add_vehicular_stats(G):
    """Agrega estadísticas del parque automotor."""
    with open(RAW / "vehicular" / "parque_automotor_bogota.csv") as f:
        parque = list(csv.DictReader(f))

    # Totales por clase de vehículo
    clases = defaultdict(int)
    for p in parque:
        try:
            clases[p["nombre_de_la_clase"]] += int(p["cantidad"])
        except (ValueError, KeyError):
            continue

    G.graph["parque_automotor_total"] = sum(clases.values())
    for clase, cant in sorted(clases.items(), key=lambda x: -x[1])[:5]:
        G.graph[f"parque_{clase.lower().replace(' ','_')}"] = cant

    print(f"✅ Parque automotor: {sum(clases.values()):,} vehículos en Bogotá")
    for c, v in sorted(clases.items(), key=lambda x: -x[1])[:5]:
        print(f"   {c}: {v:,}")


def add_graph_metrics(G):
    """Calcula métricas de grafo como features de nodos."""
    UG = G.to_undirected()

    # Grado
    for n, deg in G.degree():
        G.nodes[n]["grado"] = deg

    # Betweenness centrality (en la componente más grande para eficiencia)
    largest = max(nx.connected_components(UG), key=len)
    sub = UG.subgraph(largest).copy()
    bc = nx.betweenness_centrality(sub, k=min(500, len(sub)))
    for n, v in bc.items():
        G.nodes[n]["betweenness"] = round(v, 6)

    # Closeness centrality
    cc = nx.closeness_centrality(sub)
    for n, v in cc.items():
        G.nodes[n]["closeness"] = round(v, 6)

    # Nodos con mayor centralidad
    top_bc = sorted(bc.items(), key=lambda x: -x[1])[:5]
    top_cc = sorted(cc.items(), key=lambda x: -x[1])[:5]

    print(f"✅ Métricas de grafo calculadas para {len(sub)} nodos")
    print(f"   Top betweenness: {[(G.nodes[n].get('nombre',''), round(v,4)) for n,v in top_bc]}")
    print(f"   Top closeness:   {[(G.nodes[n].get('nombre',''), round(v,4)) for n,v in top_cc]}")


def print_summary(G):
    print(f"\n{'='*50}")
    print(f"GRAFO ENRIQUECIDO — RESUMEN")
    print(f"{'='*50}")
    print(f"  Nodos: {G.number_of_nodes()}")
    print(f"  Aristas: {G.number_of_edges()}")

    # Features de nodos
    sample = list(G.nodes(data=True))[0]
    print(f"\n  Features por nodo: {list(sample[1].keys())}")

    # Atributos del grafo
    print(f"\n  Atributos globales:")
    for k, v in G.graph.items():
        print(f"    {k}: {v}")


if __name__ == "__main__":
    G = load_graph()
    add_siniestralidad(G)
    add_accidentes_stats(G)
    add_demanda(G)
    add_vehicular_stats(G)
    add_graph_metrics(G)
    print_summary(G)

    # Guardar
    out = GRAPHS / "grafo_movilidad_bogota_enriched.graphml"
    nx.write_graphml(G, out)
    sz = out.stat().st_size / 1024 / 1024
    print(f"\n💾 Grafo enriquecido guardado: {out.name} ({sz:.1f} MB)")
