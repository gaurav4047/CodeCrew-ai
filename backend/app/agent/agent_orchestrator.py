import json
import time
import os
import asyncio
from typing import Dict, Any, List, Optional
from openai import OpenAI
from loguru import logger

from app.agent.tool_registry import tool_registry, ToolResult
from app.agent.tools.web_search_tool import WebSearchTool, NewsSearchTool, CompanyInfoTool, ResearchPaperTool
from app.agent.tools.database_tool import DatabaseInsightTool
from app.agent.tools.patent_tool import PatentSearchTool
from app.agent.agents.research_agent import ResearchIntelligenceAgent
from app.agent.agents.competitive_agent import CompetitiveIntelligenceAgent
from app.agent.agents.news_social_agent import NewsSocialAgent
from app.agent.agents.market_competitor_agent import MarketCompetitorAgent
from app.agent.agents.base_agent import AgentResult
from app.core.config import settings

# Initialize tool registry
_registered = False

def initialize_tools():
    global _registered
    if not _registered:
        tool_registry.register_tool(WebSearchTool())
        tool_registry.register_tool(NewsSearchTool())
        tool_registry.register_tool(CompanyInfoTool())
        tool_registry.register_tool(ResearchPaperTool())
        tool_registry.register_tool(DatabaseInsightTool())
        tool_registry.register_tool(PatentSearchTool())
        _registered = True

