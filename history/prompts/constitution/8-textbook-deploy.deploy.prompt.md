---
id: 8
title: Production Deployment & Launch Strategy
stage: deploy
date: 2025-12-06
surface: agent
model: claude-sonnet-4-5-20250929
feature: textbook-generation
branch: main
user: unknown
command: /sp.deploy
labels: ["deployment", "production", "launch"]
links:
  spec: 2
  clarify: 3
  plan: 4
  design: 5
  tasks: 6
  implement: 7
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/deployment.md
  - .github/workflows/deploy.yml
  - backend/railway.yaml
  - backend/.env.production
tests:
  - tests/deployment_health_check.py
---

## Prompt

Feature: textbook-generation
Stage: deploy

Objective:
Prepare complete production deployment infrastructure for Physical AI textbook with RAG chatbot. Setup CI/CD pipelines, environment management, health monitoring, and launch checklist.

---

## Production Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                         │
│  - Frontend code (Docusaurus)                               │
│  - Backend code (FastAPI)                                   │
│  - GitHub Actions workflows                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                                         ↓
┌─────────────────────────────┐       ┌──────────────────────────┐
│   FRONTEND: GitHub Pages    │       │  BACKEND: Railway/Render │
│                             │       │                          │
│ - URL: github.io/textbook   │       │ - URL: api.railway.app   │
│ - Auto-deploy on push       │       │ - Auto-deploy on push    │
│ - HTTPS enabled             │       │ - Environment variables  │
│ - CDN: GitHub's CDN         │       │ - Health monitoring      │
└─────────────────────────────┘       └──────────────────────────┘
                                               ↓
                            ┌──────────────────┴──────────────────┐
                            ↓                                      ↓
                    ┌─────────────────┐              ┌──────────────────────┐
                    │ Neon PostgreSQL │              │ Qdrant Cloud (Free)  │
                    │                 │              │                      │
                    │ - Users DB      │              │ - Vector embeddings  │
                    │ - Chat history  │              │ - Semantic search    │
                    │ - Bookmarks     │              │ - Metadata indexed   │
                    └─────────────────┘              └──────────────────────┘
```

---

## Frontend Deployment: GitHub Pages

### 1. GitHub Pages Configuration

```yaml
# .github/settings.yml (Repository Settings)
# Enable GitHub Pages:
# 1. Go to Settings → Pages
# 2. Source: Deploy from a branch
# 3. Branch: gh-pages
# 4. Folder: / (root)
# 5. Custom domain: (optional) textbook.yourdomain.com
```

### 2. GitHub Actions Workflow

```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Docusaurus to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'
      - '.github/workflows/deploy-frontend.yml'
  workflow_dispatch:  # Allow manual trigger

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    name: Build Docusaurus
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: 'frontend/package-lock.json'
      
      - name: Install dependencies
        working-directory: frontend
        run: npm ci
      
      - name: Build Docusaurus
        working-directory: frontend
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.REACT_APP_API_URL }}
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          path: 'frontend/build'
  
  deploy:
    name: Deploy to GitHub Pages
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v1

  notify:
    name: Notify Deployment
    runs-on: ubuntu-latest
    needs: deploy
    if: success()
    
    steps:
      - name: Slack notification
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Frontend deployed to GitHub Pages ✅'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()
```

### 3. Docusaurus Production Config

```javascript
// frontend/docusaurus.config.js (production settings)
module.exports = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'AI-Native Textbook with RAG Chatbot',
  url: 'https://username.github.io',
  baseUrl: '/PhysicalAI-Textbook/',
  
  // Production optimizations
  staticDirectories: ['static'],
  trailingSlash: false,
  
  themeConfig: {
    metadata: [
      { name: 'theme-color', content: '#667eea' },
      { name: 'og:type', content: 'website' },
      { name: 'og:title', content: 'Physical AI Textbook' },
      { name: 'og:description', content: 'AI-Native textbook with RAG chatbot' },
      { name: 'og:image', content: 'https://username.github.io/img/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
  },
  
  // Performance optimization
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          sidebarCollapsible: true,
          breadcrumbs: true,
        },
      },
    ],
  ],
  
  plugins: [
    [
      '@docusaurus/plugin-pwa',
      {
        desc: 'Physical AI Textbook PWA',
        name: 'Physical AI Textbook',
        short_name: 'Physical AI',
        theme_color: '#667eea',
        background_color: '#ffffff',
      },
    ],
  ],
};
```

---

## Backend Deployment: Railway/Render

### 1. Railway Deployment Configuration

```yaml
# railway.yaml
services:
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    start: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    healthcheck:
      path: /api/health
      interval: 30s
      timeout: 10s
      retries: 3
    environment:
      - DATABASE_URL
      - QDRANT_URL
      - QDRANT_API_KEY
      - OPENAI_API_KEY
      - CLAUDE_API_KEY
      - ENVIRONMENT=production

  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: ${{ secrets.DB_PASSWORD }}
    volumes:
      - data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  data:
