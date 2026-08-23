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
from app.agent.langgraph_orchestrator import langgraph_orchestrator
from app.agent.tracing.tracer import trace_manager

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
    context_memory: Optional[Dict[str, Any]] = None
    execution_events: Optional[List[Dict[str, Any]]] = []
    agent_graph_nodes: Optional[List[Dict[str, Any]]] = []
    self_evaluation: Optional[Dict[str, Any]] = None
    execution_time_ms: Optional[float] = 0.0
    trace_id: Optional[str] = None

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
    return {"message": "Enterprise LangGraph AI Intelligence API & Tracing Engine", "status": "operational"}

@app.get("/api/dashboard/summary")
async def get_dashboard_summary():
    return {
        "kpis": {
            "research_papers": {"count": 1248, "trend": "+12% this month", "status": "active"},
            "patents": {"count": 326, "trend": "+8% this month", "status": "active"},
            "competitors": {"count": 24, "trend": "3 active changes", "status": "monitored"},
            "news_signals": {"count": 412, "trend": "+15% 7d", "status": "active"},
            "social_signals": {"count": 2890, "trend": "+84% 7d", "status": "public_only"},
            "ai_insights": {"count": len(in_memory_insights), "trend": "4 high value", "status": "generated"},
            "active_alerts": {"count": 2, "trend": "1 critical", "status": "unread"},
            "tracked_targets": {"count": len(in_memory_tracking), "trend": "2 active", "status": "running"},
            "threats": {"count": 1, "level": "critical", "status": "action_required"},
            "opportunities": {"count": 2, "level": "emerging", "status": "analyzed"}
        },
        "active_research_jobs": [
            {
                "id": "job-101",
                "query": "3D Spatial Radiology Attention & Neuromorphic Interconnects",
                "status": "completed",
                "agents": ["Research ✓", "Patent ✓", "News ✓", "Competitor ✓"],
                "progress": 100,
                "confidence_score": 94.5,
                "started_at": "2026-08-22T17:10:00Z"
            }
        ],
        "latest_intelligence": [
            {
                "id": "intel-1",
                "type": "patent",
                "title": "US20260191A1: Low-Latency Neuromorphic Memory Interconnects",
                "summary": "Patent claim filed covering 3D silicon interposer configuration optimizing inter-node memory bandwidth.",
                "source": "USPTO / Google Patents",
                "date": "2026-08-21",
                "relevance": "96%",
                "confidence": "Fact"
            },
            {
                "id": "intel-2",
                "type": "research",
                "title": "3D Spatial Attention Transformers for Multi-Modal Automated CT",
                "summary": "Stanford AI Health arXiv preprint validating 12,000 CT scans with 98.4% diagnostic sensitivity.",
                "source": "arXiv / PubMed",
                "date": "2026-08-22",
                "relevance": "98%",
                "confidence": "Peer-Reviewed Preprint"
            },
            {
                "id": "intel-3",
                "type": "news",
                "title": "FDA Grants Breakthrough Device Status for AI Spatial Radiology",
                "summary": "Regulatory approval granted for 3D automated nodule detection platform.",
                "source": "Healthcare Tech Press",
                "date": "2026-08-22",
                "relevance": "94%",
                "confidence": "Verified News"
            },
            {
                "id": "intel-4",
                "type": "competitor",
                "title": "Nvidia DGX SuperPOD Clinical Deployment Announced",
                "summary": "Rival hardware deployment targeted at medical AI research laboratories.",
                "source": "Corporate Press Release",
                "date": "2026-08-20",
                "relevance": "90%",
                "confidence": "Verified Corporate Move"
            }
        ],
        "threats_and_opportunities": {
            "threats": [
                {
                    "title": "Competitor Patent Filing targeting Core Interconnect IP",
                    "severity": "critical",
                    "impact": "High Strategic IP Risk",
                    "confidence": "96%",
                    "date": "2026-08-21",
                    "evidence": "US20260191A1 claim overlaps low-latency interposer memory bandwidth."
                }
            ],
            "opportunities": [
                {
                    "title": "Unclaimed 3D Spatial Attention Diagnostic Algorithm Market",
                    "severity": "high",
                    "impact": "First-mover Clinical Advantage",
                    "confidence": "94%",
                    "date": "2026-08-22",
                    "evidence": "FDA breakthrough designation opens 98.4% diagnostic sensitivity deployment window."
                }
            ]
        },
        "competitor_overview": [
            {"name": "Nvidia Corporation", "activity": "High Activity", "status": "active_moves", "recent": "Filed Sparse Matrix Patent US20260191A1"},
            {"name": "MedAI Global Health", "activity": "Moderate Activity", "status": "research_leader", "recent": "Published 12k CT scan diagnostic arXiv paper"},
            {"name": "Quantum Interconnect Systems", "activity": "Emerging Rival", "status": "patent_filing", "recent": "EP4029112A1 Cryo-Logic Interconnect claim"}
        ],
        "patent_landscape": {
            "total_monitored": 28,
            "recent_filings": 3,
            "top_assignees": ["Interconnect Tech", "MedAI Global", "Nvidia Corp"],
            "technology_clusters": ["Neuromorphic Computing", "3D Radiology Diagnostics", "Quantum Logic Interconnects"]
        },
        "research_landscape": {
            "total_papers": 1248,
            "recent_preprints": 18,
            "top_topics": ["3D Spatial Attention", "CT Scan Anomaly Spotting", "Sparse Matrix Acceleration"],
            "top_institutions": ["Stanford Medicine", "MIT AI Health", "Imperial College London"]
        },
        "industry_social_signals": [
            {
                "topic": "3D Spatial Attention CT Diagnostics",
                "source": "Public Developer Forums",
                "sentiment": "88% Positive",
                "mentions": "1,420 (+84% 7d)",
                "is_verified_fact": False
            },
            {
                "topic": "FDA Breakthrough Device Status",
                "source": "Regulatory Press",
                "sentiment": "95% Positive",
                "mentions": "412 (+15% 7d)",
                "is_verified_fact": True
            }
        ],
        "trend_radar": [
            {"topic": "3D Spatial Attention Radiology", "direction": "up", "growth": "+142% MoM", "category": "Emerging", "papers": 18, "patents": 6, "competitors": 4},
            {"topic": "Neuromorphic Memory Interconnects", "direction": "up", "growth": "+88% MoM", "category": "Growing", "papers": 14, "patents": 12, "competitors": 7},
            {"topic": "FP4 Low-Precision Matrix Acceleration", "direction": "stable", "growth": "+35% MoM", "category": "Stable", "papers": 24, "patents": 15, "competitors": 9}
        ],
        "alerts_summary": [
            {"id": 1, "title": "New Competitor Patent Published: US20260191A1", "severity": "critical", "time": "10 mins ago", "read": False},
            {"id": 2, "title": "Breakthrough Research Preprint: 3D Radiology Transformers", "severity": "high", "time": "2 hours ago", "read": False}
        ],
        "tracking_summary": [
            {"id": 1, "name": "AI Medical Diagnosis & Imaging Patents", "type": "research_and_patents", "interval": "60 mins", "active": True},
            {"id": 2, "name": "Quantum Computing & Chipmakers", "type": "competitors_and_news", "interval": "30 mins", "active": True}
        ],
        "agent_system": {
            "status": "Operational",
            "active_agents": 4,
            "total_agents": 4,
            "success_rate": "99.2%",
            "avg_latency_ms": 120,
            "last_execution": "10 mins ago"
        },
        "agentic_capabilities": {
            "dynamic_planning": True,
            "multi_agent": True,
            "parallel_execution": True,
            "conditional_routing": True,
            "checkpointing": True,
            "replanning": True,
            "failure_recovery": True,
            "tool_fallback": True,
            "evidence_verification": True,
            "self_evaluation": True,
            "self_eval_confidence": "94.5%"
        },
        "system_health": {
            "backend_status": "Healthy",
            "database_status": "Healthy",
            "llm_provider": "Groq API (groq/compound)",
            "agent_framework": "LangGraph Stateful Engine",
            "external_apis": "Connected",
            "background_jobs": "Active"
        },
        "data_sources_health": [
            {"source": "arXiv & PubMed", "status": "Connected", "last_sync": "5 mins ago"},
            {"source": "USPTO & EPO Patents", "status": "Connected", "last_sync": "10 mins ago"},
            {"source": "News APIs & Press Releases", "status": "Connected", "last_sync": "2 mins ago"},
            {"source": "Public Social Feeds", "status": "Connected", "last_sync": "1 min ago"}
        ],
        "knowledge_graph_summary": {
            "entities_count": 6,
            "relationships_count": 4,
            "new_connections": 2,
            "last_updated": "Today"
        },
        "reports_summary": {
            "recent_reports_count": 3,
            "supported_formats": ["PDF", "CSV", "JSON"],
            "last_generated": "360° AI Medical Diagnosis Executive Intelligence Briefing"
        },
        "memory_summary": {
            "status": "Active",
            "active_topics_count": 1,
            "retention_turns": 10,
            "last_update": "Just now"
        }
    }

