"""API response schemas — Separate from domain entities (Interface Segregation)."""
from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class CoordinatesResponse(BaseModel):
    lat: float
    lon: float


class NodeResponse(BaseModel):
    id: str
    name: str
    node_type: str
    coordinates: CoordinatesResponse
    properties: Dict[str, Any] = {}


class EdgeResponse(BaseModel):
    source_id: str
    target_id: str
    edge_type: str
    properties: Dict[str, Any] = {}


class GraphMetricsResponse(BaseModel):
    total_nodes: int
    total_edges: int
    connected_components: int
    largest_component_size: int
    avg_degree: float
    max_degree: int
    graph_attributes: Dict[str, Any] = {}


class PathResponse(BaseModel):
    origin: str
    destination: str
    path: List[str]
    hops: int


class NearbyNodeResponse(BaseModel):
    node: NodeResponse
    distance_km: float
