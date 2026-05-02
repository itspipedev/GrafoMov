"""Application settings."""
import os
from pathlib import Path
from dataclasses import dataclass


@dataclass
class Settings:
    app_name: str = "GrafoMov API"
    app_version: str = "0.1.0"
    debug: bool = True
    api_prefix: str = "/api/v1"

    # Graph backend: "networkx" or "postgis"
    graph_backend: str = os.getenv("GRAPH_BACKEND", "networkx")

    # NetworkX
    graph_path: str = str(
        Path(__file__).resolve().parent.parent.parent.parent / "data" / "graphs" / "grafo_movilidad_bogota_enriched.graphml"
    )

    # PostGIS
    db_host: str = os.getenv("DB_HOST", "localhost")
    db_port: int = int(os.getenv("DB_PORT", "5432"))
    db_name: str = os.getenv("DB_NAME", "grafomov")
    db_user: str = os.getenv("DB_USER", "grafomov")
    db_password: str = os.getenv("DB_PASSWORD", "grafomov_2026")

    @property
    def db_dsn(self) -> str:
        return f"host={self.db_host} port={self.db_port} dbname={self.db_name} user={self.db_user} password={self.db_password}"


settings = Settings()
