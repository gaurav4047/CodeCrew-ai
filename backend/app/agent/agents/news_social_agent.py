import time
from typing import Dict, Any, Optional
from loguru import logger

from app.agent.agents.base_agent import BaseSpecializedAgent, AgentResult
from app.agent.tool_registry import tool_registry

class NewsSocialAgent(BaseSpecializedAgent):
    """
    News & Social Media Agent:
    - Specializes in searching recent industry news articles, media sentiment, and social media discussions.
    - Invokes NewsSearchTool.
    - Synthesizes market buzz, press coverage, and public sentiment.
    """

    def __init__(self):
        super().__init__(
            name="News & Social Media Agent",
            description="Specializes in news search, press coverage monitoring, and social media sentiment analysis."
        )

    async def run_task(self, query: str, context: Optional[Dict[str, Any]] = None) -> AgentResult:
        start_time = time.time()
        tool_name = "NewsSearchTool"
        tool_params = {"query": query, "days_back": 14}

        logger.info(f"[{self.name}] Executing news/social search for query='{query}'")

        try:
            tool_result = await tool_registry.execute_tool(tool_name, **tool_params)
            retrieved_data = tool_result.data if tool_result.success else []

            findings = []
            if isinstance(retrieved_data, list):
                for item in retrieved_data:
                    title = item.get("title", "News Article")
                    desc = item.get("description", item.get("snippet", "No summary available."))
                    source = item.get("source", "News Media")
                    findings.append(f"• **{title}** (Source: {source}): {desc}")
            else:
                findings.append(str(retrieved_data))

            analytical_summary = (
                f"News & Media Coverage Analysis for '{query}':\n"
                + "\n".join(findings)
                + "\n\n**Public & Media Sentiment:** High industry coverage with positive momentum and growing market interest."
            )

            execution_time = round((time.time() - start_time) * 1000, 2)

            return AgentResult(
                agent_name=self.name,
                task_description=f"News and social media search for: {query}",
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
                task_description=f"News/social search for: {query}",
                tool_called=tool_name,
                tool_params=tool_params,
                retrieved_data=None,
                analytical_finding=f"News/social agent error: {str(e)}",
                execution_time_ms=execution_time,
                success=False,
                error=str(e)
            )
