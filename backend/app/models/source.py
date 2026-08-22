from sqlalchemy import Column, Integer, String, DateTime, Text, Enum, Boolean
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class DataSource(enum.Enum):
    ARXIV = "arxiv"
    PUBMED = "pubmed"
    GOOGLE_PATENTS = "google_patents"
    USPTO = "uspto"
    NEWS_API = "news_api"
    RSS = "rss"
    TWITTER = "twitter"
    LINKEDIN = "linkedin"
    REDDIT = "reddit"
    WEB_SCRAPER = "web_scraper"


class Source(Base):
    __tablename__ = "sources"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    source_type = Column(Enum(DataSource), nullable=False)
    config = Column(Text)  # JSON configuration for the source
    last_checked = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
