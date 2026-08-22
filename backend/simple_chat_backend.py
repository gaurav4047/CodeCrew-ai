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
    total_insights: int = 4
    unread_insights: int = 2
    recent_insights: int = 4
    high_priority_insights: int = 2

# In-memory tracking storage for dev server
in_memory_tracking = [
    {
        "id": 1,
        "name": "AI Medical Diagnosis & Imaging",
        "tracking_type": "research",
        "keywords": ["AI diagnosis", "medical imaging", "deep learning radiology"],
        "sources": {},
        "check_interval_minutes": 60,
        "is_active": True
    },
    {
        "id": 2,
        "name": "Quantum Computing Patents",
        "tracking_type": "patent",
        "keywords": ["quantum transformer", "qubit architecture", "quantum error correction"],
        "sources": {},
        "check_interval_minutes": 120,
        "is_active": True
    }
]

in_memory_insights = [
    {
        "id": 101,
        "title": "Breakthrough in AI Medical Diagnosis & Neural Radiology",
        "summary": "Recent multi-center study demonstrates 98.4% diagnostic sensitivity in automated CT scan analysis using 3D spatial attention transformers.",
        "full_content": "Detailed breakdown of 3D spatial attention transformer application across 12,000 clinical cases.",
        "source_url": "https://arxiv.org/abs/2026-medical-ai",
        "source_type": "research",
        "priority": "high",
        "category": "breakthrough",
        "relevance_score": 0.96,
        "entities": ["Spatial Transformers", "Clinical Radiology", "AI Diagnosis"],
        "published_at": "2026-08-22T08:00:00Z",
        "discovered_at": "2026-08-22T09:00:00Z",
        "is_read": False,
        "alerted": True
    },
    {
        "id": 102,
        "title": "Key Competitor Files Patent for Low-Latency Neuromorphic Interconnects",
        "summary": "Patent application US20260191A1 covers a scalable hardware layout reducing inter-node memory latency by 42%.",
        "full_content": "Technical claims highlight high-density silicon interposers and sparse attention matrix execution.",
        "source_url": "https://patents.google.com/patent/US20260191A1/en",
        "source_type": "patent",
        "priority": "critical",
        "category": "competitor_activity",
        "relevance_score": 0.92,
        "entities": ["Neuromorphic Computing", "Patent Claims", "Interconnect Architecture"],
        "published_at": "2026-08-21T14:00:00Z",
        "discovered_at": "2026-08-21T15:30:00Z",
        "is_read": False,
        "alerted": True
    }
]

@app.get("/")
async def root():
    return {"message": "360-Degree Multi-Agent Intelligence API", "status": "operational"}

@app.get("/api/insights/stats/summary")
async def get_insights_stats():
    return InsightStats(
        total_insights=len(in_memory_insights),
        unread_insights=len([i for i in in_memory_insights if not i["is_read"]]),
        recent_insights=len(in_memory_insights),
        high_priority_insights=len([i for i in in_memory_insights if i["priority"] in ["high", "critical"]])
    )

@app.get("/api/models")
async def get_available_models():
    return {"models": ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "grok-beta"]}

@app.get("/api/insights/")
async def get_insights():
    return in_memory_insights

@app.get("/api/insights/{insight_id}")
async def get_insight_by_id(insight_id: int):
    for insight in in_memory_insights:
        if insight["id"] == insight_id:
            return insight
    raise HTTPException(status_code=404, detail="Insight not found")

@app.put("/api/insights/{insight_id}")
async def update_insight(insight_id: int, data: Dict[str, Any]):
    for insight in in_memory_insights:
        if insight["id"] == insight_id:
            insight.update(data)
            return insight
    raise HTTPException(status_code=404, detail="Insight not found")

@app.get("/api/tracking/")
async def get_tracking_configs():
    return in_memory_tracking

@app.post("/api/tracking/")
async def create_tracking_config(config: Dict[str, Any]):
    new_id = max([c["id"] for c in in_memory_tracking] + [0]) + 1
    new_config = {
        "id": new_id,
        "name": config.get("name", "New Tracking Target"),
        "tracking_type": config.get("tracking_type", "research"),
        "keywords": config.get("keywords", []),
        "sources": config.get("sources", {}),
        "check_interval_minutes": config.get("check_interval_minutes", 60),
        "is_active": True
    }
    in_memory_tracking.append(new_config)
    return new_config

@app.put("/api/tracking/{config_id}")
async def update_tracking_config(config_id: int, config: Dict[str, Any]):
    for item in in_memory_tracking:
        if item["id"] == config_id:
            item.update(config)
            return item
    raise HTTPException(status_code=404, detail="Tracking configuration not found")

@app.delete("/api/tracking/{config_id}")
async def delete_tracking_config(config_id: int):
    global in_memory_tracking
    in_memory_tracking = [c for c in in_memory_tracking if c["id"] != config_id]
    return {"success": True}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    360° Multi-Agent Chatbot API:
    - AI Orchestrator delegates tasks to specialized sub-agents (Research, Patents, News, Competitors)
    - Concurrently executes domain tools
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
            response=f"An error occurred while executing 360-degree multi-agent orchestrator: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    print("Starting 360-Degree Multi-Agent Intelligence Chatbot API...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
