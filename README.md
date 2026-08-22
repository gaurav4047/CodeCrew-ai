# Competitive Intelligence AI Agent

An autonomous AI agent system for continuously tracking research trends, patent developments, competitor strategies, and industry news for organizations, startups, and research institutions.

## Features

- **Multi-Source Data Collection**: Monitor scientific publications, patent databases, news platforms, and social media
- **AI-Powered Analysis**: Extract actionable insights from vast information sources
- **Real-Time Monitoring**: Continuous tracking with configurable schedules
- **Competitive Intelligence**: Track competitor activities and strategies
- **Alert System**: Timely notifications for important developments
- **Interactive Dashboard**: Visualize trends, insights, and analytics
- **Customizable Tracking**: Configure sources, keywords, and alert preferences

## Architecture

### Components

1. **Data Ingestion Layer**
   - Research Papers Collector (arXiv, PubMed, Google Scholar)
   - Patent Monitor (Google Patents, USPTO, EPO)
   - News Aggregator (News APIs, RSS feeds)
   - Social Media Tracker (Twitter/X, LinkedIn, Reddit)

2. **AI Analysis Engine**
   - Content summarization and extraction
   - Trend detection and analysis
   - Competitor activity analysis
   - Insight generation and prioritization

3. **Monitoring & Scheduling**
   - Task scheduling (Celery + Redis)
   - Real-time monitoring
   - Alert triggering system

4. **Data Persistence**
   - PostgreSQL database
   - Vector storage for semantic search
   - Cache layer for performance

5. **API Layer**
   - RESTful API (FastAPI)
   - WebSocket for real-time updates
   - Authentication and authorization

6. **Frontend Dashboard**
   - React + TypeScript
   - Data visualization
   - Configuration management

## Tech Stack

- **Backend**: Python 3.11+, FastAPI
- **Database**: PostgreSQL + SQLAlchemy
- **Task Queue**: Celery + Redis
- **AI/ML**: OpenAI API, LangChain, Sentence Transformers
- **Frontend**: React + TypeScript + Vite
- **Containerization**: Docker + Docker Compose
- **Monitoring**: Prometheus + Grafana (optional)

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd codecrew
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

3. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

4. Install frontend dependencies:
```bash
cd frontend
npm install
```

5. Initialize database:
```bash
cd backend
python -m alembic upgrade head
```

6. Start services:
```bash
# Using Docker Compose (recommended)
docker-compose up -d

# Or manually start services
redis-server
celery -A backend.tasks worker -l info
python -m backend.main
```

7. Start frontend:
```bash
cd frontend
npm run dev
```

## Configuration

Edit `.env` file to configure:
- API keys (OpenAI, news APIs, social media APIs)
- Database connection strings
- Monitoring intervals
- Alert preferences
- Source configurations

## Usage

### API Endpoints

- `POST /api/track` - Add new tracking configuration
- `GET /api/insights` - Retrieve generated insights
- `GET /api/trends` - Get trend analysis
- `WS /api/real-time` - WebSocket for real-time updates

### Dashboard

Access the dashboard at `http://localhost:3000`

## Development

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Code Style

- Backend: Black, Flake8, mypy
- Frontend: ESLint, Prettier

## License

MIT License
