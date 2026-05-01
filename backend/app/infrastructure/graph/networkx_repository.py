"""NetworkX implementation of GraphRepository (Infrastructure layer)."""
import math
from typing import List, Optional, Tuple

import networkx as nx

from app.domain.entities.models import Node, Edge, GraphMetrics, Coordinates
from app.domain.repositories.graph_repository import GraphRepository


class NetworkXGraphRepository(GraphRepository):
    """Concrete graph repository backed by NetworkX."""

    def __init__(self, graph: nx.MultiDiGraph):
        self._G = graph
        self._undirected = graph.to_undirected()

    @classmethod
    def from_graphml(cls, path: str) -> "NetworkXGraphRepository":
        G = nx.read_graphml(path)
        return cls(G)

    def _to_node(self, node_id: str) -> Optional[Node]:
        if node_id not in self._G:
            return None
        d = dict(self._G.nodes[node_id])
        lat = float(d.pop("lat", 0))
        lon = float(d.pop("lon", 0))
        return Node(
            id=node_id,
            name=d.pop("nombre", ""),
            node_type=d.pop("tipo", ""),
            coordinates=Coordinates(lat, lon),
            properties=d,
        )

    def get_node(self, node_id: str) -> Optional[Node]:
        return self._to_node(node_id)

    def get_nodes(self, node_type: Optional[str] = None, limit: int = 100) -> List[Node]:
        result = []
        for nid, d in self._G.nodes(data=True):
            if node_type and d.get("tipo") != node_type:
                continue
            node = self._to_node(nid)
            if node:
                result.append(node)
            if len(result) >= limit:
                break
        return result

    def get_neighbors(self, node_id: str) -> List[Node]:
        if node_id not in self._G:
            return []
        return [self._to_node(n) for n in self._G.neighbors(node_id) if self._to_node(n)]

    def get_edges(self, node_id: str) -> List[Edge]:
        if node_id not in self._G:
            return []
        edges = []
        for _, target, d in self._G.edges(node_id, data=True):
            edges.append(Edge(
                source_id=node_id,
                target_id=target,
                edge_type=d.get("tipo", ""),
                properties={k: v for k, v in d.items() if k != "tipo"},
            ))
        return edges

    def get_metrics(self) -> GraphMetrics:
        comps = list(nx.connected_components(self._undirected))
        degs = [d for _, d in self._G.degree()]
        return GraphMetrics(
            total_nodes=self._G.number_of_nodes(),
            total_edges=self._G.number_of_edges(),
            connected_components=len(comps),
            largest_component_size=max(len(c) for c in comps),
            avg_degree=round(sum(degs) / len(degs), 2) if degs else 0,
            max_degree=max(degs) if degs else 0,
            graph_attributes=dict(self._G.graph),
        )

    def find_shortest_path(self, origin_id: str, destination_id: str) -> List[str]:
        try:
            return nx.shortest_path(self._undirected, origin_id, destination_id)
        except (nx.NetworkXNoPath, nx.NodeNotFound):
            return []

    def find_nearest_nodes(self, coords: Coordinates, radius_km: float, limit: int) -> List[Tuple[Node, float]]:
        results = []
        for nid, d in self._G.nodes(data=True):
            nlat, nlon = float(d.get("lat", 0)), float(d.get("lon", 0))
            if nlat == 0 or nlon == 0:
                continue
            dist = self._haversine(coords.lat, coords.lon, nlat, nlon)
            if dist <= radius_km:
                node = self._to_node(nid)
                if node:
                    results.append((node, round(dist, 3)))
        results.sort(key=lambda x: x[1])
        return results[:limit]

    def get_top_nodes_by(self, metric: str, limit: int) -> List[Node]:
        ascending = metric.endswith("_asc")
        key = metric.replace("_asc", "")

        scored = []
        for nid, d in self._G.nodes(data=True):
            val = d.get(key)
            if val is not None:
                try:
                    scored.append((nid, float(val)))
                except (ValueError, TypeError):
                    continue

        scored.sort(key=lambda x: x[1], reverse=not ascending)
        return [self._to_node(nid) for nid, _ in scored[:limit] if self._to_node(nid)]

    @staticmethod
    def _haversine(lat1, lon1, lat2, lon2):
        R = 6371
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
        return R * 2 * math.asin(math.sqrt(a))
