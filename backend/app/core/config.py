"""Application settings — Single Responsibility."""
from pathlib import Path
from dataclasses import dataclass


@dataclass
class Settings:
    app_name: str = "GrafoMov API"
    app_version: str = "0.1.0"
    debug: bool = True
    graph_path: str = str(
        Path(__file__).resolve().parent.parent.parent.parent / "data" / "graphs" / "grafo_movilidad_bogota_enriched.graphml"
    )
    api_prefix: str = "/api/v1"


settings = Settings()
