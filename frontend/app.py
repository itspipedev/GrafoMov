"""GrafoMov — Frontend tipo Waze."""
import streamlit as st
import folium
from streamlit_folium import st_folium
import api_client as api

# ── Config ──
st.set_page_config(page_title="GrafoMov", page_icon="🚀", layout="wide")

# ── Sidebar ──
with st.sidebar:
    st.image("https://img.icons8.com/color/96/route.png", width=60)
    st.title("GrafoMov")
    st.caption("Grafo inteligente de movilidad urbana")
    st.divider()

    view = st.radio("🗺️ Vista", [
        "Mapa General",
        "Buscar Cercanos",
        "Ruta más corta",
        "Zonas Peligrosas",
        "Accesibilidad",
        "Nodos Centrales",
        "Métricas",
    ])

    st.divider()
    st.caption("🇨🇴 Datos abiertos de Colombia")
    st.caption("Concurso Datos al Ecosistema 2026")

# ── Helpers ──
BOGOTA_CENTER = [4.65, -74.10]

COLORS = {
    "estacion_tm": "#E53935",      # Rojo TM
    "paradero_sitp": "#1E88E5",    # Azul SITP
    "conexion_troncal": "#FDD835", # Amarillo
    "danger": "#FF5722",           # Naranja peligro
    "low_access": "#9C27B0",       # Morado
    "central": "#4CAF50",          # Verde
}


def create_map(center=BOGOTA_CENTER, zoom=12):
    return folium.Map(
        location=center,
        zoom_start=zoom,
        tiles="CartoDB dark_matter",
        attr="GrafoMov",
    )


def add_node_marker(m, node, color=None, radius=5, popup_extra=""):
    c = node["coordinates"]
    ntype = node["node_type"]
    fill = color or COLORS.get(ntype, "#999")
    props = node.get("properties", {})

    popup_html = f"""
    <b>{node['name']}</b><br>
    <small>{ntype}</small><br>
    {popup_extra}
    """
    folium.CircleMarker(
        location=[c["lat"], c["lon"]],
        radius=radius,
        color=fill,
        fill=True,
        fill_opacity=0.8,
        popup=folium.Popup(popup_html, max_width=250),
    ).add_to(m)


