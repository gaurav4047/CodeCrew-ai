from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from app.core.database import get_db
from app.models.insight import Insight, InsightPriority, InsightCategory
from app.models.user import User
from app.api.auth import get_current_user
from pydantic import BaseModel
import json

router = APIRouter()


class InsightResponse(BaseModel):
    id: int
    title: str
    summary: str
    full_content: Optional[str]
    source_url: Optional[str]
    source_type: Optional[str]
    priority: Optional[InsightPriority]
    category: Optional[InsightCategory]
    relevance_score: Optional[float]
    entities: List[str]
    published_at: Optional[datetime]
    discovered_at: datetime
    is_read: bool
    alerted: bool
    
    class Config:
        from_attributes = True


class InsightUpdate(BaseModel):
    is_read: bool


@router.get("/", response_model=List[InsightResponse])
async def get_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 50,
    priority: Optional[InsightPriority] = None,
    category: Optional[InsightCategory] = None,
    unread_only: bool = False
):
    query = db.query(Insight).join(
        Insight.tracking_config
    ).filter(
        Insight.tracking_config.has(user_id=current_user.id)
    )
    
    if priority:
        query = query.filter(Insight.priority == priority)
    
    if category:
        query = query.filter(Insight.category == category)
    
    if unread_only:
        query = query.filter(Insight.is_read == False)
    
    insights = query.order_by(Insight.discovered_at.desc()).offset(skip).limit(limit).all()
    
    response = []
    for insight in insights:
        response.append(InsightResponse(
            id=insight.id,
            title=insight.title,
            summary=insight.summary,
            full_content=insight.full_content,
            source_url=insight.source_url,
            source_type=insight.source_type,
            priority=insight.priority,
            category=insight.category,
            relevance_score=insight.relevance_score,
            entities=json.loads(insight.entities) if insight.entities else [],
            published_at=insight.published_at,
            discovered_at=insight.discovered_at,
            is_read=insight.is_read,
            alerted=insight.alerted,
            alerted=insight.alerted
        ))
    
    return response


@router.get("/{insight_id}", response_model=InsightResponse)
async def get_insight(
    insight_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    insight = db.query(Insight).join(
        Insight.tracking_config
    ).filter(
        Insight.id == insight_id,
        Insight.tracking_config.has(user_id=current_user.id)
    ).first()
    
    if not insight:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Insight not found"
        )
    
    return InsightResponse(
        id=insight.id,
        title=insight.title,
        summary=insight.summary,
        full_content=insight.full_content,
        source_url=insight.source_url,
        source_type=insight.source_type,
        priority=insight.priority,
        category=insight.category,
        relevance_score=insight.relevance_score,
        entities=json.loads(insight.entities) if insight.entities else [],
        published_at=insight.published_at,
        discovered_at=insight.discovered_at,
        is_read=insight.is_read,
        alerted=insight.alerted
    )


@router.put("/{insight_id}", response_model=InsightResponse)
async def update_insight(
    insight_id: int,
    insight_update: InsightUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    insight = db.query(Insight).join(
        Insight.tracking_config
    ).filter(
        Insight.id == insight_id,
        Insight.tracking_config.has(user_id=current_user.id)
    ).first()
    
    if not insight:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Insight not found"
        )
    
    if insight_update.is_read is not None:
        insight.is_read = insight_update.is_read
    
    db.commit()
    db.refresh(insight)
    
    return InsightResponse(
        id=insight.id,
        title=insight.title,
        summary=insight.summary,
        full_content=insight.full_content,
        source_url=insight.source_url,
        source_type=insight.source_type,
        priority=insight.priority,
        category=insight.category,
        relevance_score=insight.relevance_score,
        entities=json.loads(insight.entities) if insight.entities else [],
        published_at=insight.published_at,
        discovered_at=insight.discovered_at,
        is_read=insight.is_read,
        alerted=insight.alerted
    )


@router.get("/stats/summary")
async def get_insights_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get total insights count
    total_insights = db.query(Insight).join(
        Insight.tracking_config
    ).filter(
        Insight.tracking_config.has(user_id=current_user.id)
    ).count()
    
    # Get unread insights count
    unread_insights = db.query(Insight).join(
        Insight.tracking_config
    ).filter(
        Insight.tracking_config.has(user_id=current_user.id),
        Insight.is_read == False
    ).count()
    
    # Get insights from last 24 hours
    yesterday = datetime.utcnow() - timedelta(days=1)
    recent_insights = db.query(Insight).join(
        Insight.tracking_config
    ).filter(
        Insight.tracking_config.has(user_id=current_user.id),
        Insight.discovered_at >= yesterday
    ).count()
    
    # Get high priority insights
    high_priority_insights = db.query(Insight).join(
        Insight.tracking_config
    ).filter(
        Insight.tracking_config.has(user_id=current_user.id),
        Insight.priority == InsightPriority.HIGH
    ).count()
    
    return {
        "total_insights": total_insights,
        "unread_insights": unread_insights,
        "recent_insights": recent_insights,
        "high_priority_insights": high_priority_insights
    }
