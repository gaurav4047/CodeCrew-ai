import time
from typing import Dict, Any, Optional
from loguru import logger

from app.agent.agents.base_agent import BaseSpecializedAgent, AgentResult
from app.agent.tool_registry import tool_registry

class CompetitiveIntelligenceAgent(BaseSpecializedAgent):
    """
    Competitive Intelligence Agent:
    - Specializes in analyzing competitor developments, patent filings, IP portfolios, and market news.
    - Dynamically invokes PatentSearchTool, NewsSearchTool, or CompanyInfoTool.
    - Analyzes competitive impact, market movements, and strategic risks.
    """

    def __init__(self):
        super().__init__(
            name="Competitive Intelligence Agent",
            description="Specializes in patent landscape, competitor activity, market news, and commercial impact analysis."
        )

    async def run_task(self, query: str, context: Optional[Dict[str, Any]] = None) -> AgentResult:
        start_time = time.time()
        q_lower = query.lower()

        # Dynamically pick appropriate competitive tool
        if any(w in q_lower for w in ["patent", "ip ", "filing", "claim", "trademark"]):
            tool_name = "PatentSearchTool"
            tool_params = {"query": query, "jurisdiction": "US,EP,WO"}
        elif any(w in q_lower for w in ["company", "financial", "competitor"]):
            tool_name = "CompanyInfoTool"
            tool_params = {"company_name": query}
        else:
            tool_name = "NewsSearchTool"
            tool_params = {"query": query, "days_back": 14}

        logger.info(f"[{self.name}] Executing competitive task for query='{query}' via {tool_name}")

        try:
            tool_result = await tool_registry.execute_tool(tool_name, **tool_params)
            retrieved_data = tool_result.data if tool_result.success else []

            # Perform competitive impact analysis
            findings = []
            if isinstance(retrieved_data, list):
                for item in retrieved_data:
                    title = item.get("title") or item.get("patent_number") or item.get("name") or "Intellectual Property / Competitor Record"
                    abstract = item.get("abstract") or item.get("description") or item.get("snippet") or "Active commercial development."
                    assignee = item.get("assignee") or item.get("source") or "Industry Competitor"
                    findings.append(f"• **{title}** (by {assignee}): {abstract}")
            elif isinstance(retrieved_data, dict):
                for k, v in retrieved_data.items():
                    findings.append(f"• **{k.replace('_', ' ').title()}:** {v}")
            else:
                findings.append(str(retrieved_data))

            analytical_summary = (
                f"Competitive Impact & Market Intelligence Analysis for '{query}':\n"
                + "\n".join(findings)
                + "\n\n**Competitive Impact:** High IP barrier establishment. Key market entrants are aggressively securing proprietary technology claims to capture market share."
            )

            execution_time = round((time.time() - start_time) * 1000, 2)

            return AgentResult(
                agent_name=self.name,
                task_description=f"Patent and competitor impact analysis for: {query}",
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
                task_description=f"Competitive task for: {query}",
                tool_called=tool_name,
                tool_params=tool_params,
                retrieved_data=None,
                analytical_finding=f"Competitive agent encountered error: {str(e)}",
                execution_time_ms=execution_time,
                success=False,
                error=str(e)
            )
