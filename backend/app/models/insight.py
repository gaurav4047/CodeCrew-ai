from sqlalchemy import Column, Integer, String, DateTime, Text, Float, ForeignKey, Enum, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base


class InsightPriority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class InsightCategory(enum.Enum):
    TREND = "trend"
    COMPETITOR_ACTIVITY = "competitor_activity"
    BREAKTHROUGH = "breakthrough"
    MARKET_SHIFT = "market_shift"
    REGULATORY = "regulatory"
    PARTNERSHIP = "partnership"


class Insight(Base):
    __tablename__ = "insights"
    
    id = Column(Integer, primary_key=True, index=True)
    tracking_config_id = Column(Integer, ForeignKey("tracking_configs.id"), nullable=False)
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    full_content = Column(Text)
    source_url = Column(String)
    source_type = Column(String)
    priority = Column(Enum(InsightPriority), default=InsightPriority.MEDIUM)
    category = Column(Enum(InsightCategory))
    relevance_score = Column(Float)
    entities = Column(Text)  # JSON array of extracted entities
    published_at = Column(DateTime(timezone=True))
    discovered_at = Column(DateTime(timezone=True), server_default=func.now())
    is_read = Column(Boolean, default=False)
    alerted = Column(Boolean, default=False)
    
    tracking_config = relationship("TrackingConfig", backref="insights")
