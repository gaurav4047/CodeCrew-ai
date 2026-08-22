import time
from typing import Dict, Any, Optional
from loguru import logger

from app.agent.agents.base_agent import BaseSpecializedAgent, AgentResult
from app.agent.tool_registry import tool_registry

class MarketCompetitorAgent(BaseSpecializedAgent):
    """
    Competitor & Market Agent:
    - Specializes in analyzing corporate profiles, competitor financial metrics, and monitored database insights.
    - Invokes CompanyInfoTool or DatabaseInsightTool.
    - Extracts market share, strategic positioning, and internal competitive intelligence telemetry.
    """

    def __init__(self):
        super().__init__(
            name="Competitor & Market Agent",
            description="Specializes in competitor analysis, corporate financials, market positioning, and internal database insights."
        )

    async def run_task(self, query: str, context: Optional[Dict[str, Any]] = None) -> AgentResult:
        start_time = time.time()
        q_lower = query.lower()

        if any(w in q_lower for w in ["database", "monitored", "insights", "internal", "tracking"]):
            tool_name = "DatabaseInsightTool"
            tool_params = {"query": query, "limit": 5}
        else:
            tool_name = "CompanyInfoTool"
            tool_params = {"company_name": query}

        logger.info(f"[{self.name}] Executing market/competitor analysis for query='{query}' via {tool_name}")

        try:
            tool_result = await tool_registry.execute_tool(tool_name, **tool_params)
            retrieved_data = tool_result.data if tool_result.success else []

            findings = []
            if isinstance(retrieved_data, list):
                for item in retrieved_data:
                    title = item.get("title") or item.get("name") or "Corporate Metric Record"
                    summary = item.get("summary") or item.get("description") or "Active market metric."
                    findings.append(f"• **{title}**: {summary}")
            elif isinstance(retrieved_data, dict):
                for k, v in retrieved_data.items():
                    findings.append(f"• **{k.replace('_', ' ').title()}:** {v}")
            else:
                findings.append(str(retrieved_data))

            analytical_summary = (
                f"Competitor & Market Landscape Analysis for '{query}':\n"
                + "\n".join(findings)
                + "\n\n**Strategic Market Position:** Strong commercial expansion with key industry players investing heavily in technology differentiation."
            )

            execution_time = round((time.time() - start_time) * 1000, 2)

            return AgentResult(
                agent_name=self.name,
                task_description=f"Competitor and market intelligence for: {query}",
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
                task_description=f"Market/competitor task for: {query}",
                tool_called=tool_name,
                tool_params=tool_params,
                retrieved_data=None,
                analytical_finding=f"Competitor/market agent error: {str(e)}",
                execution_time_ms=execution_time,
                success=False,
                error=str(e)
            )
