from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from datetime import datetime
import json
from loguru import logger


class BaseCollector(ABC):
    """Base class for all data collectors"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.source_name = config.get("name", "unknown")
        
    @abstractmethod
    async def collect(self, keywords: List[str], since: Optional[datetime] = None) -> List[Dict[str, Any]]:
        """Collect data based on keywords"""
        pass
    
    @abstractmethod
    def normalize_data(self, raw_data: Any) -> Dict[str, Any]:
        """Normalize raw data to standard format"""
        pass
    
    async def collect_and_normalize(self, keywords: List[str], since: Optional[datetime] = None) -> List[Dict[str, Any]]:
        """Collect and normalize data in one step"""
        try:
            raw_data = await self.collect(keywords, since)
            normalized = [self.normalize_data(item) for item in raw_data]
            logger.info(f"Collected {len(normalized)} items from {self.source_name}")
            return normalized
        except Exception as e:
            logger.error(f"Error collecting from {self.source_name}: {str(e)}")
            return []
    
    def _parse_json_safely(self, json_str: str) -> Any:
        """Safely parse JSON string"""
        try:
            return json.loads(json_str)
        except:
            return None
