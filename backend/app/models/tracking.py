from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base


class TrackingType(enum.Enum):
    RESEARCH = "research"
    PATENT = "patent"
    NEWS = "news"
    SOCIAL_MEDIA = "social_media"
    COMPETITOR = "competitor"


class TrackingConfig(Base):
    __tablename__ = "tracking_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    tracking_type = Column(Enum(TrackingType), nullable=False)
    keywords = Column(Text)  # JSON array of keywords
    sources = Column(Text)  # JSON array of source configurations
    check_interval_minutes = Column(Integer, default=60)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", backref="tracking_configs")
