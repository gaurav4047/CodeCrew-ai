from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.tracking import TrackingConfig, TrackingType
from app.models.user import User
from app.api.auth import get_current_user
from pydantic import BaseModel
import json

router = APIRouter()


class TrackingConfigCreate(BaseModel):
    name: str
    tracking_type: TrackingType
    keywords: List[str]
    sources: dict = {}
    check_interval_minutes: int = 60


class TrackingConfigUpdate(BaseModel):
    name: str = None
    tracking_type: TrackingType = None
    keywords: List[str] = None
    sources: dict = None
    check_interval_minutes: int = None
    is_active: bool = None


class TrackingConfigResponse(BaseModel):
    id: int
    name: str
    tracking_type: TrackingType
    keywords: List[str]
    sources: dict
    check_interval_minutes: int
    is_active: bool
    
    class Config:
        from_attributes = True


@router.post("/", response_model=TrackingConfigResponse)
async def create_tracking_config(
    config: TrackingConfigCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_config = TrackingConfig(
        user_id=current_user.id,
        name=config.name,
        tracking_type=config.tracking_type,
        keywords=json.dumps(config.keywords),
        sources=json.dumps(config.sources),
        check_interval_minutes=config.check_interval_minutes,
        is_active=True
    )
    db.add(new_config)
    db.commit()
    db.refresh(new_config)
    
    return new_config


@router.get("/", response_model=List[TrackingConfigResponse])
async def get_tracking_configs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    configs = db.query(TrackingConfig).filter(
        TrackingConfig.user_id == current_user.id
    ).all()
    
    response = []
    for config in configs:
        response.append(TrackingConfigResponse(
            id=config.id,
            name=config.name,
            tracking_type=config.tracking_type,
            keywords=json.loads(config.keywords) if config.keywords else [],
            sources=json.loads(config.sources) if config.sources else {},
            check_interval_minutes=config.check_interval_minutes,
            is_active=config.is_active
        ))
    
    return response


@router.get("/{config_id}", response_model=TrackingConfigResponse)
async def get_tracking_config(
    config_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    config = db.query(TrackingConfig).filter(
        TrackingConfig.id == config_id,
        TrackingConfig.user_id == current_user.id
    ).first()
    
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tracking configuration not found"
        )
    
    return TrackingConfigResponse(
        id=config.id,
        name=config.name,
        tracking_type=config.tracking_type,
        keywords=json.loads(config.keywords) if config.keywords else [],
        sources=json.loads(config.sources) if config.sources else {},
        check_interval_minutes=config.check_interval_minutes,
        is_active=config.is_active
    )


@router.put("/{config_id}", response_model=TrackingConfigResponse)
async def update_tracking_config(
    config_id: int,
    config_update: TrackingConfigUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    config = db.query(TrackingConfig).filter(
        TrackingConfig.id == config_id,
        TrackingConfig.user_id == current_user.id
    ).first()
    
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tracking configuration not found"
        )
    
    if config_update.name is not None:
        config.name = config_update.name
    if config_update.tracking_type is not None:
        config.tracking_type = config_update.tracking_type
    if config_update.keywords is not None:
        config.keywords = json.dumps(config_update.keywords)
    if config_update.sources is not None:
        config.sources = json.dumps(config_update.sources)
    if config_update.check_interval_minutes is not None:
        config.check_interval_minutes = config_update.check_interval_minutes
    if config_update.is_active is not None:
        config.is_active = config_update.is_active
    
    db.commit()
    db.refresh(config)
    
    return TrackingConfigResponse(
        id=config.id,
        name=config.name,
        tracking_type=config.tracking_type,
        keywords=json.loads(config.keywords) if config.keywords else [],
        sources=json.loads(config.sources) if config.sources else {},
        check_interval_minutes=config.check_interval_minutes,
        is_active=config.is_active
    )


@router.delete("/{config_id}")
async def delete_tracking_config(
    config_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    config = db.query(TrackingConfig).filter(
        TrackingConfig.id == config_id,
        TrackingConfig.user_id == current_user.id
    ).first()
    
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tracking configuration not found"
        )
    
    db.delete(config)
    db.commit()
    
    return {"message": "Tracking configuration deleted successfully"}
