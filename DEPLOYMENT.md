# Deployment Guide

This guide covers deployment options for the Competitive Intelligence AI Agent system.

## Prerequisites

- Docker and Docker Compose (recommended)
- Python 3.11+ (for local development)
- Node.js 18+ (for local development)
- PostgreSQL 14+ (if not using Docker)
- Redis 7+ (if not using Docker)

## Quick Start with Docker Compose (Recommended)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd codecrew
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` file with your configuration:

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/competitive_intelligence
REDIS_URL=redis://localhost:6379/0

# Optional - for enhanced functionality
NEWS_API_KEY=your_news_api_key_here
TWITTER_API_KEY=your_twitter_api_key_here
REDDIT_CLIENT_ID=your_reddit_client_id_here

# Optional - for email notifications
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
NOTIFICATION_EMAIL=your_email@gmail.com
```

### 3. Start Services

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Redis cache
- FastAPI backend
- Celery worker
- Celery beat scheduler

### 4. Initialize Database

```bash
# Run database migrations
docker-compose exec backend alembic upgrade head
```

### 5. Access the Application

- Frontend Dashboard: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Local Development Setup

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp ../.env.example .env
# Edit .env with your configuration

# Initialize database
alembic upgrade head

# Start backend server
python main.py
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Start Celery Workers (Separate Terminal)

```bash
cd backend
source venv/bin/activate

# Start Celery worker
celery -A app.tasks.celery_app worker -l info

# Start Celery beat (another terminal)
celery -A app.tasks.celery_app beat -l info
```

## Production Deployment

### Using Docker Compose (Production)

1. Update `.env` with production values
2. Use production-grade secrets
3. Update `docker-compose.yml` for production:
   - Remove volume mounts for code
   - Use built images instead of building
   - Add health checks
   - Configure proper resource limits

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Using Kubernetes

Create Kubernetes manifests for:
- PostgreSQL deployment
- Redis deployment
- Backend deployment
- Celery worker deployment
- Celery beat deployment
- Services and ingress

### Cloud Deployment Options

#### AWS
- **ECS/Fargate**: Container orchestration
- **RDS**: Managed PostgreSQL
- **ElastiCache**: Managed Redis
- **SES**: Email notifications

#### Google Cloud
- **Cloud Run**: Container deployment
- **Cloud SQL**: Managed PostgreSQL
- **Memorystore**: Managed Redis
- **Cloud Tasks**: Alternative to Celery

#### Azure
- **Container Instances**: Container deployment
- **Azure Database**: Managed PostgreSQL
- **Azure Cache**: Managed Redis
- **Azure Functions**: Serverless alternative

## Monitoring and Maintenance

### Health Checks

```bash
# Check API health
curl http://localhost:8000/api/health

# Check database connection
docker-compose exec backend python -c "from app.core.database import engine; engine.connect()"
```

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f celery_worker
```

### Database Backups

```bash
# Backup database
docker-compose exec postgres pg_dump -U user competitive_intelligence > backup.sql

# Restore database
docker-compose exec -T postgres psql -U user competitive_intelligence < backup.sql
```

### Scaling

To handle increased load:

1. **Scale Celery Workers**:
```bash
docker-compose up -d --scale celery_worker=3
```

2. **Add Redis Replication** for high availability
3. **Add Database Read Replicas** for improved read performance
4. **Implement Caching** for frequently accessed data

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Use secrets management in production
3. **HTTPS**: Enable SSL/TLS for production
4. **Authentication**: Implement rate limiting
5. **Database**: Use strong passwords and restrict access
6. **Network**: Use VPCs/firewalls to restrict access

## Troubleshooting

### Common Issues

**Database Connection Failed**
- Check PostgreSQL is running: `docker-compose ps postgres`
- Verify connection string in `.env`
- Check database logs: `docker-compose logs postgres`

**Celery Tasks Not Running**
- Verify Redis is running: `docker-compose ps redis`
- Check Celery logs: `docker-compose logs celery_worker`
- Ensure broker URL is correct in `.env`

**API Not Responding**
- Check backend logs: `docker-compose logs backend`
- Verify all dependencies are installed
- Check port conflicts

**OpenAI API Errors**
- Verify API key is valid
- Check API quota limits
- Review OpenAI service status

## Performance Optimization

1. **Database Indexing**: Add indexes for frequently queried fields
2. **Caching**: Implement Redis caching for API responses
3. **Async Operations**: Ensure all I/O operations are async
4. **Connection Pooling**: Configure database connection pools
5. **Load Balancing**: Add load balancer for multiple backend instances

## Cost Optimization

1. **Right-size Resources**: Monitor and adjust resource allocation
2. **Scheduled Tasks**: Use spot instances for non-critical workloads
3. **Data Retention**: Implement automated cleanup of old data
4. **Caching**: Reduce API calls to external services
5. **Monitoring**: Set up alerts for unusual cost patterns

## Support and Maintenance

- **Regular Updates**: Keep dependencies updated
- **Security Patches**: Apply security updates promptly
- **Monitoring**: Set up comprehensive monitoring
- **Backups**: Regular database backups
- **Documentation**: Keep deployment documentation updated

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Celery Documentation](https://docs.celeryproject.org/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