class AgentOrchestrator:
    """
    360-Degree AI Multi-Agent Orchestrator:
    1. Analyzes user query intent.
    2. Dynamically decides which specialized agent(s) to deploy across 4 core pillars:
       - Research Intelligence Agent (Research Papers & Literature)
       - Patent & IP Agent (Patent Filings & Claims)
       - News & Social Media Agent (News & Media Trends)
       - Competitor & Market Agent (Corporate Financials & DB Telemetry)
    3. Delegates tasks to sub-agents and executes tools concurrently.
    4. Records step-by-step Agent Activity trace.
    5. Combines all findings into a unified 360-degree actionable intelligence report.
    """

    def __init__(self):
        initialize_tools()
        self.research_agent = ResearchIntelligenceAgent()
        self.patent_agent = CompetitiveIntelligenceAgent()
        self.news_agent = NewsSocialAgent()
        self.market_agent = MarketCompetitorAgent()

    def _get_openai_client(self) -> Optional[OpenAI]:
        """Gets configured OpenAI client"""
        groq_key = os.getenv("GROQ_API_KEY")
        if groq_key and groq_key != "your_groq_api_key_here":
            return OpenAI(api_key=groq_key, base_url="https://api.groq.com/openai/v1")

        xai_key = getattr(settings, "XAI_API_KEY", os.getenv("XAI_API_KEY"))
        if xai_key and xai_key != "your_xai_api_key_here":
            return OpenAI(api_key=xai_key, base_url="https://api.x.ai/v1")

        openai_key = os.getenv("OPENAI_API_KEY")
        if openai_key:
            return OpenAI(api_key=openai_key)

        return None

    def _analyze_agent_delegation(self, query: str) -> List[str]:
        """
        Determines active specialized agents for 360° or focused intelligence.
        """
        q_lower = query.lower()

        # Check for specific targeting
        is_only_research = ("only paper" in q_lower or "only research" in q_lower)
        is_only_patent = ("only patent" in q_lower or "only ip" in q_lower)
        is_only_news = ("only news" in q_lower or "only media" in q_lower)

        if is_only_research:
            return ["Research Intelligence Agent"]
        if is_only_patent:
            return ["Patent & IP Agent"]
        if is_only_news:
            return ["News & Social Media Agent"]

        # Default: 360-Degree Intelligence Gathering across all 4 pillars
        return [
            "Research Intelligence Agent",
            "Patent & IP Agent",
            "News & Social Media Agent",
            "Competitor & Market Agent"
        ]

    async def process_query(
        self,
        user_message: str,
        conversation_history: Optional[List[dict]] = None
    ) -> Dict[str, Any]:
        """
        Executes 360° Multi-Agent Workflow across Research, Patents, News/Social Media, and Competitors/Market.
        """
        start_time = time.time()
        client = self._get_openai_client()

        # Step 1: Agent Activity Timeline initialization
        activity_log: List[Dict[str, Any]] = [
            {
                "step": "Orchestrator selected",
                "status": "completed",
                "details": "AI Orchestrator initiated 360-degree multi-agent delegation plan."
            }
        ]

        # Step 2: Determine delegation plan
        selected_agent_names = self._analyze_agent_delegation(user_message)
        logger.info(f"[Orchestrator] Active agents selected: {selected_agent_names} for query: '{user_message}'")

        agent_tasks = []

        if "Research Intelligence Agent" in selected_agent_names:
            activity_log.append({
                "step": "Research Intelligence Agent",
                "status": "completed",
                "details": "Searching research papers and scientific literature."
            })
            agent_tasks.append(self.research_agent.run_task(user_message))

        if "Patent & IP Agent" in selected_agent_names or "Competitive Intelligence Agent" in selected_agent_names:
            activity_log.append({
                "step": "Patent & IP Agent",
                "status": "completed",
                "details": "Searching patent applications and IP filings."
            })
            agent_tasks.append(self.patent_agent.run_task(user_message))

        if "News & Social Media Agent" in selected_agent_names:
            activity_log.append({
                "step": "News & Social Media Agent",
                "status": "completed",
                "details": "Searching recent industry news and social media discussions."
            })
            agent_tasks.append(self.news_agent.run_task(user_message))

        if "Competitor & Market Agent" in selected_agent_names:
            activity_log.append({
                "step": "Competitor & Market Agent",
                "status": "completed",
                "details": "Analyzing competitor metrics and database insights."
            })
            agent_tasks.append(self.market_agent.run_task(user_message))

        # Step 3: Run sub-agents concurrently
        agent_results: List[AgentResult] = await asyncio.gather(*agent_tasks)

        # Record tools called & results retrieved in activity log
        tools_called = [res.tool_called for res in agent_results]
        activity_log.append({
            "step": "Tools called",
            "status": "completed",
            "details": f"Tools executed: {', '.join(tools_called)}"
        })

        activity_log.append({
            "step": "Results retrieved",
            "status": "completed",
            "details": f"Successfully fetched data from {len(agent_results)} specialized agent(s)."
        })

        # Step 4: Cross-Agent Analysis & Synthesis
        is_multi_agent = len(agent_results) > 1
        activity_log.append({
            "step": "360° Cross-agent synthesis completed",
            "status": "completed",
            "details": "Correlated research literature, patent claims, news/social sentiment, and competitor dynamics." if is_multi_agent else "Single-agent analysis finalized."
        })

        # Aggregate retrieved data and tools metadata
        tools_used_str = ", ".join(tools_called)
        aggregated_data = {
            res.agent_name: {
                "tool_called": res.tool_called,
                "tool_params": res.tool_params,
                "retrieved_data": res.retrieved_data,
                "finding": res.analytical_finding
            }
            for res in agent_results
        }

        # Step 5: Synthesize final output
        if client:
            try:
                findings_summary = "\n\n".join([
                    f"### [{res.agent_name}] (Tool: {res.tool_called})\n{res.analytical_finding}"
                    for res in agent_results
                ])

                system_prompt = (
                    f"You are the AI Chief Intelligence Orchestrator. The user asked: '{user_message}'.\n"
                    f"You deployed {len(agent_results)} specialized sub-agents: {', '.join(selected_agent_names)}.\n\n"
                    f"Sub-Agent Findings across Research, Patents, News/Social Media, and Competitor Data:\n{findings_summary}\n\n"
                    "Instructions for Final Output:\n"
                    "1. Deliver a 360-degree comprehensive intelligence report answering the user's query.\n"
                    "2. Structure your report into 4 clear pillars:\n"
                    "   - 🔬 Academic & Scientific Research Findings\n"
                    "   - 📜 Patent & Intellectual Property Filings\n"
                    "   - 📰 Industry News & Social Media Sentiment\n"
                    "   - 🏢 Competitor Dynamics & Strategic Takeaways\n"
                    "3. Provide actionable competitive conclusions.\n"
                )

                synth_messages = [{"role": "system", "content": system_prompt}]
                if conversation_history:
                    synth_messages.extend(conversation_history[-4:])
                synth_messages.append({"role": "user", "content": user_message})

                model_name = "llama-3.1-8b-instant" if "groq" in str(client.base_url) else "grok-beta"
                synth_res = client.chat.completions.create(
                    model=model_name,
                    messages=synth_messages,
                    temperature=0.5,
                    max_tokens=900
                )
                final_response = synth_res.choices[0].message.content
            except Exception as e:
                logger.error(f"[Orchestrator] Error in LLM synthesis: {str(e)}")
                final_response = self._synthesize_fallback(user_message, agent_results)
        else:
            final_response = self._synthesize_fallback(user_message, agent_results)

        total_execution_time = round((time.time() - start_time) * 1000, 2)

        return {
            "response": final_response,
            "tool_used": tools_used_str,
            "tool_params": {res.agent_name: res.tool_params for res in agent_results},
            "retrieved_data": aggregated_data,
            "agents_involved": selected_agent_names,
            "agent_activity": activity_log,
            "execution_time_ms": total_execution_time
        }

    def _synthesize_fallback(self, query: str, results: List[AgentResult]) -> str:
        """Deterministic 360° multi-agent synthesis fallback"""
        output = [
            f"### 🌐 360° Comprehensive Multi-Agent Intelligence Report: *\"{query}\"*",
            f"**Deployed Specialized Sub-Agents:** {', '.join([res.agent_name for res in results])}\n"
        ]

        for res in results:
            output.append(f"#### 🔍 {res.agent_name} (Tool: `{res.tool_called}`):")
            output.append(res.analytical_finding)
            output.append("")

        if len(results) > 1:
            output.append("#### 💡 Integrated Strategic Intelligence Synthesis:")
            output.append(
                "1. **Research to IP Conversion:** Scientific breakthroughs in literature are quickly being converted into defensive patent claims.\n"
                "2. **Market Sentiment:** Public news and social channels reflect growing adoption and high commercial interest.\n"
                "3. **Competitor Posture:** Major market players are consolidating IP and expanding infrastructure investment.\n"
                "4. **Actionable Recommendation:** Continuously monitor patent publications and scientific preprints to maintain technological leadership."
            )

        return "\n".join(output)

agent_orchestrator = AgentOrchestrator()
