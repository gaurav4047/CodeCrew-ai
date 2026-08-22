from celery import Task
from typing import Dict, Any, List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.tasks.celery_app import celery_app
from app.core.database import SessionLocal, get_db
from app.models.tracking import TrackingConfig, TrackingType
from app.models.insight import Insight
from app.services.research_collector import ResearchCollector
from app.services.patent_collector import PatentCollector
from app.services.news_collector import NewsCollector
from app.services.social_collector import SocialMediaCollector
from app.services.ai_analyzer import AIAnalyzer
from loguru import logger
import json


class DatabaseTask(Task):
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


@celery_app.task(base=DatabaseTask, bind=True, max_retries=3)
def run_tracking_checks(self):
    """Run all active tracking checks"""
    try:
        db = self.db
        active_configs = db.query(TrackingConfig).filter(TrackingConfig.is_active == True).all()
        
        logger.info(f"Running tracking checks for {len(active_configs)} configurations")
        
        for config in active_configs:
            try:
                process_tracking_config.delay(config.id)
            except Exception as e:
                logger.error(f"Error scheduling tracking for config {config.id}: {str(e)}")
                
    except Exception as e:
        logger.error(f"Error in run_tracking_checks: {str(e)}")
        raise self.retry(exc=e, countdown=60)


@celery_app.task(base=DatabaseTask, bind=True, max_retries=3)
def process_tracking_config(self, config_id: int):
    """Process a single tracking configuration"""
    try:
        db = self.db
        config = db.query(TrackingConfig).filter(TrackingConfig.id == config_id).first()
        
        if not config:
            logger.error(f"Tracking config {config_id} not found")
            return
        
        logger.info(f"Processing tracking config: {config.name}")
        
        # Parse keywords and sources
        keywords = json.loads(config.keywords) if config.keywords else []
        sources_config = json.loads(config.sources) if config.sources else {}
        
        # Calculate time threshold
        time_threshold = datetime.utcnow() - timedelta(minutes=config.check_interval_minutes)
        
        # Initialize appropriate collector
        collector = None
        if config.tracking_type == TrackingType.RESEARCH:
            collector = ResearchCollector(sources_config)
        elif config.tracking_type == TrackingType.PATENT:
            collector = PatentCollector(sources_config)
        elif config.tracking_type == TrackingType.NEWS:
            collector = NewsCollector(sources_config)
        elif config.tracking_type == TrackingType.SOCIAL_MEDIA:
            collector = SocialMediaCollector(sources_config)
        
        if not collector:
            logger.error(f"No collector found for tracking type: {config.tracking_type}")
            return
        
        # Collect data
        import asyncio
        data = asyncio.run(collector.collect_and_normalize(keywords, time_threshold))
        
        if not data:
            logger.info(f"No new data collected for {config.name}")
            return
        
        # Analyze data
        analyzer = AIAnalyzer()
        context = {
            'tracking_name': config.name,
            'tracking_type': config.tracking_type.value,
            'keywords': keywords
        }
        
        insights = asyncio.run(analyzer.analyze_data(data, context))
        
        # Deduplicate insights
        insights = analyzer.deduplicate_insights(insights)
        
        # Save insights to database
        for insight_data in insights:
            insight = Insight(
                tracking_config_id=config.id,
                title=insight_data['title'],
                summary=insight_data['summary'],
                full_content=insight_data.get('full_content'),
                source_url=insight_data.get('source_url'),
                source_type=insight_data.get('source_type'),
                priority=insight_data.get('priority', 'medium'),
                category=insight_data.get('category'),
                relevance_score=insight_data.get('relevance_score', 0.5),
                entities=json.dumps(insight_data.get('entities', [])),
                published_at=insight_data.get('published_at'),
                discovered_at=insight_data.get('discovered_at')
            )
            db.add(insight)
        
        db.commit()
        logger.info(f"Saved {len(insights)} insights for {config.name}")
        
    except Exception as e:
        logger.error(f"Error processing tracking config {config_id}: {str(e)}")
        raise self.retry(exc=e, countdown=60)


@celery_app.task(base=DatabaseTask, bind=True)
def generate_daily_report(self):
    """Generate daily intelligence report"""
    try:
        db = self.db
        
        # Get insights from the last 24 hours
        yesterday = datetime.utcnow() - timedelta(days=1)
        recent_insights = db.query(Insight).filter(
            Insight.discovered_at >= yesterday
        ).order_by(Insight.discovered_at.desc()).limit(100).all()
        
        # Group by category and priority
        report = {
            'generated_at': datetime.utcnow().isoformat(),
            'total_insights': len(recent_insights),
            'by_category': {},
            'by_priority': {},
            'high_priority_insights': []
        }
        
        for insight in recent_insights:
            # Count by category
            category = insight.category.value if insight.category else 'unknown'
            report['by_category'][category] = report['by_category'].get(category, 0) + 1
            
            # Count by priority
            priority = insight.priority.value if insight.priority else 'unknown'
            report['by_priority'][priority] = report['by_priority'].get(priority, 0) + 1
            
            # Collect high priority insights
            if insight.priority and insight.priority.value in ['high', 'critical']:
                report['high_priority_insights'].append({
                    'title': insight.title,
                    'summary': insight.summary,
                    'category': category,
                    'priority': priority,
                    'discovered_at': insight.discovered_at.isoformat()
                })
        
        logger.info(f"Daily report generated: {report['total_insights']} insights")
        
        # Send daily report via email if configured
        # In a real system, you would fetch user emails from the database
        # For now, we just log the report
        logger.info(f"Daily report: {json.dumps(report, indent=2)}")
        
        return report
        
    except Exception as e:
        logger.error(f"Error generating daily report: {str(e)}")
        raise


@celery_app.task(base=DatabaseTask, bind=True)
def cleanup_old_data(self):
    """Clean up old insights and data"""
    try:
        db = self.db
        
        # Delete insights older than 90 days
        cutoff_date = datetime.utcnow() - timedelta(days=90)
        deleted = db.query(Insight).filter(
            Insight.discovered_at < cutoff_date
        ).delete()
        
        db.commit()
        logger.info(f"Cleaned up {deleted} old insights")
        
        return deleted
        
    except Exception as e:
        logger.error(f"Error cleaning up old data: {str(e)}")
        raise
