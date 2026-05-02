"""Mappers — Domain entities to API schemas (Open/Closed Principle)."""
from app.domain.entities.models import Node, Edge, GraphMetrics
from app.api.v1.schemas import NodeResponse, EdgeResponse, GraphMetricsResponse, CoordinatesResponse


def node_to_response(node: Node) -> NodeResponse:
    return NodeResponse(
        id=node.id,
        name=node.name,
        node_type=node.node_type,
        coordinates=CoordinatesResponse(lat=node.coordinates.lat, lon=node.coordinates.lon),
        properties=node.properties,
    )


def edge_to_response(edge: Edge) -> EdgeResponse:
    return EdgeResponse(
        source_id=edge.source_id,
        target_id=edge.target_id,
        edge_type=edge.edge_type,
        properties=edge.properties,
    )


def metrics_to_response(metrics: GraphMetrics) -> GraphMetricsResponse:
    return GraphMetricsResponse(
        total_nodes=metrics.total_nodes,
        total_edges=metrics.total_edges,
        connected_components=metrics.connected_components,
        largest_component_size=metrics.largest_component_size,
        avg_degree=metrics.avg_degree,
        max_degree=metrics.max_degree,
        graph_attributes=metrics.graph_attributes,
    )
