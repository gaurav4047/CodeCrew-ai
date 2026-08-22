from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.api import tracking, insights, auth, health, chat
from loguru import logger
import sys

# Configure logger
logger.remove()
logger.add(sys.stdout, level="INFO")

# Create FastAPI app
app = FastAPI(
    title="Competitive Intelligence API",
    description="AI-powered competitive intelligence and research tracking system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(tracking.router, prefix="/api/tracking", tags=["Tracking"])
app.include_router(insights.router, prefix="/api/insights", tags=["Insights"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(health.router, prefix="/api/health", tags=["Health"])


@app.on_event("startup")
async def startup_event():
    logger.info("Starting Competitive Intelligence API")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Competitive Intelligence API")


@app.get("/")
async def root():
    return {
        "message": "Competitive Intelligence API",
        "version": "1.0.0",
        "status": "operational"
    }
