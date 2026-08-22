import re
from typing import Dict, Any, List, Optional
from loguru import logger

class MemoryManager:
    """
    Context & Memory Management Engine:
    - Short-Term Memory: Maintains active conversation topic, active sources, recent sub-agents, tools used, and retrieved findings.
    - Long-Term Memory: Integrates persistent database tracking targets, keywords, and saved intelligence.
    - Context Retrieval: Resolves follow-up queries without forcing users to repeat topics.
    - Context Update: Continuously updates conversation memory state after each turn.
    """

    def __init__(self):
        self.short_term_memory: Dict[str, Any] = {
            "active_topic": None,
            "active_sources": [],
            "last_agents_used": [],
            "last_tools_used": [],
            "prior_findings": [],
            "turn_count": 0
        }

    def _is_followup_query(self, query: str) -> bool:
        """Determines if the query is a follow-up query relying on previous context"""
        q_lower = query.lower().strip()

        followup_triggers = [
            "latest update", "updates", "what are the latest", "show me updates",
            "competitors", "which competitor", "who is involved", "competitor involved",
            "compare", "compare them", "found earlier", "earlier research",
            "tell me more", "more details", "what else", "recent developments",
            "how about", "what about", "any patents", "any papers"
        ]

        if any(trigger in q_lower for trigger in followup_triggers):
            return True

        words = q_lower.split()
        if len(words) <= 4 and not any(kw in q_lower for kw in ["track", "find", "search", "analyze"]):
            return True

        return False

    def _extract_topic_and_sources(self, text: str) -> tuple[Optional[str], List[str]]:
        """Extracts topic and target sources from query text"""
        q_lower = text.lower()

        sources = []
        if any(w in q_lower for w in ["paper", "research", "arxiv", "literature", "academic"]):
            sources.append("Research Papers")
        if any(w in q_lower for w in ["patent", "ip", "claim", "filing"]):
            sources.append("Patent Filings")
        if any(w in q_lower for w in ["news", "article", "media", "social"]):
            sources.append("News & Social Media")
        if any(w in q_lower for w in ["competitor", "company", "market", "financial"]):
            sources.append("Competitors & Market")

        # Clean topic string by removing trigger verbs
        cleaned_topic = re.sub(
            r'^(track|find|search|analyze|look for|show me|check|get|give me|tell me about)\s+',
            '',
            text,
            flags=re.IGNORECASE
        ).strip()

        cleaned_topic = re.sub(r'\s+(research|patents|news|competitors|and|or)+$', '', cleaned_topic, flags=re.IGNORECASE).strip()

        # Check if topic is a question or follow-up phrase or UI header text
        if any(w in cleaned_topic.lower() for w in ["what", "which", "how", "who", "compare", "latest"]):
            return None, sources

        if any(w in cleaned_topic.lower() for w in ["agent activity", "context retrieved", "orchestrator analyzed", "previous topic"]):
            match = re.search(r'"([^"]+)"', cleaned_topic)
            if match:
                cleaned_topic = match.group(1)
            else:
                return None, sources

        if len(cleaned_topic) > 3:
            return cleaned_topic, sources
        return None, sources

    def retrieve_context(
        self,
        user_query: str,
        conversation_history: Optional[List[dict]] = None,
        long_term_configs: Optional[List[dict]] = None
    ) -> tuple[str, Dict[str, Any]]:
        """
        Retrieves memory context, resolves follow-up queries, and enriches prompt context.
        """
        is_followup = self._is_followup_query(user_query)
        extracted_topic, extracted_sources = self._extract_topic_and_sources(user_query)

        # Update active_topic ONLY if NOT a follow-up query AND valid topic extracted
        if not is_followup and extracted_topic and len(extracted_topic) > 3:
            self.short_term_memory["active_topic"] = extracted_topic

        if extracted_sources:
            for src in extracted_sources:
                if src not in self.short_term_memory["active_sources"]:
                    self.short_term_memory["active_sources"].append(src)

        # Fallback to long-term memory configs if no active topic yet
        if not self.short_term_memory["active_topic"] and long_term_configs:
            for cfg in long_term_configs:
                if cfg.get("name"):
                    self.short_term_memory["active_topic"] = cfg["name"]
                    break

        active_topic = self.short_term_memory["active_topic"] or "AI Medical Diagnosis"
        active_sources = self.short_term_memory["active_sources"] or ["Research Papers", "Patent Filings"]

        # Enriched query construction for Orchestrator & sub-agents
        if is_followup:
            enriched_query = f"{user_query} [Active Context Topic: {active_topic}]"
        else:
            enriched_query = user_query

        sources_formatted = " + ".join(active_sources) if active_sources else "Multi-Domain"
        memory_indicator = f"✓ Previous context used: {active_topic} ({sources_formatted} context retained)"

        memory_metadata = {
            "is_followup": is_followup,
            "context_used": active_topic,
            "active_topic": active_topic,
            "active_sources": active_sources,
            "memory_indicator": memory_indicator,
            "prior_findings_count": len(self.short_term_memory["prior_findings"])
        }

        logger.info(f"[MemoryManager] Resolved context: active_topic='{active_topic}', is_followup={is_followup}")
        return enriched_query, memory_metadata

    def update_memory(
        self,
        user_query: str,
        agents_involved: List[str],
        tools_called: List[str],
        retrieved_data: Any,
        response_text: str
    ):
        """
        Updates short-term memory state after turn execution.
        """
        self.short_term_memory["turn_count"] += 1
        self.short_term_memory["last_agents_used"] = agents_involved
        self.short_term_memory["last_tools_used"] = tools_called

        # Record findings snippet into prior findings history
        finding_entry = {
            "turn": self.short_term_memory["turn_count"],
            "query": user_query,
            "agents": agents_involved,
            "tools": tools_called,
            "data_summary": str(retrieved_data)[:400] if retrieved_data else ""
        }
        self.short_term_memory["prior_findings"].append(finding_entry)

        # Keep max 10 prior findings
        if len(self.short_term_memory["prior_findings"]) > 10:
            self.short_term_memory["prior_findings"].pop(0)

memory_manager = MemoryManager()
