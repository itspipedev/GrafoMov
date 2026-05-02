"""PostGIS implementation of GraphRepository — Same interface, fast geo queries."""
import json
from typing import List, Optional, Tuple

import psycopg2
import psycopg2.extras

from app.domain.entities.models import Node, Edge, GraphMetrics, Coordinates
from app.domain.repositories.graph_repository import GraphRepository


class PostGISGraphRepository(GraphRepository):
    """Graph repository backed by PostgreSQL + PostGIS."""

    def __init__(self, dsn: str):
        self._dsn = dsn

    def _conn(self):
        return psycopg2.connect(self._dsn)

    def _row_to_node(self, row) -> Node:
        return Node(
            id=row["id"],
            name=row["name"],
            node_type=row["node_type"],
            coordinates=Coordinates(lat=row["lat"], lon=row["lon"]),
            properties=row.get("properties") or {},
        )

    def get_node(self, node_id: str) -> Optional[Node]:
        with self._conn() as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(
                    "SELECT id, name, node_type, ST_Y(geom) as lat, ST_X(geom) as lon, properties FROM nodes WHERE id = %s",
                    (node_id,),
                )
                row = cur.fetchone()
                return self._row_to_node(row) if row else None

    def get_nodes(self, node_type: Optional[str] = None, limit: int = 100) -> List[Node]:
        with self._conn() as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                if node_type:
                    cur.execute(
                        "SELECT id, name, node_type, ST_Y(geom) as lat, ST_X(geom) as lon, properties FROM nodes WHERE node_type = %s LIMIT %s",
                        (node_type, limit),
                    )
                else:
                    cur.execute(
                        "SELECT id, name, node_type, ST_Y(geom) as lat, ST_X(geom) as lon, properties FROM nodes LIMIT %s",
                        (limit,),
                    )
                return [self._row_to_node(r) for r in cur.fetchall()]

    def get_neighbors(self, node_id: str) -> List[Node]:
        with self._conn() as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(
                    """SELECT n.id, n.name, n.node_type, ST_Y(n.geom) as lat, ST_X(n.geom) as lon, n.properties
                       FROM edges e JOIN nodes n ON e.target_id = n.id
                       WHERE e.source_id = %s""",
                    (node_id,),
                )
                return [self._row_to_node(r) for r in cur.fetchall()]

    def get_edges(self, node_id: str) -> List[Edge]:
        with self._conn() as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(
                    "SELECT source_id, target_id, edge_type, properties FROM edges WHERE source_id = %s",
                    (node_id,),
                )
                return [
                    Edge(source_id=r["source_id"], target_id=r["target_id"],
                         edge_type=r["edge_type"], properties=r.get("properties") or {})
                    for r in cur.fetchall()
                ]

    def get_metrics(self) -> GraphMetrics:
        with self._conn() as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute("SELECT COUNT(*) as cnt FROM nodes")
                total_nodes = cur.fetchone()["cnt"]
                cur.execute("SELECT COUNT(*) as cnt FROM edges")
                total_edges = cur.fetchone()["cnt"]
                cur.execute("SELECT key, value FROM graph_metadata")
                attrs = {r["key"]: r["value"] for r in cur.fetchall()}
        return GraphMetrics(
            total_nodes=total_nodes,
            total_edges=total_edges,
            connected_components=int(attrs.get("connected_components", 0)),
            largest_component_size=int(attrs.get("largest_component_size", 0)),
            avg_degree=float(attrs.get("avg_degree", 0)),
            max_degree=int(attrs.get("max_degree", 0)),
            graph_attributes=attrs,
        )

    def find_shortest_path(self, origin_id: str, destination_id: str) -> List[str]:
        # PostGIS no tiene pathfinding nativo — delegamos a NetworkX o pgRouting
        # Por ahora retornamos vacío, se implementará con pgRouting o NetworkX híbrido
        return []

    def find_nearest_nodes(self, coords: Coordinates, radius_km: float, limit: int) -> List[Tuple[Node, float]]:
        """Fast geo query using PostGIS ST_DWithin + spatial index."""
        with self._conn() as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(
                    """SELECT id, name, node_type, ST_Y(geom) as lat, ST_X(geom) as lon, properties,
                              ST_Distance(geom::geography, ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography) / 1000.0 as dist_km
                       FROM nodes
                       WHERE ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography, %s)
                       ORDER BY dist_km
                       LIMIT %s""",
                    (coords.lon, coords.lat, coords.lon, coords.lat, radius_km * 1000, limit),
                )
                return [(self._row_to_node(r), round(r["dist_km"], 3)) for r in cur.fetchall()]

    def get_top_nodes_by(self, metric: str, limit: int) -> List[Node]:
        ascending = metric.endswith("_asc")
        key = metric.replace("_asc", "")
        order = "ASC" if ascending else "DESC"
        with self._conn() as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(
                    f"""SELECT id, name, node_type, ST_Y(geom) as lat, ST_X(geom) as lon, properties
                        FROM nodes
                        WHERE (properties->>%s) IS NOT NULL
                        ORDER BY (properties->>%s)::float {order}
                        LIMIT %s""",
                    (key, key, limit),
                )
                return [self._row_to_node(r) for r in cur.fetchall()]
