from typing import List, Dict, Any, Optional
from datetime import datetime
import aiohttp
import feedparser
from app.services.base_collector import BaseCollector
from app.core.config import settings
from loguru import logger


class NewsCollector(BaseCollector):
    """Collector for news from various news APIs and RSS feeds"""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.sources = config.get("sources", ["news_api"])
        self.rss_feeds = config.get("rss_feeds", [])
        
    async def collect(self, keywords: List[str], since: Optional[datetime] = None) -> List[Dict[str, Any]]:
        results = []
        
        for source in self.sources:
            if source == "news_api" and settings.NEWS_API_KEY:
                results.extend(await self._collect_news_api(keywords, since))
            elif source == "rss":
                results.extend(await self._collect_rss_feeds(keywords, since))
                
        return results
    
    async def _collect_news_api(self, keywords: List[str], since: Optional[datetime] = None) -> List[Dict[str, Any]]:
        """Collect news from News API"""
        try:
            async with aiohttp.ClientSession() as session:
                query = " OR ".join(keywords)
                url = f"https://newsapi.org/v2/everything?q={query}&apiKey={settings.NEWS_API_KEY}"
                
                if since:
                    from_date = since.strftime("%Y-%m-%d")
                    url += f"&from={from_date}"
                
                async with session.get(url, timeout=settings.REQUEST_TIMEOUT_SECONDS) as response:
                    if response.status == 200:
                        data = await response.json()
                        articles = data.get("articles", [])
                        
                        results = []
                        for article in articles:
                            results.append({
                                'title': article.get('title', ''),
                                'description': article.get('description', ''),
                                'content': article.get('content', ''),
                                'url': article.get('url', ''),
                                'published_at': article.get('publishedAt'),
                                'source': article.get('source', {}).get('name', 'News API'),
                                'author': article.get('author', '')
                            })
                        
                        logger.info(f"Collected {len(results)} articles from News API")
                        return results
                    else:
                        logger.error(f"News API returned status {response.status}")
                        return []
                        
        except Exception as e:
            logger.error(f"Error collecting from News API: {str(e)}")
            return []
    
    async def _collect_rss_feeds(self, keywords: List[str], since: Optional[datetime] = None) -> List[Dict[str, Any]]:
        """Collect news from RSS feeds"""
        try:
            results = []
            
            for feed_url in self.rss_feeds:
                feed = feedparser.parse(feed_url)
                
                for entry in feed.entries:
                    # Check if entry matches keywords
                    title = entry.get('title', '')
                    description = entry.get('description', '')
                    
                    # Simple keyword matching
                    if not any(keyword.lower() in title.lower() or keyword.lower() in description.lower() 
                              for keyword in keywords):
                        continue
                    
                    # Parse date
                    published_at = None
                    if hasattr(entry, 'published_parsed') and entry.published_parsed:
                        published_at = datetime(*entry.published_parsed[:6])
                    
                    # Filter by date if specified
                    if since and published_at and published_at < since:
                        continue
                    
                    results.append({
                        'title': title,
                        'description': description,
                        'content': description,
                        'url': entry.get('link', ''),
                        'published_at': published_at,
                        'source': feed.feed.get('title', 'RSS'),
                        'author': entry.get('author', '')
                    })
            
            logger.info(f"Collected {len(results)} articles from RSS feeds")
            return results
            
        except Exception as e:
            logger.error(f"Error collecting from RSS feeds: {str(e)}")
            return []
    
    def normalize_data(self, raw_data: Any) -> Dict[str, Any]:
        """Normalize news data"""
        return {
            'title': raw_data.get('title', ''),
            'summary': raw_data.get('description', ''),
            'content': raw_data.get('content', ''),
            'source_url': raw_data.get('url', ''),
            'source_type': 'news',
            'published_at': raw_data.get('published_at'),
            'metadata': {
                'author': raw_data.get('author', ''),
                'source': raw_data.get('source', ''),
                'original_source': 'news'
            }
        }