```

### 2. Docker Configuration

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/api/health')"

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 3. Environment Variables for Production

```bash
# backend/.env.production
# Database
DATABASE_URL=postgresql://user:pass@neon.tech/dbname
NEON_API_KEY=xxxxx

# Vector Database
QDRANT_URL=https://your-qdrant-cloud.io
QDRANT_API_KEY=xxxxx

# LLM APIs
OPENAI_API_KEY=sk-proj-xxxxx
CLAUDE_API_KEY=sk-ant-xxxxx

# Application
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO

# CORS
CORS_ORIGINS=["https://username.github.io", "https://textbook.yourdomain.com"]

# Security
SECRET_KEY=your-secret-key-generate-with-secrets-module
ALLOWED_HOSTS=["api.railway.app", "api.yourdomain.com"]

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_PERIOD=60

# Monitoring
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
MONITORING_ENABLED=true
```

### 4. GitHub Actions Backend Deployment

```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend to Railway

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      - '.github/workflows/deploy-backend.yml'
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy to Railway
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Install Railway CLI
        run: npm i -g @railway/cli
      
      - name: Deploy to Railway
        run: railway up
        working-directory: backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
      
      - name: Health check
        run: |
          for i in {1..30}; do
            if curl -f https://api.railway.app/api/health; then
              echo "✅ Health check passed"
              exit 0
            fi
            echo "Attempt $i/30 - waiting for backend to start..."
            sleep 10
          done
          echo "❌ Health check failed"
          exit 1
      
      - name: Slack notification
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Backend deployed to Railway ✅'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()
```

---

## Health Checks & Monitoring

### 1. Health Check Endpoint

```python
# backend/app/api/health.py
from fastapi import APIRouter
from datetime import datetime
import os

router = APIRouter()

@router.get("/health")
async def health_check():
    """Comprehensive health check endpoint"""
    
    health_status = {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "environment": os.getenv("ENVIRONMENT", "unknown"),
        "services": {
            "api": "healthy",
            "database": await check_database(),
            "qdrant": await check_qdrant(),
            "openai": await check_openai(),
        }
    }
    
    # Determine overall status
    if any(v != "healthy" for v in health_status["services"].values()):
        health_status["status"] = "degraded"
    
    return health_status

async def check_database():
    """Check database connectivity"""
    try:
        from app.database import engine
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        return "healthy"
    except Exception as e:
        print(f"Database check failed: {e}")
        return "unhealthy"

async def check_qdrant():
    """Check Qdrant connectivity"""
    try:
        from app.qdrant_client import qdrant_client
        info = qdrant_client.get_collections()
        return "healthy" if info else "unhealthy"
    except Exception as e:
        print(f"Qdrant check failed: {e}")
        return "unhealthy"

