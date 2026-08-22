import uvicorn
from app.api.main import app
from app.core.database import engine, Base
from app.core.config import settings

# Create tables
Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    print("Starting Competitive Intelligence API with Grok Chatbot...")
    print(f"xAI API Key configured: {bool(settings.XAI_API_KEY)}")
    uvicorn.run(
        "app.api.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
