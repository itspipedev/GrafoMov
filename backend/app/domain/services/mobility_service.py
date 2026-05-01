"""Domain services — Business logic, depends only on repository interfaces."""
from typing import List, Optional, Tuple

from app.domain.entities.models import Node, GraphMetrics, Coordinates
from app.domain.repositories.graph_repository import GraphRepository


class MobilityService:
    """Core business logic for mobility graph queries."""

    def __init__(self, graph_repo: GraphRepository):
        self._repo = graph_repo

    def get_station(self, node_id: str) -> Optional[Node]:
        return self._repo.get_node(node_id)

    def list_stations(self, node_type: Optional[str] = None, limit: int = 100) -> List[Node]:
        return self._repo.get_nodes(node_type=node_type, limit=limit)

    def get_connections(self, node_id: str) -> List[Node]:
        return self._repo.get_neighbors(node_id)

    def find_route(self, origin_id: str, destination_id: str) -> List[str]:
        return self._repo.find_shortest_path(origin_id, destination_id)

    def get_graph_stats(self) -> GraphMetrics:
        return self._repo.get_metrics()

    def find_nearby(self, lat: float, lon: float, radius_km: float = 0.5, limit: int = 10) -> List[Tuple[Node, float]]:
        return self._repo.find_nearest_nodes(Coordinates(lat, lon), radius_km, limit)

    def get_most_central(self, metric: str = "betweenness", limit: int = 10) -> List[Node]:
        return self._repo.get_top_nodes_by(metric, limit)


class AccessibilityService:
    """Analyzes transport accessibility and equity."""

    def __init__(self, graph_repo: GraphRepository):
        self._repo = graph_repo

    def get_least_accessible(self, limit: int = 20) -> List[Node]:
        """Nodes with lowest closeness centrality = worst connected."""
        return self._repo.get_top_nodes_by("closeness_asc", limit)

    def get_most_dangerous(self, limit: int = 20) -> List[Node]:
        """Nodes with highest siniestralidad score."""
        return self._repo.get_top_nodes_by("siniestralidad_score", limit)
