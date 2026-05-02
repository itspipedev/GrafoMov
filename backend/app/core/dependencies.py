"""Dependency injection — Swappable backends via config."""
from functools import lru_cache

from app.core.config import settings
from app.domain.repositories.graph_repository import GraphRepository
from app.domain.services.mobility_service import MobilityService, AccessibilityService


@lru_cache()
def get_graph_repository() -> GraphRepository:
    if settings.graph_backend == "postgis":
        from app.infrastructure.graph.postgis_repository import PostGISGraphRepository
        return PostGISGraphRepository(settings.db_dsn)
    else:
        from app.infrastructure.graph.networkx_repository import NetworkXGraphRepository
        return NetworkXGraphRepository.from_graphml(settings.graph_path)


def get_mobility_service() -> MobilityService:
    return MobilityService(get_graph_repository())


def get_accessibility_service() -> AccessibilityService:
    return AccessibilityService(get_graph_repository())
