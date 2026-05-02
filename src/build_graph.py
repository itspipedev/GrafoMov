"""
GrafoMov — Construcción del grafo base de movilidad urbana de Bogotá
Combina estaciones Transmilenio + paraderos SITP + rutas como aristas
"""
import json
import csv
import networkx as nx
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
RAW = BASE / "data" / "raw"
OUT = BASE / "data" / "graphs"


def load_geojson(path):
    with open(path) as f:
        return json.load(f)["features"]


def build_graph():
    G = nx.MultiDiGraph()

    # ── 1. NODOS: Estaciones Transmilenio ──
    estaciones = load_geojson(RAW / "transmilenio" / "estaciones_troncales_tm.geojson")
    for e in estaciones:
        p = e["properties"]
        coords = e["geometry"]["coordinates"]
        G.add_node(
            f"TM_{p['nombre_estacion']}",
            tipo="estacion_tm",
            nombre=p["nombre_estacion"],
            troncal=p.get("troncal_estacion", ""),
            vagones=p.get("numero_vagones_estacion", 0),
            lat=coords[1],
            lon=coords[0],
        )
    print(f"✅ {len(estaciones)} estaciones Transmilenio")

    # ── 2. NODOS: Paraderos SITP ──
    paraderos = load_geojson(RAW / "sitp" / "paraderos_sitp_bogota.geojson")
    for p_feat in paraderos:
        p = p_feat["properties"]
        coords = p_feat["geometry"]["coordinates"]
        G.add_node(
            f"SITP_{p['NTRCODIGO']}",
            tipo="paradero_sitp",
            nombre=p.get("NTRNOMBRE", ""),
            codigo=p["NTRCODIGO"],
            direccion=p.get("NTRDIRECCION", ""),
            lat=coords[1],
            lon=coords[0],
        )
    print(f"✅ {len(paraderos)} paraderos SITP")

    # ── 3. NODOS: Conexiones troncales ──
    conexiones = load_geojson(RAW / "transmilenio" / "conexiones_troncales_tm.geojson")
    for c in conexiones:
        p = c["properties"]
        coords = c["geometry"]["coordinates"]
        G.add_node(
            f"CONEX_{p.get('id_conexion', p['objectid'])}",
            tipo="conexion_troncal",
            nombre=p.get("conexion", ""),
            lat=coords[1],
            lon=coords[0],
        )
    print(f"✅ {len(conexiones)} conexiones troncales")

    # ── 4. ARISTAS: Rutas troncales TM ──
    rutas_tm = load_geojson(RAW / "transmilenio" / "rutas_troncales_transmilenio.geojson")
    aristas_tm = 0
    for r in rutas_tm:
        p = r["properties"]
        origen = p.get("origen_ruta_troncal", "")
        destino = p.get("destino_ruta_troncal", "")
        # Buscar nodos que coincidan
        origen_id = _find_node(G, origen, "estacion_tm")
        destino_id = _find_node(G, destino, "estacion_tm")
        if origen_id and destino_id:
            G.add_edge(
                origen_id, destino_id,
                tipo="ruta_troncal",
                ruta=p.get("nombre_ruta_troncal", ""),
                tipo_bus=p.get("desc_tipo_bus_ruta_troncal", ""),
                longitud_km=p.get("longitud_ruta_troncal", 0),
                horario_lv=p.get("horario_lunes_viernes", ""),
            )
            aristas_tm += 1
    print(f"✅ {aristas_tm}/{len(rutas_tm)} aristas troncales TM conectadas")

    # ── 5. ARISTAS: Secuencia de paradas (paradero → paradero) ──
    aristas_seq = 0
    with open(RAW / "sitp" / "paraderos_sistema.csv") as f:
        paradas = list(csv.DictReader(f))

    # Agrupar por ruta
    rutas = {}
    for p in paradas:
        ruta = p["nombre_ruta"]
        if ruta not in rutas:
            rutas[ruta] = []
        rutas[ruta].append(p)

    # Ordenar por secuencia y crear aristas consecutivas
    for ruta, stops in rutas.items():
        stops.sort(key=lambda x: int(x["secuencia_parada"]))
        for i in range(len(stops) - 1):
            s1 = stops[i]
            s2 = stops[i + 1]
            # Buscar nodos más cercanos por coordenadas
            n1 = _find_nearest(G, float(s1["coordenada_y"]), float(s1["coordenada_x"]))
            n2 = _find_nearest(G, float(s2["coordenada_y"]), float(s2["coordenada_x"]))
            if n1 and n2 and n1 != n2:
                G.add_edge(
                    n1, n2,
                    tipo="secuencia_parada",
                    ruta=ruta,
                    secuencia=f"{s1['secuencia_parada']}->{s2['secuencia_parada']}",
                )
                aristas_seq += 1
    print(f"✅ {aristas_seq} aristas de secuencia de paradas en {len(rutas)} rutas")

    # ── 6. ARISTAS: Rutas zonales SITP (origen → destino) ──
    rutas_z = load_geojson(RAW / "sitp" / "rutas_zonales_sitp.geojson")
    aristas_z = 0
    for r in rutas_z:
        p = r["properties"]
        origen = p.get("origen_ruta_zonal", "")
        destino = p.get("destino_ruta_zonal", "")
        origen_id = _find_node(G, origen, "paradero_sitp") or _find_node(G, origen, "estacion_tm")
        destino_id = _find_node(G, destino, "paradero_sitp") or _find_node(G, destino, "estacion_tm")
        if origen_id and destino_id:
            G.add_edge(
                origen_id, destino_id,
                tipo="ruta_zonal",
                ruta=p.get("codigo_definitivo_ruta_zonal", ""),
                operador=p.get("operador_ruta_zonal", ""),
                longitud_km=p.get("longitud_ruta_zonal", 0),
            )
            aristas_z += 1
    print(f"✅ {aristas_z}/{len(rutas_z)} aristas zonales SITP conectadas")

    return G


