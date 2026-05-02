"""Graph endpoints — Thin controllers, delegate to services."""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.api.v1.schemas import NodeResponse, EdgeResponse, GraphMetricsResponse, PathResponse, NearbyNodeResponse
from app.api.v1.mappers import node_to_response, edge_to_response, metrics_to_response
from app.core.dependencies import get_mobility_service, get_accessibility_service
from app.domain.services.mobility_service import MobilityService, AccessibilityService

router = APIRouter(prefix="/graph", tags=["Graph"])


@router.get("/metrics", response_model=GraphMetricsResponse)
def get_metrics(svc: MobilityService = Depends(get_mobility_service)):
    return metrics_to_response(svc.get_graph_stats())


@router.get("/nodes", response_model=List[NodeResponse])
def list_nodes(
    node_type: Optional[str] = Query(None, description="Filter: estacion_tm, paradero_sitp"),
    limit: int = Query(100, le=1000),
    svc: MobilityService = Depends(get_mobility_service),
):
    return [node_to_response(n) for n in svc.list_stations(node_type, limit)]


@router.get("/nodes/{node_id}", response_model=NodeResponse)
def get_node(node_id: str, svc: MobilityService = Depends(get_mobility_service)):
    node = svc.get_station(node_id)
    if not node:
        raise HTTPException(404, "Node not found")
    return node_to_response(node)


@router.get("/nodes/{node_id}/neighbors", response_model=List[NodeResponse])
def get_neighbors(node_id: str, svc: MobilityService = Depends(get_mobility_service)):
    return [node_to_response(n) for n in svc.get_connections(node_id)]


@router.get("/path", response_model=PathResponse)
def find_path(
    origin: str = Query(...),
    destination: str = Query(...),
    svc: MobilityService = Depends(get_mobility_service),
):
    path = svc.find_route(origin, destination)
    if not path:
        raise HTTPException(404, "No path found")
    return PathResponse(origin=origin, destination=destination, path=path, hops=len(path) - 1)


@router.get("/nearby", response_model=List[NearbyNodeResponse])
def find_nearby(
    lat: float = Query(...),
    lon: float = Query(...),
    radius_km: float = Query(0.5, le=5.0),
    limit: int = Query(10, le=50),
    svc: MobilityService = Depends(get_mobility_service),
):
    results = svc.find_nearby(lat, lon, radius_km, limit)
    return [NearbyNodeResponse(node=node_to_response(n), distance_km=d) for n, d in results]


@router.get("/top/{metric}", response_model=List[NodeResponse])
def get_top_nodes(
    metric: str,
    limit: int = Query(10, le=50),
    svc: MobilityService = Depends(get_mobility_service),
):
    return [node_to_response(n) for n in svc.get_most_central(metric, limit)]


@router.get("/accessibility/worst", response_model=List[NodeResponse])
def get_worst_accessibility(
    limit: int = Query(20, le=50),
    svc: AccessibilityService = Depends(get_accessibility_service),
):
    return [node_to_response(n) for n in svc.get_least_accessible(limit)]


@router.get("/siniestralidad/top", response_model=List[NodeResponse])
def get_most_dangerous(
    limit: int = Query(20, le=50),
    svc: AccessibilityService = Depends(get_accessibility_service),
):
    return [node_to_response(n) for n in svc.get_most_dangerous(limit)]