# --- Advanced Tracing & Observability API Endpoints ---

@app.get("/api/observability/summary")
async def get_observability_summary():
    """Returns aggregate observability KPI metrics."""
    return trace_manager.get_observability_summary()

@app.get("/api/observability/traces")
async def get_observability_traces():
    """Returns list of recorded agent execution traces."""
    return trace_manager.traces

@app.get("/api/observability/traces/{trace_id}")
async def get_trace_by_id(trace_id: str):
    """Returns detailed timeline steps for a specific trace."""
    trace = next((t for t in trace_manager.traces if t["trace_id"] == trace_id), None)
    if not trace:
        raise HTTPException(status_code=404, detail="Trace ID not found")
    return trace

@app.post("/api/observability/simulate-failure")
async def simulate_failure():
    """Runs a controlled test failure execution trace."""
    trace = trace_manager.simulate_controlled_failure()
    return trace

@app.get("/api/observability/diagnose/{trace_id}")
async def diagnose_trace_failure(trace_id: str):
    """Generates automatic root-cause analysis and suggested fix for a trace."""
    return trace_manager.diagnose_trace(trace_id)

@app.post("/api/observability/apply-fix")
async def apply_fix():
    """Applies automated safe improvement fix to the tracing engine."""
    return trace_manager.apply_automated_fix()

