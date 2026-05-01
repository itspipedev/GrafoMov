"""GrafoMov API — Entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.endpoints import graph

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Grafo inteligente de movilidad urbana para Bogotá",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(graph.router, prefix=settings.api_prefix)


@app.get("/health")
def health():
    return {"status": "ok", "app": settings.app_name, "version": settings.app_version}
