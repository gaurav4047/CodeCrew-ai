import arxiv
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.services.base_collector import BaseCollector
from loguru import logger


class ResearchCollector(BaseCollector):
    """Collector for research papers from arXiv and other academic sources"""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.sources = config.get("sources", ["arxiv"])
        
    async def collect(self, keywords: List[str], since: Optional[datetime] = None) -> List[Dict[str, Any]]:
        results = []
        
        for source in self.sources:
            if source == "arxiv":
                results.extend(await self._collect_arxiv(keywords, since))
            # Add more sources as needed (PubMed, Google Scholar, etc.)
            
        return results
    
    async def _collect_arxiv(self, keywords: List[str], since: Optional[datetime] = None) -> List[Dict[str, Any]]:
        """Collect papers from arXiv"""
        try:
            # Build search query
            query = " OR ".join([f'all:{keyword}' for keyword in keywords])
            
            # Configure search
            search = arxiv.Search(
                query=query,
                max_results=100,
                sort_by=arxiv.SortCriterion.SubmittedDate
            )
            
            results = []
            for result in search.results():
                paper_date = result.published.replace(tzinfo=None)
                
                # Filter by date if specified
                if since and paper_date < since:
                    continue
                    
                results.append({
                    'title': result.title,
                    'authors': [author.name for author in result.authors],
                    'summary': result.summary,
                    'published': result.published,
                    'url': result.entry_id,
                    'pdf_url': result.pdf_url,
                    'categories': result.categories,
                    'source': 'arxiv'
                })
            
            logger.info(f"Collected {len(results)} papers from arXiv")
            return results
            
        except Exception as e:
            logger.error(f"Error collecting from arXiv: {str(e)}")
            return []
    
    def normalize_data(self, raw_data: Any) -> Dict[str, Any]:
        """Normalize research paper data"""
        return {
            'title': raw_data.get('title', ''),
            'summary': raw_data.get('summary', ''),
            'content': raw_data.get('summary', ''),  # Use summary as content for now
            'source_url': raw_data.get('url', ''),
            'source_type': 'research',
            'published_at': raw_data.get('published'),
            'metadata': {
                'authors': raw_data.get('authors', []),
                'categories': raw_data.get('categories', []),
                'pdf_url': raw_data.get('pdf_url', ''),
                'source': raw_data.get('source', 'arxiv')
            }
        }