@app.get("/api/observability/comparison")
async def get_observability_comparison():
    """Returns Before vs After performance metrics comparison matrix."""
    return trace_manager.get_comparison_metrics()

# --- Existing Endpoints ---

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
    return {"models": ["groq/compound", "llama-3.3-70b-versatile", "llama-3.1-8b-instant", "grok-beta"]}

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
    Enterprise LangGraph Multi-Agent API:
    - Context Retrieval & Follow-up query resolution
    - Dynamic Planning & Event Trace Generation
    - Parallel Execution with Fallback Recovery & Conflicting Evidence Resolution
    - Self-Evaluation & Confidence Scoring (e.g. 94.5%)
    - Cross-agent synthesis & Memory update
    - End-to-End Tracing & Observability
    """
    try:
        result = await langgraph_orchestrator.execute_graph(
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
            context_memory=result.get("context_memory"),
            execution_events=result.get("execution_events", []),
            agent_graph_nodes=result.get("agent_graph_nodes", []),
            self_evaluation=result.get("self_evaluation"),
            execution_time_ms=result.get("execution_time_ms", 0.0),
            trace_id=result.get("trace_id")
        )
    except Exception as e:
        print(f"Chat execution error: {str(e)}")
        return ChatResponse(
            response=f"An error occurred while executing Enterprise LangGraph orchestrator: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    print("Starting Enterprise LangGraph Multi-Agent Intelligence Chatbot API with Observability...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
