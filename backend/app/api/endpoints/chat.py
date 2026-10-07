from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Any
from app.agent.copilot import run_copilot_pipeline

router = APIRouter(prefix="/chat", tags=["AI Copilot"])

class ChatRequest(BaseModel):
    message: str = Field(..., description="Pergunta do usuário sobre o BI comercial", min_length=2)
    history: list[dict[str, Any]] | None = Field(default=None, description="Histórico de mensagens")

class ChatResponse(BaseModel):
    reply: str
    sql_query: str
    query_results: list[dict[str, Any]]
    execution_time_ms: float
    mode: str

@router.post("", response_model=ChatResponse)
async def chat_with_copilot(req: ChatRequest):
    result = await run_copilot_pipeline(req.message, req.history)
    return ChatResponse(**result)
