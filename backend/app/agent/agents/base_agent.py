import time
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class AgentResult(BaseModel):
    """Standardized result container for specialized sub-agent execution"""
    agent_name: str
    task_description: str
    tool_called: str
    tool_params: Dict[str, Any]
    retrieved_data: Any
    analytical_finding: str
    execution_time_ms: float = 0.0
    success: bool = True
    error: Optional[str] = None

class BaseSpecializedAgent(ABC):
    """Abstract Base Class for Specialized Sub-Agents"""

    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description

    @abstractmethod
    async def run_task(self, query: str, context: Optional[Dict[str, Any]] = None) -> AgentResult:
        """Execute agent task using appropriate domain tools and perform domain-specific analysis"""
        pass
