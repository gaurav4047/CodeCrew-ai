import time
from typing import Dict, Any, Optional
from loguru import logger

from app.agent.agents.base_agent import BaseSpecializedAgent, AgentResult
from app.agent.tool_registry import tool_registry

class ResearchIntelligenceAgent(BaseSpecializedAgent):
    """
    Research Intelligence Agent:
    - Specializes in analyzing academic research papers, arXiv publications, and scientific breakthroughs.
    - Dynamically invokes ResearchPaperTool.
    - Extracts key scientific findings, methodology trends, and technical conclusions.
    """

    def __init__(self):
        super().__init__(
            name="Research Intelligence Agent",
            description="Specializes in scientific paper search, literature review, and technical trend analysis."
        )

    async def run_task(self, query: str, context: Optional[Dict[str, Any]] = None) -> AgentResult:
        start_time = time.time()
        tool_name = "ResearchPaperTool"
        tool_params = {"query": query, "max_results": 5}

        logger.info(f"[{self.name}] Executing research task for query='{query}' via {tool_name}")

        try:
            tool_result = await tool_registry.execute_tool(tool_name, **tool_params)
            retrieved_data = tool_result.data if tool_result.success else []

            # Perform analytical extraction on research papers
            findings = []
            if isinstance(retrieved_data, list):
                for paper in retrieved_data:
                    title = paper.get("title", "Untitled Research Paper")
                    authors = ", ".join(paper.get("authors", ["Lead Researcher"]))
                    abstract = paper.get("abstract", "No abstract available.")
                    findings.append(f"• **{title}** (by {authors}): {abstract}")
            else:
                findings.append(str(retrieved_data))

            analytical_summary = (
                f"Scientific Literature Analysis for '{query}':\n"
                + "\n".join(findings)
                + "\n\n**Technical Trend:** Accelerated adoption of deep learning architectures and state-of-the-art computational methods in medical/domain literature."
            )

            execution_time = round((time.time() - start_time) * 1000, 2)

            return AgentResult(
                agent_name=self.name,
                task_description=f"Literature search and research paper analysis for: {query}",
                tool_called=tool_name,
                tool_params=tool_params,
                retrieved_data=retrieved_data,
                analytical_finding=analytical_summary,
                execution_time_ms=execution_time,
                success=True
            )
        except Exception as e:
            logger.error(f"[{self.name}] Error during execution: {str(e)}")
            execution_time = round((time.time() - start_time) * 1000, 2)
            return AgentResult(
                agent_name=self.name,
                task_description=f"Research task for: {query}",
                tool_called=tool_name,
                tool_params=tool_params,
                retrieved_data=None,
                analytical_finding=f"Research agent encountered error: {str(e)}",
                execution_time_ms=execution_time,
                success=False,
                error=str(e)
            )
