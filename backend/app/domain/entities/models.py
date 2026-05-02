"""Domain entities — Pure data models, no dependencies."""
from dataclasses import dataclass, field
from typing import Optional


@dataclass(frozen=True)
class Coordinates:
    lat: float
    lon: float


@dataclass
class Node:
    id: str
    name: str
    node_type: str  # estacion_tm, paradero_sitp, conexion_troncal
    coordinates: Coordinates
    properties: dict = field(default_factory=dict)


@dataclass
class Edge:
    source_id: str
    target_id: str
    edge_type: str  # ruta_troncal, secuencia_ruta, ruta_zonal
    properties: dict = field(default_factory=dict)


@dataclass
class Route:
    id: str
    name: str
    origin: str
    destination: str
    route_type: str
    length_km: float = 0.0
    properties: dict = field(default_factory=dict)


@dataclass
class GraphMetrics:
    total_nodes: int
    total_edges: int
    connected_components: int
    largest_component_size: int
    avg_degree: float
    max_degree: int
    graph_attributes: dict = field(default_factory=dict)
