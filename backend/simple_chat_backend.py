from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from dotenv import load_dotenv
import os
import sys

# Ensure backend directory is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.agent.agent_orchestrator import agent_orchestrator

# Load environment variables
load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

class InsightStats(BaseModel):
    total_insights: int = 0
    unread_insights: int = 0
    recent_insights: int = 0
    high_priority_insights: int = 0

@app.get("/")
async def root():
    return {"message": "Multi-Agent Intelligence API with Orchestrator", "status": "operational"}

@app.get("/api/insights/stats/summary")
async def get_insights_stats():
    """Return mock stats for the frontend"""
    return InsightStats()

@app.get("/api/models")
async def get_available_models():
    """Get available models from Groq API"""
    return {"models": ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "grok-beta"]}

@app.get("/api/insights/")
async def get_insights():
    """Return empty insights list for the frontend"""
    return []

@app.get("/api/tracking/")
async def get_tracking_configs():
    """Return empty tracking configs for the frontend"""
    return []

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Multi-Agent Chatbot API:
    - AI Orchestrator dynamically delegates to specialized agents
    - Sub-agents invoke domain tools
    - Performs cross-agent synthesis & returns Agent Activity trace
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
        print(f"Chat execution error: {str(e)}")
        return ChatResponse(
            response=f"An error occurred while executing multi-agent orchestrator: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    print("Starting Multi-Agent Intelligence Chatbot API...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