async def check_openai():
    """Check OpenAI API connectivity"""
    try:
        import openai
        # Minimal check without using API quota
        openai.api_key = os.getenv("OPENAI_API_KEY")
        return "healthy" if openai.api_key else "unhealthy"
    except Exception as e:
        print(f"OpenAI check failed: {e}")
        return "unhealthy"

@router.get("/health/live")
async def liveness_probe():
    """Kubernetes liveness probe"""
    return {"status": "alive"}

@router.get("/health/ready")
async def readiness_probe():
    """Kubernetes readiness probe"""
    health = await health_check()
    return health if health["status"] == "ok" else {"status": "not_ready"}
```

### 2. Monitoring & Logging

```python
# backend/app/logging_config.py
import logging
import os
from pythonjsonlogger import jsonlogger

def setup_logging():
    """Setup structured JSON logging"""
    
    # Create logger
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    # JSON handler
    logHandler = logging.StreamHandler()
    formatter = jsonlogger.JsonFormatter()
    logHandler.setFormatter(formatter)
    logger.addHandler(logHandler)
    
    # Also log to file in production
    if os.getenv("ENVIRONMENT") == "production":
        fileHandler = logging.FileHandler("app.log")
        fileHandler.setFormatter(formatter)
        logger.addHandler(fileHandler)
    
    return logger

# In main.py
logger = setup_logging()

@app.middleware("http")
async def log_requests(request, call_next):
    """Log all requests"""
    response = await call_next(request)
    logger.info({
        "method": request.method,
        "path": request.url.path,
        "status": response.status_code,
        "duration": response.headers.get("X-Process-Time", 0)
    })
    return response
```

### 3. Error Tracking (Sentry)

```python
# backend/app/main.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

if os.getenv("ENVIRONMENT") == "production":
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        integrations=[FastApiIntegration()],
        traces_sample_rate=0.1,
        profiles_sample_rate=0.1,
    )
