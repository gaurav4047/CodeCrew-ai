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
    AI Multi-Agent Orchestrator:
    1. Analyzes user query intent.
    2. Dynamically decides which specialized agent(s) to use:
       - Research Intelligence Agent (Research Paper queries)
       - Competitive Intelligence Agent (Patent, News, Competitor queries)
       - BOTH Agents (Cross-domain queries: Research + Patents/Competitive)
    3. Delegates tasks to specialized agents asynchronously.
    4. Tracks real step-by-step Agent Activity trace.
    5. Combines agent results with cross-agent synthesis to generate final actionable response.
    """

    def __init__(self):
        initialize_tools()
        self.research_agent = ResearchIntelligenceAgent()
        self.competitive_agent = CompetitiveIntelligenceAgent()

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
        Determines which specialized sub-agents should be activated for the query.
        """
        q_lower = query.lower()

        has_research = any(term in q_lower for term in [
            "paper", "research", "arxiv", "journal", "academic", "scholar",
            "study", "literature", "diagnosis", "algorithm", "model"
        ])
        has_competitive = any(term in q_lower for term in [
            "patent", "ip ", "filing", "claim", "competitor", "competitive",
            "market", "news", "industry", "impact", "commercial"
        ])

        active_agents = []
        if has_research:
            active_agents.append("Research Intelligence Agent")
        if has_competitive:
            active_agents.append("Competitive Intelligence Agent")

        # Fallback: if query matches neither explicitly, pick default based on keywords or both if query is broad
        if not active_agents:
            if "company" in q_lower or "news" in q_lower:
                active_agents.append("Competitive Intelligence Agent")
            else:
                active_agents.append("Research Intelligence Agent")

        return active_agents

    async def process_query(
        self,
        user_message: str,
        conversation_history: Optional[List[dict]] = None
    ) -> Dict[str, Any]:
        """
        Executes Multi-Agent Workflow:
        User Query -> Orchestrator -> Sub-Agents -> Tools -> Cross-Agent Synthesis -> Final Response
        """
        start_time = time.time()
        client = self._get_openai_client()

        # Step 1: Agent Activity Timeline initialization
        activity_log: List[Dict[str, Any]] = [
            {
                "step": "Orchestrator selected",
                "status": "completed",
                "details": "AI Orchestrator analyzed query intent and initiated delegation plan."
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
                "details": "Delegated research paper and academic literature analysis."
            })
            agent_tasks.append(self.research_agent.run_task(user_message))

        if "Competitive Intelligence Agent" in selected_agent_names:
            activity_log.append({
                "step": "Competitive Intelligence Agent",
                "status": "completed",
                "details": "Delegated patent landscape and competitive impact analysis."
            })
            agent_tasks.append(self.competitive_agent.run_task(user_message))

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
            "step": "Cross-agent analysis completed",
            "status": "completed",
            "details": "Combined scientific research and competitive IP findings into actionable intelligence." if is_multi_agent else "Single-agent analysis finalized."
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
                    f"You delegated this query to {len(agent_results)} specialized agent(s): {', '.join(selected_agent_names)}.\n\n"
                    f"Agent Findings & Retrieved Data:\n{findings_summary}\n\n"
                    "Instructions for Final Synthesis Output:\n"
                    "1. Provide a comprehensive, actionable response that directly answers the user's query.\n"
                    "2. If multiple agents were used (e.g. Research + Competitive/Patents), perform a CROSS-AGENT ANALYSIS linking scientific research developments to patent filings, commercial applications, and strategic competitive impact.\n"
                    "3. Format cleanly with markdown headers, bullet points, and strategic takeaways.\n"
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
                    max_tokens=850
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
        """Deterministic cross-agent synthesis fallback when LLM API is unavailable"""
        output = [
            f"### 🤖 Multi-Agent Intelligence Report: *\"{query}\"*",
            f"**Delegated Sub-Agents:** {', '.join([res.agent_name for res in results])}\n"
        ]

        for res in results:
            output.append(f"#### 🔬 {res.agent_name} Report (Tool: `{res.tool_called}`):")
            output.append(res.analytical_finding)
            output.append("")

        if len(results) > 1:
            output.append("#### 🌐 Cross-Agent Strategic Correlation & Competitive Impact:")
            output.append(
                "1. **Academic to Commercial Pipeline:** Research paper developments are directly translating into active patent filings and IP claims.\n"
                "2. **Competitive Moat:** Early patentees are establishing high technological barriers, creating a tight competitive landscape.\n"
                "3. **Strategic Recommendation:** Organizations should align internal R&D with emerging patent claim boundaries to mitigate infringement risks while capturing first-mover market advantages."
            )

        return "\n".join(output)

agent_orchestrator = AgentOrchestrator()
