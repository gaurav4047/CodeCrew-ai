import json
import time
import os
from typing import Dict, Any, List, Optional
from openai import OpenAI
from loguru import logger

from app.agent.tool_registry import tool_registry, ToolResult
from app.agent.tools.web_search_tool import WebSearchTool, NewsSearchTool, CompanyInfoTool, ResearchPaperTool
from app.agent.tools.database_tool import DatabaseInsightTool
from app.agent.tools.patent_tool import PatentSearchTool
from app.core.config import settings

# Register default tools into registry
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
    Autonomous AI Agent Orchestrator:
    1. Analyzes user query intent.
    2. Dynamically selects the best tool/API.
    3. Executes the tool to fetch live/retrieved data.
    4. Analyzes the retrieved data and synthesizes final output for the user.
    """

    def __init__(self):
        initialize_tools()

    def _get_openai_client(self) -> Optional[OpenAI]:
        """Gets configured OpenAI client (Groq or xAI or standard OpenAI)"""
        # Try Groq API key first, then xAI, then OPENAI_API_KEY
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

    def _determine_tool_fallback(self, query: str) -> tuple[str, Dict[str, Any]]:
        """
        Rule-based intent routing fallback if LLM function calling is unavailable or missing keys.
        """
        q_lower = query.lower()

        if any(term in q_lower for term in ["news", "article", "latest coverage", "headline", "breaking"]):
            return "NewsSearchTool", {"query": query}
        elif any(term in q_lower for term in ["paper", "research", "arxiv", "journal", "academic", "scholar"]):
            return "ResearchPaperTool", {"query": query}
        elif any(term in q_lower for term in ["patent", "ip ", "filing", "trademark", "claim"]):
            return "PatentSearchTool", {"query": query}
        elif any(term in q_lower for term in ["company", "competitor", "financial", "revenue", "market cap", "stock"]):
            # extract potential company name
            words = query.split()
            comp_name = words[-1] if len(words) > 0 else query
            for w in words:
                if w.istitle() and w.lower() not in ["show", "tell", "what", "find", "analyze"]:
                    comp_name = w
                    break
            return "CompanyInfoTool", {"company_name": comp_name}
        elif any(term in q_lower for term in ["database", "monitored", "insights", "internal", "tracking", "history"]):
            return "DatabaseInsightTool", {"query": query}
        else:
            return "WebSearchTool", {"query": query}

    async def process_query(
        self,
        user_message: str,
        conversation_history: Optional[List[dict]] = None
    ) -> Dict[str, Any]:
        """
        Process incoming user query with full tool selection, execution, and data analysis synthesis.
        """
        start_time = time.time()
        client = self._get_openai_client()

        tool_used = None
        tool_params = {}
        tool_result_data = None
        execution_time_ms = 0.0

        # Step 1: Tool Selection via LLM or Intent Router
        if client:
            try:
                tools_schemas = tool_registry.get_openai_tool_schemas()
                messages = [
                    {
                        "role": "system",
                        "content": (
                            "You are an AI Agent Router for a Competitive Intelligence platform. "
                            "Analyze the user's query and select the single most relevant tool to invoke. "
                            "If no tool is suitable, respond directly."
                        )
                    },
                    {"role": "user", "content": user_message}
                ]

                # Try tool choice completion
                model_name = "llama-3.3-70b-versatile" if "groq" in str(client.base_url) else "grok-beta"
                response = client.chat.completions.create(
                    model=model_name,
                    messages=messages,
                    tools=tools_schemas,
                    tool_choice="auto",
                    temperature=0.1
                )

                choice = response.choices[0].message
                if choice.tool_calls and len(choice.tool_calls) > 0:
                    tool_call = choice.tool_calls[0]
                    tool_used = tool_call.function.name
                    tool_params = json.loads(tool_call.function.arguments or "{}")
                else:
                    tool_used, tool_params = self._determine_tool_fallback(user_message)

            except Exception as e:
                logger.warning(f"LLM tool routing failed, falling back to intent analyzer: {str(e)}")
                tool_used, tool_params = self._determine_tool_fallback(user_message)
        else:
            tool_used, tool_params = self._determine_tool_fallback(user_message)

        # Step 2: Execute the Selected Tool
        logger.info(f"Dynamically selected tool: {tool_used} with params: {tool_params}")
        tool_exec_start = time.time()

        tool_result: ToolResult = await tool_registry.execute_tool(tool_used, **tool_params)
        tool_exec_duration = (time.time() - tool_exec_start) * 1000

        tool_result_data = tool_result.data if tool_result.success else {"error": tool_result.error}
        execution_time_ms = round((time.time() - start_time) * 1000, 2)

        # Step 3: Analyze Data & Synthesize Final Response
        if client:
            try:
                system_prompt = (
                    f"You are a Competitive Intelligence Analyst. The user asked: '{user_message}'.\n"
                    f"The system dynamically invoked tool '{tool_used}' with parameters {json.dumps(tool_params)}.\n"
                    f"Retrieved Tool Data:\n{json.dumps(tool_result_data, indent=2)}\n\n"
                    "Instructions for Final Output:\n"
                    "1. Directly answer the user's query utilizing the retrieved tool data.\n"
                    "2. State clearly what data was retrieved and analyze key insights, strategic trends, and notable findings.\n"
                    "3. Format your response cleanly with bullet points, sections, and professional analytical insights.\n"
                )

                synth_messages = [{"role": "system", "content": system_prompt}]
                if conversation_history:
                    synth_messages.extend(conversation_history[-4:])
                synth_messages.append({"role": "user", "content": user_message})

                model_name = "llama-3.1-8b-instant" if "groq" in str(client.base_url) else "grok-beta"
                synth_res = client.chat.completions.create(
                    model=model_name,
                    messages=synth_messages,
                    temperature=0.6,
                    max_tokens=700
                )
                final_text = synth_res.choices[0].message.content
            except Exception as e:
                logger.error(f"Error in response synthesis LLM call: {str(e)}")
                final_text = self._synthesize_fallback(user_message, tool_used, tool_params, tool_result_data)
        else:
            final_text = self._synthesize_fallback(user_message, tool_used, tool_params, tool_result_data)

        return {
            "response": final_text,
            "tool_used": tool_used,
            "tool_params": tool_params,
            "retrieved_data": tool_result_data,
            "execution_time_ms": execution_time_ms
        }

    def _synthesize_fallback(
        self,
        query: str,
        tool_name: str,
        params: Dict[str, Any],
        data: Any
    ) -> str:
        """Rule-based analytical synthesis when API calls are unavailable"""
        output = [
            f"### 🔍 Dynamic Intelligence Report for: *\"{query}\"*",
            f"**Dynamically Selected Tool:** `{tool_name}`",
            f"**Tool Execution Parameters:** `{json.dumps(params)}`\n",
            "#### 📊 Key Analytical Findings & Data Synthesis:"
        ]

        if isinstance(data, list):
            for idx, item in enumerate(data, 1):
                if isinstance(item, dict):
                    title = item.get("title") or item.get("name") or item.get("patent_number") or f"Item {idx}"
                    summary = item.get("summary") or item.get("description") or item.get("snippet") or item.get("abstract") or "No detailed description available."
                    url = item.get("url") or item.get("source") or "N/A"
                    output.append(f"{idx}. **{title}**\n   - **Insight:** {summary}\n   - **Source/Reference:** {url}")
                else:
                    output.append(f"{idx}. {str(item)}")
        elif isinstance(data, dict):
            for k, v in data.items():
                output.append(f"- **{k.replace('_', ' ').title()}:** {v}")
        else:
            output.append(f"- {str(data)}")

        output.append("\n#### 💡 Strategic Takeaway:")
        output.append("The retrieved intelligence suggests significant market momentum and competitive activity. We recommend continuing monitoring on this topic.")
        return "\n".join(output)

agent_orchestrator = AgentOrchestrator()