def _find_node(G, name, tipo):
    """Busca un nodo por nombre (match parcial)."""
    name_upper = name.upper().strip()
    if not name_upper:
        return None
    for node, data in G.nodes(data=True):
        if data.get("tipo") == tipo:
            node_name = data.get("nombre", "").upper().strip()
            if node_name == name_upper or name_upper in node_name or node_name in name_upper:
                return node
    return None


def _find_nearest(G, lat, lon, max_dist=0.005):
    """Busca el nodo más cercano por coordenadas (distancia euclidiana simple)."""
    best = None
    best_dist = max_dist
    for node, data in G.nodes(data=True):
        nlat = data.get("lat")
        nlon = data.get("lon")
        if nlat is None or nlon is None:
            continue
        dist = ((nlat - lat) ** 2 + (nlon - lon) ** 2) ** 0.5
        if dist < best_dist:
            best_dist = dist
            best = node
    return best


def print_stats(G):
    print(f"\n{'=' * 50}")
    print(f"GRAFO DE MOVILIDAD — ESTADÍSTICAS")
    print(f"{'=' * 50}")
    print(f"  Nodos totales:   {G.number_of_nodes()}")
    print(f"  Aristas totales: {G.number_of_edges()}")

    # Por tipo de nodo
    tipos_nodo = {}
    for _, data in G.nodes(data=True):
        t = data.get("tipo", "?")
        tipos_nodo[t] = tipos_nodo.get(t, 0) + 1
    print(f"\n  Nodos por tipo:")
    for t, c in sorted(tipos_nodo.items()):
        print(f"    {t}: {c}")

    # Por tipo de arista
    tipos_arista = {}
    for _, _, data in G.edges(data=True):
        t = data.get("tipo", "?")
        tipos_arista[t] = tipos_arista.get(t, 0) + 1
    print(f"\n  Aristas por tipo:")
    for t, c in sorted(tipos_arista.items()):
        print(f"    {t}: {c}")

    # Componentes
    UG = G.to_undirected()
    components = list(nx.connected_components(UG))
    print(f"\n  Componentes conexas: {len(components)}")
    print(f"  Componente más grande: {max(len(c) for c in components)} nodos")

    # Grado promedio
    degrees = [d for _, d in G.degree()]
    print(f"  Grado promedio: {sum(degrees) / len(degrees):.2f}")
    print(f"  Grado máximo: {max(degrees)}")


if __name__ == "__main__":
    G = build_graph()
    print_stats(G)

    # Limpiar None para GraphML
    for node, data in G.nodes(data=True):
        for k, v in list(data.items()):
            if v is None:
                data[k] = ""
    for u, v, data in G.edges(data=True):
        for k, val in list(data.items()):
            if val is None:
                data[k] = ""

    # Guardar
    out_path = OUT / "grafo_movilidad_bogota.graphml"
    nx.write_graphml(G, out_path)
    print(f"\n💾 Grafo guardado en: {out_path}")
    print(f"   Tamaño: {out_path.stat().st_size / 1024 / 1024:.1f} MB")