```

---

## Pre-Launch Checklist

### Frontend Checklist

- [ ] Docusaurus builds successfully
- [ ] Build time < 60 seconds
- [ ] Bundle size analyzed and optimized
- [ ] Lighthouse score > 90
- [ ] SEO checklist passed
  - [ ] Meta tags present
  - [ ] Open Graph tags
  - [ ] Sitemap generated
  - [ ] robots.txt configured
- [ ] All chapters display correctly
- [ ] Chat widget loads and functions
- [ ] Text selection feature works
- [ ] Navigation sidebar responsive
- [ ] Mobile layout verified
  - [ ] iPhone SE (375px)
  - [ ] iPad (768px)
  - [ ] Desktop (1440px)
- [ ] Cross-browser tested
  - [ ] Chrome 120+
  - [ ] Firefox 121+
  - [ ] Safari 17+
  - [ ] Edge 120+
- [ ] No console errors or warnings
- [ ] Images optimized (WebP format)
- [ ] CSS/JS minified
- [ ] Service Worker functional (PWA)
- [ ] HTTPS certificate valid
- [ ] Custom domain configured (if applicable)
- [ ] DNS records updated (if applicable)
- [ ] GitHub Pages settings correct
- [ ] Deployment workflow passes
- [ ] Build artifacts uploaded
- [ ] Site live and accessible

### Backend Checklist

- [ ] Docker image builds successfully
- [ ] Docker image size < 500MB
- [ ] All dependencies specified in requirements.txt
- [ ] Environment variables template complete (.env.template)
- [ ] Database migrations run successfully
- [ ] Qdrant collection created with proper schema
- [ ] Health check endpoint returns 200
- [ ] All API endpoints tested
  - [ ] POST /api/chat (response < 3s)
  - [ ] POST /api/query (response < 1s)
  - [ ] GET /api/health (response < 100ms)
  - [ ] POST /api/auth/* endpoints
  - [ ] GET /api/user/* endpoints
- [ ] Rate limiting configured and working
- [ ] CORS configured correctly
- [ ] Error handling comprehensive
  - [ ] 400 Bad Request responses
  - [ ] 401 Unauthorized responses
  - [ ] 404 Not Found responses
  - [ ] 500 Internal Server Error responses
- [ ] Logging configured (JSON format)
- [ ] Monitoring enabled (Sentry)
- [ ] Database backups configured
- [ ] SSL/TLS certificate valid
- [ ] Secrets managed securely
  - [ ] No secrets in code
  - [ ] Environment variables used
  - [ ] GitHub Secrets configured
  - [ ] Railway environment variables set
- [ ] Performance optimized
  - [ ] Database indexes created
  - [ ] Query N+1 problems resolved
  - [ ] Caching implemented
- [ ] Security hardened
  - [ ] SQL injection prevention
  - [ ] XSS protection
  - [ ] CSRF tokens
  - [ ] Rate limiting
  - [ ] Input validation
- [ ] API documentation updated (Swagger)
- [ ] README.md with setup instructions
- [ ] CONTRIBUTING.md guidelines
- [ ] Deployment workflow passes
- [ ] Container runs in production
- [ ] Health checks pass

### Integration Checklist

- [ ] Frontend and backend connected
- [ ] Chat widget calls correct API endpoint
- [ ] Responses display correctly
- [ ] Citations link to correct chapters
- [ ] Authentication flow works (if enabled)
- [ ] User data persisted correctly
- [ ] Chat history saved in database
- [ ] Bookmarks functional
- [ ] Progress tracking works
- [ ] Personalization settings saved
- [ ] Language switching functional (if Urdu enabled)
- [ ] All features work on mobile
- [ ] End-to-end test completed
  - [ ] User signup
  - [ ] Chapter navigation
  - [ ] Chat queries (3+ different topics)
  - [ ] Text selection feature
  - [ ] Bookmark creation
  - [ ] Progress tracking
  - [ ] User logout

### Performance Checklist

- [ ] Frontend Lighthouse scores
  - [ ] Performance: > 90
  - [ ] Accessibility: > 90
  - [ ] Best Practices: > 90
  - [ ] SEO: > 90
- [ ] Backend response times
  - [ ] Chat endpoint: < 3 seconds (p95)
  - [ ] Query endpoint: < 1 second (p95)
  - [ ] Health check: < 100ms
- [ ] Database query performance
  - [ ] Query latency < 100ms
  - [ ] Connection pool healthy
- [ ] API throughput
  - [ ] Requests per second: > 100 RPS
  - [ ] Concurrent users: > 50
- [ ] Uptime monitoring
  - [ ] Target: > 99% availability
  - [ ] Response time alerts enabled
  - [ ] Error rate alerts enabled

### Security Checklist

- [ ] SSL/TLS certificates valid
- [ ] HTTPS enforced everywhere
- [ ] Security headers configured
  - [ ] Content-Security-Policy
  - [ ] X-Frame-Options
  - [ ] X-Content-Type-Options
  - [ ] Strict-Transport-Security
- [ ] Rate limiting enabled
- [ ] Input validation comprehensive
- [ ] Secrets not exposed
- [ ] Dependency vulnerabilities scanned
- [ ] OWASP Top 10 addressed
- [ ] Authentication secure
- [ ] Authorization enforced
- [ ] Audit logging enabled
- [ ] Incident response plan documented
- [ ] Security policy documented

### Documentation Checklist

- [ ] API documentation complete (Swagger/OpenAPI)
- [ ] README.md includes:
  - [ ] Project description
  - [ ] Features list
  - [ ] Tech stack
  - [ ] Installation instructions
  - [ ] Usage examples
  - [ ] API endpoints
  - [ ] Deployment guide
  - [ ] Contributing guide
  - [ ] License
- [ ] CONTRIBUTING.md includes:
  - [ ] Development setup
  - [ ] Code standards
  - [ ] Testing requirements
  - [ ] Commit message format
  - [ ] PR process
- [ ] Deployment guide includes:
  - [ ] Prerequisites
  - [ ] Step-by-step instructions
  - [ ] Environment variables
  - [ ] Database setup
  - [ ] Troubleshooting
- [ ] Architecture documentation
  - [ ] System diagram
  - [ ] Data flow
  - [ ] Component responsibilities
- [ ] Runbook for operations
  - [ ] Common tasks
  - [ ] Troubleshooting procedures
  - [ ] Scaling instructions
  - [ ] Disaster recovery

---

## Launch Day Procedure

### T-1 Day: Final Verification

```bash
# 1. Build and test locally
cd frontend
npm run build
npm run serve  # Test in browser