# ── Views ──
try:
    if view == "Mapa General":
        st.header("🗺️ Mapa de Movilidad — Bogotá")
        col1, col2 = st.columns([3, 1])

        with col2:
            show_tm = st.checkbox("🔴 Estaciones TM", True)
            show_sitp = st.checkbox("🔵 Paraderos SITP", False)
            limit = st.slider("Límite paraderos", 50, 500, 200)

        with col1:
            m = create_map()
            if show_tm:
                for n in api.get_nodes("estacion_tm", 200):
                    add_node_marker(m, n, radius=8)
            if show_sitp:
                for n in api.get_nodes("paradero_sitp", limit):
                    add_node_marker(m, n, radius=3)
            st_folium(m, width=900, height=600)

    elif view == "Buscar Cercanos":
        st.header("📍 Buscar paraderos cercanos")
        st.caption("Haz clic en el mapa o ingresa coordenadas")

        col1, col2 = st.columns([3, 1])
        with col2:
            lat = st.number_input("Latitud", value=4.6097, format="%.4f")
            lon = st.number_input("Longitud", value=-74.0817, format="%.4f")
            radius = st.slider("Radio (km)", 0.1, 2.0, 0.5)
            limit = st.slider("Máximo resultados", 5, 30, 10)

        with col1:
            m = create_map([lat, lon], zoom=15)
            folium.Marker([lat, lon], icon=folium.Icon(color="red", icon="user", prefix="fa"),
                          popup="📍 Tu ubicación").add_to(m)
            folium.Circle([lat, lon], radius=radius * 1000, color="#E53935",
                          fill=True, fill_opacity=0.1).add_to(m)

            nearby = api.get_nearby(lat, lon, radius, limit)
            for item in nearby:
                n = item["node"]
                dist = item["distance_km"]
                add_node_marker(m, n, radius=6, popup_extra=f"📏 {dist} km")

            st_folium(m, width=900, height=600)

            if nearby:
                st.subheader(f"📋 {len(nearby)} paraderos encontrados")
                for item in nearby:
                    n = item["node"]
                    st.write(f"**{n['name']}** — {item['distance_km']} km — {n.get('properties',{}).get('direccion','')}")

    elif view == "Ruta más corta":
        st.header("🛣️ Ruta más corta")
        col1, col2 = st.columns(2)
        with col1:
            origin = st.text_input("Origen (ID nodo)", "TM_Portal Tunal")
        with col2:
            dest = st.text_input("Destino (ID nodo)", "TM_Portal Suba")

        if st.button("🔍 Buscar ruta"):
            result = api.get_path(origin, dest)
            if result.get("path"):
                st.success(f"✅ Ruta encontrada: {result['hops']} paradas")
                st.write(result["path"])
            else:
                st.error("❌ No se encontró ruta")

    elif view == "Zonas Peligrosas":
        st.header("🚨 Zonas con mayor siniestralidad")
        limit = st.slider("Top N", 5, 30, 15)
        nodes = api.get_siniestralidad(limit)

        m = create_map()
        for n in nodes:
            score = n.get("properties", {}).get("siniestralidad_score", 0)
            fallecidos = n.get("properties", {}).get("fallecidos_cercanos", 0)
            add_node_marker(m, n, color=COLORS["danger"], radius=10,
                            popup_extra=f"⚠️ Score: {score}<br>💀 Fallecidos: {fallecidos}")
        st_folium(m, width=900, height=600)

        st.subheader("📋 Detalle")
        for n in nodes:
            p = n.get("properties", {})
            st.write(f"🔴 **{n['name']}** — Score: {p.get('siniestralidad_score',0)} — Fallecidos: {p.get('fallecidos_cercanos',0)}")

    elif view == "Accesibilidad":
        st.header("🟣 Zonas con peor accesibilidad")
        st.caption("Nodos con menor closeness centrality = peor conectados")
        limit = st.slider("Top N", 5, 30, 20)
        nodes = api.get_worst_accessibility(limit)

        m = create_map()
        for n in nodes:
            closeness = n.get("properties", {}).get("closeness", 0)
            add_node_marker(m, n, color=COLORS["low_access"], radius=8,
                            popup_extra=f"📊 Closeness: {closeness}")
        st_folium(m, width=900, height=600)

    elif view == "Nodos Centrales":
        st.header("🟢 Nodos más centrales (betweenness)")
        st.caption("Los 'cuellos de botella' de la red — si fallan, colapsa el sistema")
        limit = st.slider("Top N", 5, 20, 10)
        nodes = api.get_top("betweenness", limit)

        m = create_map()
        for n in nodes:
            bc = n.get("properties", {}).get("betweenness", 0)
            add_node_marker(m, n, color=COLORS["central"], radius=12,
                            popup_extra=f"📊 Betweenness: {bc}")
        st_folium(m, width=900, height=600)

        st.subheader("📋 Top nodos centrales")
        for i, n in enumerate(nodes, 1):
            p = n.get("properties", {})
            st.write(f"**{i}. {n['name']}** — Betweenness: {p.get('betweenness',0)} — Grado: {p.get('grado',0)}")

    elif view == "Métricas":
        st.header("📊 Métricas del Grafo")
        metrics = api.get_metrics()

        col1, col2, col3, col4 = st.columns(4)
        col1.metric("🔵 Nodos", f"{metrics['total_nodes']:,}")
        col2.metric("🔗 Aristas", f"{metrics['total_edges']:,}")
        col3.metric("🧩 Componentes", metrics["connected_components"])
        col4.metric("📈 Grado máx", metrics["max_degree"])

        st.divider()
        attrs = metrics.get("graph_attributes", {})

        col1, col2 = st.columns(2)
        with col1:
            st.subheader("🚗 Parque Automotor Bogotá")
            st.metric("Total vehículos", f"{int(attrs.get('parque_automotor_total', 0)):,}")
            st.write(f"🚗 Automóviles: {int(attrs.get('parque_automovil', 0)):,}")
            st.write(f"🏍️ Motos: {int(attrs.get('parque_motocicleta', 0)):,}")
            st.write(f"🚙 Camionetas: {int(attrs.get('parque_camioneta', 0)):,}")

        with col2:
            st.subheader("🚨 Siniestralidad 2024")
            st.metric("Total accidentes", f"{int(attrs.get('accidentes_total', 0)):,}")
            st.write(f"🤕 Con heridos: {int(attrs.get('accidentes_con_heridos', 0)):,}")
            st.write(f"💀 Con muertos: {int(attrs.get('accidentes_con_muertos', 0)):,}")
            st.write(f"🏍️ Vehículo #1: {attrs.get('accidentes_top_vehiculo', '')}")

        st.divider()
        st.subheader("📈 Demanda Transmilenio")
        st.write(f"Promedio/día: {int(attrs.get('demanda_promedio_dia', 0)):,} pasajeros")
        st.write(f"Máximo/día: {int(attrs.get('demanda_max_dia', 0)):,} pasajeros")
        st.write(f"Período: {attrs.get('demanda_periodo', '')}")

except Exception as e:
    st.error(f"⚠️ Error conectando al backend: {e}")
    st.info("Asegúrate de que el backend esté corriendo: `cd backend && uvicorn main:app --reload`")
