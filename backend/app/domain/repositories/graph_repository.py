"""Repository interfaces — Contracts for data access (Dependency Inversion Principle)."""
from abc import ABC, abstractmethod
from typing import List, Optional, Tuple

from app.domain.entities.models import Node, Edge, GraphMetrics, Coordinates


class GraphRepository(ABC):
    """Contract for graph data access."""

    @abstractmethod
    def get_node(self, node_id: str) -> Optional[Node]:
        ...

    @abstractmethod
    def get_nodes(self, node_type: Optional[str] = None, limit: int = 100) -> List[Node]:
        ...

    @abstractmethod
    def get_neighbors(self, node_id: str) -> List[Node]:
        ...

    @abstractmethod
    def get_edges(self, node_id: str) -> List[Edge]:
        ...

    @abstractmethod
    def get_metrics(self) -> GraphMetrics:
        ...

    @abstractmethod
    def find_shortest_path(self, origin_id: str, destination_id: str) -> List[str]:
        ...

    @abstractmethod
    def find_nearest_nodes(self, coords: Coordinates, radius_km: float, limit: int) -> List[Tuple[Node, float]]:
        ...

    @abstractmethod
    def get_top_nodes_by(self, metric: str, limit: int) -> List[Node]:
        ...