cd ../backend
docker build -t textbook-api:latest .
docker run -p 8000:8000 textbook-api:latest
curl http://localhost:8000/api/health

# 2. Run final test suite
npm test
python -m pytest tests/ -v

# 3. Verify all environment variables set
./scripts/verify_env.sh

# 4. Run security scan
docker scan textbook-api:latest
npm audit

# 5. Database backup
./scripts/backup_database.sh
```

### T-0 Hours: Launch

```bash
# 1. Final commit and tag
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin main --tags

# 2. Monitor deployments
# - Watch GitHub Actions workflows
# - Check deployment status in Railway
# - Verify GitHub Pages deployment

# 3. Run health checks
curl https://api.railway.app/api/health
curl https://username.github.io/PhysicalAI-Textbook/

# 4. Smoke tests
./scripts/smoke_test.sh

# 5. Announce launch
# - Post announcement on Twitter/LinkedIn
# - Update project README
# - Send email to stakeholders
```

### T+1 Hour: Post-Launch Monitoring

```bash
# 1. Monitor error rates
# - Check Sentry dashboard
# - Review application logs

# 2. Performance monitoring
# - Check Lighthouse scores
# - Monitor API response times
# - Check database performance

# 3. User feedback
# - Monitor GitHub Issues
# - Check Slack/Discord channels
# - Read user feedback

# 4. Alert response
# - Be ready to rollback if critical issues
# - Have deployment team on standby
```

---

## Rollback Procedure

If critical issues occur:

```bash
# 1. Immediate rollback
git revert <commit-hash>
git push origin main

# 2. Monitor rollback
# - Check deployment status
# - Run health checks
# - Verify functionality

# 3. Post-incident
# - Document what went wrong
# - Create GitHub issue for fix
# - Schedule follow-up deployment
```

---

## Post-Launch Operations

### Week 1: Stabilization

- Monitor error rates and performance
- Respond to user feedback
- Fix critical bugs
- Optimize based on analytics

### Week 2-4: Optimization

- Implement performance improvements
- Add requested features
- Improve documentation
- Scale infrastructure if needed

### Ongoing: Maintenance

- Regular security updates
- Database maintenance
- Dependency updates
- Monitoring and alerting

---

## Output

Generate comprehensive deployment guide at `.specify/memory/deployment.md` with:
- Complete deployment architecture diagrams
- Detailed configuration files (railway.yaml, Dockerfile)
- GitHub Actions workflow templates
- Environment variable templates
- Health check implementation
- Monitoring setup (Sentry, logging)
- Pre-launch verification checklist (100+ items)
- Launch day procedure
- Post-launch monitoring plan
- Troubleshooting guide
- Rollback procedures
- Runbook for operations
- Security hardening guide
- Performance optimization tips

## Response snapshot

Complete deployment strategy created at `.specify/memory/deployment.md` with full production readiness.

## Outcome

- ✅ Impact: Production-ready infrastructure and processes.
- 🧪 Tests: Comprehensive pre-launch checklist included.
- 📁 Files: GitHub Actions workflows, Docker config, environment templates.
- 🔁 Next prompts: Execute `/sp.implement` to begin Phase 1 development.
- 🧠 Reflection: Complete deployment strategy ensures smooth production launch.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Start with GitHub Pages setup

```