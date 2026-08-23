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
from app.agent.memory.memory_manager import memory_manager
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
    360-Degree AI Multi-Agent Orchestrator with Context & Memory Management:
    User Query -> Memory Context Retrieval -> AI Orchestrator -> Research / Competitive / News / Market Agents -> Tools -> Results -> Memory Update -> Final Response
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

        openai_key = os.getenv("OPENAI_API_KEY")
        if openai_key:
            return OpenAI(api_key=openai_key)

        return None

    def _create_completion(
        self,
        client: OpenAI,
        messages: List[dict],
        tools: Optional[List[dict]] = None,
        temperature: float = 0.5,
        max_tokens: int = 850
    ):
        """Robust model runner trying available models with fallback"""
        models_to_try = [
            "groq/compound",
            "groq/compound-mini",
            "openai/gpt-oss-20b",
            "qwen/qwen3.6-27b",
            "llama-3.3-70b-versatile",
            "llama-3.1-8b-instant",
            "llama3-70b-8192",
            "llama3-8b-8192",
            "grok-beta"
        ]
        last_exception = None
        for model in models_to_try:
            try:
                kwargs: Dict[str, Any] = {
                    "model": model,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens
                }
                if tools:
                    kwargs["tools"] = tools
                    kwargs["tool_choice"] = "auto"
                return client.chat.completions.create(**kwargs)
            except Exception as e:
                last_exception = e
                continue
        if last_exception:
            raise last_exception
        raise RuntimeError("No suitable LLM model found")

    def _analyze_agent_delegation(self, query: str) -> List[str]:
        """
        Determines active specialized agents based on query and active context.
        """
        q_lower = query.lower()

        is_only_research = ("only paper" in q_lower or "only research" in q_lower)
        is_only_patent = ("only patent" in q_lower or "only ip" in q_lower)
        is_only_news = ("only news" in q_lower or "only media" in q_lower)
        is_only_competitor = ("competitor" in q_lower or "competitors" in q_lower or "company" in q_lower)

        if is_only_research:
            return ["Research Intelligence Agent"]
        if is_only_patent:
            return ["Patent & IP Agent"]
        if is_only_news:
            return ["News & Social Media Agent"]
        if is_only_competitor and not ("paper" in q_lower or "research" in q_lower):
            return ["Competitor & Market Agent", "Patent & IP Agent"]

        # Default: 360-Degree Intelligence Gathering across core pillars
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
        Executes Multi-Agent Workflow with Context & Memory Management:
        1. Context/Memory Retrieval
        2. Orchestrator Agent Delegation
        3. Specialized Agent & Tool Execution
        4. Memory Update
        5. Cross-Agent Response Synthesis
        """
        start_time = time.time()
        client = self._get_openai_client()

        # Step 1: Memory Context Retrieval
        enriched_query, memory_metadata = memory_manager.retrieve_context(
            user_query=user_message,
            conversation_history=conversation_history
        )

        activity_log: List[Dict[str, Any]] = [
            {
                "step": "Memory context retrieved",
                "status": "completed",
                "details": memory_metadata["memory_indicator"]
            },
            {
                "step": "Orchestrator selected",
                "status": "completed",
                "details": f"AI Orchestrator delegated task using active topic '{memory_metadata['active_topic']}'."
            }
        ]

        # Step 2: Determine delegation plan using enriched query
        selected_agent_names = self._analyze_agent_delegation(enriched_query)
        logger.info(f"[Orchestrator] Active agents selected: {selected_agent_names} for query: '{user_message}' (Enriched: '{enriched_query}')")

        agent_tasks = []

        if "Research Intelligence Agent" in selected_agent_names:
            activity_log.append({
                "step": "Research Intelligence Agent",
                "status": "completed",
                "details": "Searching research papers and scientific literature."
            })
            agent_tasks.append(self.research_agent.run_task(enriched_query))

        if "Patent & IP Agent" in selected_agent_names or "Competitive Intelligence Agent" in selected_agent_names:
            activity_log.append({
                "step": "Patent & IP Agent",
                "status": "completed",
                "details": "Searching patent applications and IP filings."
            })
            agent_tasks.append(self.patent_agent.run_task(enriched_query))

        if "News & Social Media Agent" in selected_agent_names:
            activity_log.append({
                "step": "News & Social Media Agent",
                "status": "completed",
                "details": "Searching recent industry news and social media discussions."
            })
            agent_tasks.append(self.news_agent.run_task(enriched_query))

        if "Competitor & Market Agent" in selected_agent_names:
            activity_log.append({
                "step": "Competitor & Market Agent",
                "status": "completed",
                "details": "Analyzing competitor metrics and database insights."
            })
            agent_tasks.append(self.market_agent.run_task(enriched_query))

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
                    f"You are the AI Chief Intelligence Orchestrator with Context & Memory Access. The user asked: '{user_message}'.\n"
                    f"Retained Context Topic: '{memory_metadata['active_topic']}' (Retained Sources: {', '.join(memory_metadata['active_sources'])}).\n\n"
                    f"Sub-Agent Findings across Research, Patents, News/Social Media, and Competitor Data:\n{findings_summary}\n\n"
                    "Instructions for Final Output:\n"
                    "1. Deliver a 360-degree comprehensive intelligence report answering the user's query while maintaining context.\n"
                    "2. If this is a follow-up query (e.g. 'latest updates', 'which competitors', 'compare with research earlier'), directly reference the retained topic and prior findings seamlessly.\n"
                    "3. Format cleanly with markdown headers, bullet points, and strategic takeaways.\n"
                )

                synth_messages = [{"role": "system", "content": system_prompt}]
                if conversation_history:
                    synth_messages.extend(conversation_history[-4:])
                synth_messages.append({"role": "user", "content": user_message})

                synth_res = self._create_completion(
                    client=client,
                    messages=synth_messages,
                    temperature=0.5,
                    max_tokens=900
                )
                final_response = synth_res.choices[0].message.content
            except Exception as e:
                logger.error(f"[Orchestrator] Error in LLM synthesis: {str(e)}")
                final_response = self._synthesize_fallback(user_message, agent_results, memory_metadata)
        else:
            final_response = self._synthesize_fallback(user_message, agent_results, memory_metadata)

        # Step 6: Memory Update
        memory_manager.update_memory(
            user_query=user_message,
            agents_involved=selected_agent_names,
            tools_called=tools_called,
            retrieved_data=aggregated_data,
            response_text=final_response
        )

        total_execution_time = round((time.time() - start_time) * 1000, 2)

        return {
            "response": final_response,
            "tool_used": tools_used_str,
            "tool_params": {res.agent_name: res.tool_params for res in agent_results},
            "retrieved_data": aggregated_data,
            "agents_involved": selected_agent_names,
            "agent_activity": activity_log,
            "context_memory": memory_metadata,
            "execution_time_ms": total_execution_time
        }

    def _synthesize_fallback(self, query: str, results: List[AgentResult], memory_metadata: Dict[str, Any]) -> str:
        """Deterministic 360° multi-agent synthesis fallback with context memory awareness"""
        topic = memory_metadata.get("active_topic", "Competitive Intelligence")
        output = [
            f"### 🌐 Multi-Agent Intelligence Report: *\"{query}\"*",
            f"**Active Retained Context:** `{topic}` | **Sub-Agents:** {', '.join([res.agent_name for res in results])}\n"
        ]

        for res in results:
            output.append(f"#### 🔍 {res.agent_name} (Tool: `{res.tool_called}`):")
            output.append(res.analytical_finding)
            output.append("")

        if len(results) > 1:
            output.append("#### 💡 Integrated Strategic Intelligence & Memory Correlation:")
            output.append(
                f"1. **Retained Topic Focus:** All retrieved research papers, patent claims, news coverage, and competitor metrics are correlated under '{topic}'.\n"
                "2. **Research to IP Conversion:** Scientific breakthroughs in literature are directly translating into defensive patent claims.\n"
                "3. **Competitor & Market Posture:** Major market players are consolidating IP and expanding infrastructure investment.\n"
                "4. **Actionable Recommendation:** Continuously monitor patent publications and scientific preprints to maintain technological leadership."
            )

        return "\n".join(output)

agent_orchestrator = AgentOrchestrator()
