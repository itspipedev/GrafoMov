"""Load graph from GraphML into PostGIS."""
import json
import networkx as nx
import psycopg2
from pathlib import Path

DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "dbname": "grafomov",
    "user": "grafomov",
    "password": "grafomov_2026",
}

BASE = Path(__file__).resolve().parent.parent.parent.parent
GRAPH_PATH = BASE / "data" / "graphs" / "grafo_movilidad_bogota_enriched.graphml"
SCHEMA_PATH = Path(__file__).resolve().parent / "schema.sql"


def load():
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    # Create schema
    with open(SCHEMA_PATH) as f:
        cur.execute(f.read())
    conn.commit()
    print("✅ Schema created")

    # Load graph
    G = nx.read_graphml(GRAPH_PATH)
    print(f"📥 Graph loaded: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges")

    # Insert nodes
    count = 0
    for nid, data in G.nodes(data=True):
        lat = float(data.get("lat", 0))
        lon = float(data.get("lon", 0))
        if lat == 0 or lon == 0:
            continue
        name = data.get("nombre", "")
        ntype = data.get("tipo", "")
        props = {k: v for k, v in data.items() if k not in ("lat", "lon", "nombre", "tipo") and v is not None and v != ""}
        cur.execute(
            "INSERT INTO nodes (id, name, node_type, geom, properties) VALUES (%s, %s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s) ON CONFLICT (id) DO NOTHING",
            (nid, name, ntype, lon, lat, json.dumps(props)),
        )
        count += 1
    conn.commit()
    print(f"✅ {count} nodes inserted")

    # Insert edges
    count = 0
    for src, tgt, data in G.edges(data=True):
        etype = data.get("tipo", "")
        props = {k: v for k, v in data.items() if k != "tipo" and v is not None and v != ""}
        try:
            cur.execute(
                "INSERT INTO edges (source_id, target_id, edge_type, properties) VALUES (%s, %s, %s, %s)",
                (src, tgt, etype, json.dumps(props)),
            )
            count += 1
        except psycopg2.errors.ForeignKeyViolation:
            conn.rollback()
            continue
    conn.commit()
    print(f"✅ {count} edges inserted")

    # Insert metadata
    for k, v in G.graph.items():
        if k in ("node_default", "edge_default"):
            continue
        cur.execute(
            "INSERT INTO graph_metadata (key, value) VALUES (%s, %s) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
            (k, str(v)),
        )
    conn.commit()
    print("✅ Metadata inserted")

    cur.close()
    conn.close()
    print("🎉 Done!")


if __name__ == "__main__":
    load()
