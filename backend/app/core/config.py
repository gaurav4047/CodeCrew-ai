from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./competitive_intel.db"
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # API Keys
    XAI_API_KEY: Optional[str] = "your_xai_api_key_here"
    GROQ_API_KEY: Optional[str] = None
    NEWS_API_KEY: Optional[str] = None
    TWITTER_API_KEY: Optional[str] = None
    TWITTER_API_SECRET: Optional[str] = None
    TWITTER_ACCESS_TOKEN: Optional[str] = None
    TWITTER_ACCESS_SECRET: Optional[str] = None
    REDDIT_CLIENT_ID: Optional[str] = None
    REDDIT_CLIENT_SECRET: Optional[str] = None
    REDDIT_USER_AGENT: Optional[str] = None
    
    # Application
    SECRET_KEY: str = "your-secret-key-change-this"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Monitoring
    DEFAULT_CHECK_INTERVAL_MINUTES: int = 60
    MAX_RETRIES: int = 3
    REQUEST_TIMEOUT_SECONDS: int = 30
    
    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    
    # URLs
    FRONTEND_URL: str = "http://localhost:3000"
    BACKEND_URL: str = "http://localhost:8000"
    
    # Optional Monitoring
    ENABLE_PROMETHEUS: bool = False
    PROMETHEUS_PORT: int = 9090
    
    # Email Notifications
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    FROM_EMAIL: str = "noreply@competitiveintel.com"
    NOTIFICATION_EMAIL: str = ""  # Default email for notifications
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


settings = Settings()
