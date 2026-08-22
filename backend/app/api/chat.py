from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.agent.agent_orchestrator import agent_orchestrator
from loguru import logger

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[dict]] = []


class ChatResponse(BaseModel):
    response: str
    tool_used: Optional[str] = None
    tool_params: Optional[Dict[str, Any]] = None
    retrieved_data: Optional[Any] = None
    agents_involved: Optional[List[str]] = []
    agent_activity: Optional[List[Dict[str, Any]]] = []
    execution_time_ms: Optional[float] = 0.0


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Multi-Agent Chat endpoint powered by AI Orchestrator:
    - Analyzes query intent and delegates to specialized sub-agents (Research Intelligence Agent, Competitive Intelligence Agent)
    - Dynamically executes sub-agent tool pipelines
    - Performs cross-agent analytical synthesis and returns step-by-step Agent Activity trace
    """
    try:
        result = await agent_orchestrator.process_query(
            user_message=request.message,
            conversation_history=request.conversation_history
        )
        return ChatResponse(
            response=result["response"],
            tool_used=result.get("tool_used"),
            tool_params=result.get("tool_params"),
            retrieved_data=result.get("retrieved_data"),
            agents_involved=result.get("agents_involved", []),
            agent_activity=result.get("agent_activity", []),
            execution_time_ms=result.get("execution_time_ms", 0.0)
        )
    except Exception as e:
        logger.error(f"Error processing chat request with agent orchestrator: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing chat request: {str(e)}"
        )
