"""Agent endpoint — Chat with the mobility graph."""
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.dependencies import get_graph_repository
from app.domain.repositories.graph_repository import GraphRepository
from app.infrastructure.ai.agent import MobilityAgent

router = APIRouter(prefix="/agent", tags=["Agent"])

_agents: dict = {}


class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"


class ChatResponse(BaseModel):
    response: str
    session_id: str


def _get_agent(session_id: str, repo: GraphRepository) -> MobilityAgent:
    if session_id not in _agents:
        _agents[session_id] = MobilityAgent(repo)
    return _agents[session_id]


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest, repo: GraphRepository = Depends(get_graph_repository)):
    agent = _get_agent(req.session_id, repo)
    response = agent.chat(req.message)
    return ChatResponse(response=response, session_id=req.session_id)


@router.post("/reset")
def reset(session_id: str = "default"):
    if session_id in _agents:
        _agents[session_id].reset()
    return {"status": "ok"}
