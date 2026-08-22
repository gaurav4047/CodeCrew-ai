from typing import List, Dict, Any, Optional
from datetime import datetime
import json
from openai import OpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import numpy as np
from app.core.config import settings
from loguru import logger


class AIAnalyzer:
    """AI-powered analysis engine for generating insights from collected data"""
    
    def __init__(self):
        self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        
    async def analyze_data(self, data: List[Dict[str, Any]], context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Analyze collected data and generate insights"""
        insights = []
        
        for item in data:
            try:
                insight = await self._analyze_single_item(item, context)
                if insight:
                    insights.append(insight)
            except Exception as e:
                logger.error(f"Error analyzing item: {str(e)}")
                continue
        
        # Perform trend analysis across all items
        trends = await self._analyze_trends(data, context)
        insights.extend(trends)
        
        return insights
    
    async def _analyze_single_item(self, item: Dict[str, Any], context: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Analyze a single data item and extract insights"""
        try:
            title = item.get('title', '')
            content = item.get('content', '')
            summary = item.get('summary', '')
            
            # Combine text for analysis
            text_to_analyze = f"{title}\n{summary}\n{content}"
            
            # Generate insight using OpenAI
            prompt = f"""
            Analyze the following content and extract key insights:
            
            Title: {title}
            Summary: {summary}
            Content: {content[:2000]}
            
            Context: {json.dumps(context)}
            
            Provide:
            1. A concise summary of the key insight (2-3 sentences)
            2. Priority level (low, medium, high, critical)
            3. Category (trend, competitor_activity, breakthrough, market_shift, regulatory, partnership)
            4. Key entities mentioned (companies, people, technologies)
            5. Relevance score (0-1)
            
            Format as JSON.
            """
            
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert analyst specializing in competitive intelligence and research trend analysis."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            
            analysis = json.loads(response.choices[0].message.content)
            
            return {
                'title': title,
                'summary': analysis.get('summary', summary),
                'full_content': content,
                'source_url': item.get('source_url', ''),
                'source_type': item.get('source_type', ''),
                'priority': analysis.get('priority', 'medium'),
                'category': analysis.get('category', 'trend'),
                'entities': analysis.get('entities', []),
                'relevance_score': analysis.get('relevance_score', 0.5),
                'published_at': item.get('published_at'),
                'discovered_at': datetime.utcnow(),
                'metadata': item.get('metadata', {})
            }
            
        except Exception as e:
            logger.error(f"Error in single item analysis: {str(e)}")
            return None
    
    async def _analyze_trends(self, data: List[Dict[str, Any]], context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Analyze trends across multiple data items"""
        try:
            if len(data) < 3:
                return []
            
            # Extract key themes from all items
            titles = [item.get('title', '') for item in data]
            summaries = [item.get('summary', '') for item in data]
            
            # Generate trend analysis
            prompt = f"""
            Analyze the following collection of content items and identify emerging trends:
            
            Titles: {titles[:10]}
            Summaries: {summaries[:10]}
            
            Context: {json.dumps(context)}
            
            Identify:
            1. Major trends across these items
            2. Recurring themes or topics
            3. Significant patterns or shifts
            4. Any breakthrough developments
            
            Format as JSON with trends array.
            """
            
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert trend analyst specializing in identifying patterns across research and market data."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4
            )
            
            analysis = json.loads(response.choices[0].message.content)
            trends = analysis.get('trends', [])
            
            # Convert trends to insight format
            trend_insights = []
            for trend in trends:
                trend_insights.append({
                    'title': trend.get('title', 'Trend Analysis'),
                    'summary': trend.get('description', ''),
                    'full_content': json.dumps(trend),
                    'source_url': '',
                    'source_type': 'trend_analysis',
                    'priority': trend.get('priority', 'medium'),
                    'category': 'trend',
                    'entities': trend.get('entities', []),
                    'relevance_score': trend.get('relevance_score', 0.7),
                    'published_at': datetime.utcnow(),
                    'discovered_at': datetime.utcnow(),
                    'metadata': {'analysis_type': 'trend_analysis'}
                })
            
            return trend_insights
            
        except Exception as e:
            logger.error(f"Error in trend analysis: {str(e)}")
            return []
    
    def compute_similarity(self, text1: str, text2: str) -> float:
        """Compute semantic similarity between two texts"""
        try:
            embedding1 = self.embedding_model.encode(text1)
            embedding2 = self.embedding_model.encode(text2)
            similarity = np.dot(embedding1, embedding2) / (np.linalg.norm(embedding1) * np.linalg.norm(embedding2))
            return float(similarity)
        except Exception as e:
            logger.error(f"Error computing similarity: {str(e)}")
            return 0.0
    
    def deduplicate_insights(self, insights: List[Dict[str, Any]], threshold: float = 0.85) -> List[Dict[str, Any]]:
        """Remove duplicate insights based on semantic similarity"""
        if not insights:
            return []
        
        unique_insights = [insights[0]]
        
        for insight in insights[1:]:
            is_duplicate = False
            current_text = insight.get('title', '') + ' ' + insight.get('summary', '')
            
            for existing_insight in unique_insights:
                existing_text = existing_insight.get('title', '') + ' ' + existing_insight.get('summary', '')
                similarity = self.compute_similarity(current_text, existing_text)
                
                if similarity > threshold:
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                unique_insights.append(insight)
        
        return unique_insights
