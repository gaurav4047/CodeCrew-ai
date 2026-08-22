from celery.schedules import crontab
from app.tasks.celery_app import celery_app
from app.tasks.monitoring_tasks import run_tracking_checks, generate_daily_report, cleanup_old_data
from app.tasks.notification_tasks import send_high_priority_alerts

# Celery beat schedule for periodic tasks
celery_app.conf.beat_schedule = {
    # Run tracking checks every hour
    'run-tracking-checks-every-hour': {
        'task': 'app.tasks.monitoring_tasks.run_tracking_checks',
        'schedule': crontab(minute=0),  # Every hour
    },
    
    # Generate daily report at 8 AM UTC
    'generate-daily-report': {
        'task': 'app.tasks.monitoring_tasks.generate_daily_report',
        'schedule': crontab(hour=8, minute=0),  # 8 AM UTC daily
    },
    
    # Cleanup old data weekly (Sunday at 2 AM UTC)
    'cleanup-old-data': {
        'task': 'app.tasks.monitoring_tasks.cleanup_old_data',
        'schedule': crontab(day_of_week=0, hour=2, minute=0),  # Sunday 2 AM UTC
    },
    
    # Send high priority alerts every 30 minutes
    'send-high-priority-alerts': {
        'task': 'app.tasks.notification_tasks.send_high_priority_alerts',
        'schedule': crontab(minute='*/30'),  # Every 30 minutes
    },
}

celery_app.conf.timezone = 'UTC'
