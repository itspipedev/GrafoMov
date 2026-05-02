"""GrafoMov Agent — LLM + Graph RAG for natural language queries over the mobility graph."""
import json
import os
from typing import Optional

from openai import OpenAI

from app.domain.repositories.graph_repository import GraphRepository

SYSTEM_PROMPT = """Eres GrafoMov, un asistente inteligente de movilidad urbana para Bogotá, Colombia.
Tienes acceso a un grafo de transporte público con 7,444 nodos (estaciones Transmilenio y paraderos SITP) y 41,990 conexiones.

Puedes responder preguntas sobre:
- Paraderos y estaciones cercanas a una ubicación
- Rutas entre dos puntos
- Zonas peligrosas (siniestralidad vial)
- Accesibilidad del transporte (zonas mal conectadas)
- Nodos más importantes de la red (centralidad)
- Estadísticas generales del sistema

Responde siempre en español, de forma clara y útil. Si no tienes datos suficientes, dilo honestamente.
Cuando uses datos del grafo, menciona la fuente (datos.gov.co, GIS Transmilenio)."""

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "find_nearby",
            "description": "Busca paraderos y estaciones cercanas a una ubicación geográfica",
            "parameters": {
                "type": "object",
                "properties": {
                    "lat": {"type": "number", "description": "Latitud"},
                    "lon": {"type": "number", "description": "Longitud"},
                    "radius_km": {"type": "number", "description": "Radio de búsqueda en km", "default": 0.5},
                },
                "required": ["lat", "lon"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "find_route",
            "description": "Encuentra la ruta más corta entre dos nodos del grafo",
            "parameters": {
                "type": "object",
                "properties": {
                    "origin": {"type": "string", "description": "ID del nodo origen (ej: TM_Portal Tunal)"},
                    "destination": {"type": "string", "description": "ID del nodo destino"},
                },
                "required": ["origin", "destination"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_dangerous_zones",
            "description": "Obtiene las zonas con mayor siniestralidad vial",
            "parameters": {
                "type": "object",
                "properties": {
                    "limit": {"type": "integer", "description": "Cantidad de zonas", "default": 10},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_worst_accessibility",
            "description": "Obtiene las zonas peor conectadas al transporte público",
            "parameters": {
                "type": "object",
                "properties": {
                    "limit": {"type": "integer", "description": "Cantidad de zonas", "default": 10},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_most_central",
            "description": "Obtiene los nodos más centrales/importantes de la red de transporte",
            "parameters": {
                "type": "object",
                "properties": {
                    "limit": {"type": "integer", "description": "Cantidad de nodos", "default": 10},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_graph_stats",
            "description": "Obtiene estadísticas generales del grafo de movilidad",
            "parameters": {"type": "object", "properties": {}},
        },
    },
]


class MobilityAgent:
    """LLM agent with graph tools — supports OpenAI and Ollama."""

    def __init__(self, graph_repo: GraphRepository, provider: str = "auto"):
        self._repo = graph_repo
        self._provider = self._resolve_provider(provider)
        self._client = self._create_client()
        self._history = [{"role": "system", "content": SYSTEM_PROMPT}]

    def _resolve_provider(self, provider: str) -> str:
        if provider != "auto":
            return provider
        if os.getenv("OPENAI_API_KEY"):
            return "openai"
        return "ollama"

    def _create_client(self) -> OpenAI:
        if self._provider == "ollama":
            return OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
        return OpenAI()

    @property
    def _model(self) -> str:
        return "llama3.2:3b" if self._provider == "ollama" else "gpt-4o-mini"

    def chat(self, message: str) -> str:
        self._history.append({"role": "user", "content": message})

        response = self._client.chat.completions.create(
            model=self._model,
            messages=self._history,
            tools=TOOLS if self._provider == "openai" else None,
        )

        msg = response.choices[0].message

        # Handle tool calls (OpenAI)
        if msg.tool_calls:
            self._history.append(msg)
            for tc in msg.tool_calls:
                result = self._execute_tool(tc.function.name, json.loads(tc.function.arguments))
                self._history.append({
                    "role": "tool",
                    "tool_call_id": tc.id,
                    "content": json.dumps(result, ensure_ascii=False),
                })
            # Second call with tool results
            response = self._client.chat.completions.create(
                model=self._model, messages=self._history,
            )
            msg = response.choices[0].message

        self._history.append({"role": "assistant", "content": msg.content})
        return msg.content

    def _execute_tool(self, name: str, args: dict) -> dict:
        if name == "find_nearby":
            from app.domain.entities.models import Coordinates
            results = self._repo.find_nearest_nodes(
                Coordinates(args["lat"], args["lon"]), args.get("radius_km", 0.5), 10
            )
            return [{"name": n.name, "type": n.node_type, "distance_km": d,
                      "lat": n.coordinates.lat, "lon": n.coordinates.lon} for n, d in results]

        elif name == "find_route":
            path = self._repo.find_shortest_path(args["origin"], args["destination"])
            return {"path": path, "hops": len(path) - 1 if path else 0}

        elif name == "get_dangerous_zones":
            nodes = self._repo.get_top_nodes_by("siniestralidad_score", args.get("limit", 10))
            return [{"name": n.name, "score": n.properties.get("siniestralidad_score", 0),
                      "fallecidos": n.properties.get("fallecidos_cercanos", 0)} for n in nodes]

        elif name == "get_worst_accessibility":
            nodes = self._repo.get_top_nodes_by("closeness_asc", args.get("limit", 10))
            return [{"name": n.name, "closeness": n.properties.get("closeness", 0)} for n in nodes]

        elif name == "get_most_central":
            nodes = self._repo.get_top_nodes_by("betweenness", args.get("limit", 10))
            return [{"name": n.name, "betweenness": n.properties.get("betweenness", 0),
                      "grado": n.properties.get("grado", 0)} for n in nodes]

        elif name == "get_graph_stats":
            m = self._repo.get_metrics()
            return {"nodes": m.total_nodes, "edges": m.total_edges,
                    "components": m.connected_components, "largest": m.largest_component_size,
                    **m.graph_attributes}

        return {"error": f"Unknown tool: {name}"}

    def reset(self):
        self._history = [{"role": "system", "content": SYSTEM_PROMPT}]
