"""Dependency injection — Wires interfaces to implementations."""
from functools import lru_cache

from app.core.config import settings
from app.domain.repositories.graph_repository import GraphRepository
from app.domain.services.mobility_service import MobilityService, AccessibilityService
from app.infrastructure.graph.networkx_repository import NetworkXGraphRepository


@lru_cache()
def get_graph_repository() -> GraphRepository:
    return NetworkXGraphRepository.from_graphml(settings.graph_path)


def get_mobility_service() -> MobilityService:
    return MobilityService(get_graph_repository())


def get_accessibility_service() -> AccessibilityService:
    return AccessibilityService(get_graph_repository())
