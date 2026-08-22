from celery import Task
from typing import Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.tasks.celery_app import celery_app
from app.core.database import SessionLocal
from app.core.config import settings
from app.models.insight import Insight, InsightPriority
from app.services.notification_service import notification_service
from loguru import logger


class NotificationTask(Task):
    """Base task with database session management"""
    _db = None
    
    @property
    def db(self):
        if self._db is None:
            self._db = SessionLocal()
        return self._db
    
    def after_return(self, *args, **kwargs):
        if self._db is not None:
            self._db.close()
            self._db = None


@celery_app.task(base=NotificationTask, bind=True)
def send_high_priority_alerts(self):
    """Send alerts for high-priority insights discovered in the last hour"""
    try:
        db = self.db
        
        # Get high priority insights from the last hour that haven't been alerted
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        high_priority_insights = db.query(Insight).filter(
            Insight.priority == InsightPriority.HIGH,
            Insight.discovered_at >= one_hour_ago,
            Insight.alerted == False
        ).all()
        
        # Use configured notification email instead of fetching from users
        notification_email = settings.NOTIFICATION_EMAIL
        
        if not notification_email:
            logger.warning("No notification email configured, skipping alerts")
            return
        
        for insight in high_priority_insights:
            insight_data = {
                'title': insight.title,
                'summary': insight.summary,
                'priority': insight.priority.value if insight.priority else 'unknown',
                'category': insight.category.value if insight.category else 'unknown',
                'relevance_score': insight.relevance_score,
                'source_url': insight.source_url
            }
            
            try:
                success = notification_service.send_insight_alert(
                    notification_email,
                    insight_data
                )
                if success:
                    logger.info(f"Alert sent to {notification_email} for insight {insight.id}")
                    # Mark insight as alerted
                    insight.alerted = True
                    db.commit()
            except Exception as e:
                logger.error(f"Failed to send alert to {notification_email}: {str(e)}")
        
        logger.info(f"Processed {len(high_priority_insights)} high priority insights")
        
    except Exception as e:
        logger.error(f"Error in send_high_priority_alerts: {str(e)}")
        raise
