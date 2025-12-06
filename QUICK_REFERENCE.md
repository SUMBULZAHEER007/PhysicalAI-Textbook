# Quick Reference Guide - Physical AI Textbook Project

## 📌 Essential Files Location

```
history/prompts/constitution/
├── 1-initial-constitution-generation.constitution.prompt.md ← Start here
├── 2-textbook-specification.specify.prompt.md
├── 3-textbook-clarification.clarify.prompt.md
├── 4-textbook-plan.plan.prompt.md
├── 5-textbook-design.design.prompt.md
├── 6-textbook-tasks.tasks.prompt.md
├── 7-textbook-implement.implement.prompt.md ← Execution guide
└── 8-textbook-deploy.deploy.prompt.md ← Production ready
```

**Main Summary**: `SPECIFICATION_SUMMARY.md` (this directory)

---

## 🎯 Quick Navigation

### For Project Managers
- Read: `SPECIFICATION_SUMMARY.md` (this file)
- Then: `history/prompts/constitution/4-textbook-plan.plan.prompt.md` (timeline)
- Reference: `history/prompts/constitution/6-textbook-tasks.tasks.prompt.md` (53 tasks)

### For Frontend Developers
- Start: `history/prompts/constitution/7-textbook-implement.implement.prompt.md` (Day 3-5: Docusaurus setup)
- Reference: `history/prompts/constitution/5-textbook-design.design.prompt.md` (Component design)
- Code: Complete React templates in `/sp.implement`

### For Backend Developers
- Start: `history/prompts/constitution/7-textbook-implement.implement.prompt.md` (Day 4-5: FastAPI setup)
- Reference: `history/prompts/constitution/5-textbook-design.design.prompt.md` (API design)
- Code: Complete Python templates in `/sp.implement`

### For DevOps/Deployment
- Read: `history/prompts/constitution/8-textbook-deploy.deploy.prompt.md` (production deployment)
- Reference: GitHub Actions workflows and Docker configs

### For QA/Testing
- Reference: `history/prompts/constitution/8-textbook-deploy.deploy.prompt.md` (115+ checklist)
- Guide: `history/prompts/constitution/6-textbook-tasks.tasks.prompt.md` (acceptance criteria per task)

---

## 🚀 Phase Overview

### Phase 1: MVP (Weeks 1-3) - 100 Base Points
**Goal**: Functional textbook + working RAG chatbot

**Week 1**: Infrastructure setup
- [ ] GitHub repo with CI/CD
- [ ] Docusaurus project initialized
- [ ] FastAPI backend running
- [ ] Qdrant and Neon connected

**Week 2**: Content creation
- [ ] Chapter 1 & 2 written (6,300 words)
- [ ] Embedding pipeline built
- [ ] Embeddings uploaded to Qdrant

**Week 3**: Integration
- [ ] RAG service operational
- [ ] Chat widget functional
- [ ] MVP deployed to GitHub Pages

---

### Phase 2: Complete & Polish (Weeks 4-5)
**Goal**: All chapters + refined UI

**Week 4**: Complete content
- [ ] Chapters 3-6 written (13,000 words)
- [ ] All embeddings updated
- [ ] UI/UX polished

**Week 5**: Optional features
- [ ] Authentication setup (better-auth)
- [ ] Claude Subagents ready
- [ ] Documentation complete

---

### Phase 3: Production Launch (Week 6)
**Goal**: Production deployment + monitoring

**Week 6**: Launch
- [ ] Backend deployed to Railway/Render
- [ ] Frontend live on GitHub Pages
- [ ] Health checks passing
- [ ] Monitoring enabled

---

## 💰 Bonus Points Breakdown

| Feature | Points | Effort | Status |
|---------|--------|--------|--------|
| Base (MVP) | 100 | 3 weeks | Required |
| Claude Subagents (4 agents) | 50 | 1 week | Optional |
| Authentication (better-auth) | 50 | 3 days | Optional |
| Content Personalization | 50 | 3 days | Optional |
| Urdu Translation | 50 | 3 days | Optional |
| **TOTAL** | **300** | **6 weeks** | |

---

## 📚 Module Structure

```
6 Chapters, 13 Weeks of Curriculum

Module 1: Introduction to Physical AI (Weeks 1-2)
├── Foundations of Physical AI
├── Embodied Intelligence
├── Humanoid Robotics Landscape
└── Sensor Systems
   ~3,800 words

Module 2: ROS 2 Fundamentals (Weeks 3-5)
├── Architecture
├── Nodes, Topics, Services
├── Python Packages
└── Launch Files
   ~3,000 words

Module 3: Gazebo Simulation (Weeks 6-7)
├── Setup
├── URDF/SDF Formats
├── Physics & Sensors
└── Unity Visualization
   ~3,500 words

Module 4: NVIDIA Isaac (Weeks 8-10)
├── Isaac SDK
├── Perception Pipeline
├── RL for Control
└── Sim-to-Real
   ~3,500 words

Module 5: Vision-Language-Action (Weeks 11-12)
├── VLA Convergence
├── Whisper Voice Commands
├── NLP Planning
└── Multimodal Interaction
   ~3,000 words

Module 6: Capstone Project (Week 13)
├── Integration
├── Autonomous Pipeline
└── Guidelines
   ~2,500 words

TOTAL: ~19,300 words + diagrams, code, math
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Docusaurus 3.x (Static site generator)
- **Components**: React 18.2 + TypeScript
- **Math**: remark-math + rehype-katex (LaTeX)
- **Deployment**: GitHub Pages (automatic)

### Backend
- **Framework**: FastAPI (Python)
- **Database**: Neon PostgreSQL (free tier)
- **Vector DB**: Qdrant Cloud (free tier)
- **LLM**: OpenAI GPT / Anthropic Claude
- **Deployment**: Railway or Render (free tier)

### AI/ML
- **Embeddings**: OpenAI text-embedding or HuggingFace
- **RAG**: Semantic search in Qdrant
- **LLM Integration**: OpenAI API / Anthropic API
- **Subagents**: Claude Code for content transformation

---

## 📋 Critical Path Tasks

### Must Complete (for 100 points)
1. ✅ GitHub repo setup with CI/CD
2. ✅ Docusaurus initialized and configured
3. ✅ FastAPI backend skeleton
4. ✅ Qdrant and Neon connected
5. ✅ Chapter 1 & 2 written
6. ✅ Embedding pipeline implemented
7. ✅ RAG retrieval service built
8. ✅ LLM integration with prompting
9. ✅ Chat endpoint implemented
10. ✅ React ChatWidget built
11. ✅ Text selection feature
12. ✅ Integration tested
13. ✅ MVP deployed to GitHub Pages

**Estimated Effort**: 3 weeks (full team)

### Optional (for 50+ bonus points each)
- [ ] Claude Subagents (4 agents) → 50 points
- [ ] Authentication with better-auth → 50 points
- [ ] Content personalization → 50 points
- [ ] Urdu translation → 50 points

---

## 🔧 Development Setup Commands

### Frontend Setup
```bash
cd frontend
npm install
npm run build
npm run serve  # Test locally
npm run deploy  # Deploys to GitHub Pages automatically
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.template .env  # Edit with credentials
python -m uvicorn app.main:app --reload
```

### Data Pipeline
```bash
# Extract chapters
python scripts/extract_chapters.py

# Generate embeddings
python scripts/upload_embeddings.py

# Health check
python scripts/health_check.py
```

---

## 🔑 Essential Environment Variables

```bash
# Frontend
REACT_APP_API_URL=http://localhost:8000

# Backend
DATABASE_URL=postgresql://...
QDRANT_URL=https://...
QDRANT_API_KEY=...
OPENAI_API_KEY=sk-...
CLAUDE_API_KEY=sk-ant-...
ENVIRONMENT=development
```

---

## 📊 Project Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Chapters | 6 | 📋 Planned |
| Content | 19,300 words | 📋 Planned |
| API Endpoints | 7 | ✅ Designed |
| Components | 8 | ✅ Designed |
| Tasks | 53 | ✅ Listed |
| Pre-launch Checks | 115+ | ✅ Documented |
| Chat Response Time | < 3 seconds | ✅ Target |
| Page Load Time | < 2 seconds | ✅ Target |
| Lighthouse Score | > 90 | ✅ Target |
| Uptime | > 99% | ✅ Target |

---

## ✅ Pre-Launch Checklist (Summary)

### Frontend (25 items)
- [ ] Builds successfully
- [ ] Build time < 60s
- [ ] Lighthouse > 90
- [ ] Mobile responsive
- [ ] No console errors
- [ ] All chapters display
- [ ] Chat widget functional
- [ ] HTTPS working
- And 17 more...

### Backend (30 items)
- [ ] Docker builds
- [ ] All endpoints respond
- [ ] Health check passes
- [ ] DB connected
- [ ] Qdrant connected
- [ ] Rate limiting works
- [ ] Error handling robust
- [ ] Logging configured
- And 22 more...

### Integration (15 items)
- [ ] Frontend-backend connected
- [ ] Chat works end-to-end
- [ ] Citations accurate
- [ ] 10+ test queries pass
- [ ] Text selection works
- And 10 more...

**Full Checklist**: See `history/prompts/constitution/8-textbook-deploy.deploy.prompt.md`

---

## 🎓 Learning Path

### New to the Project?
1. Read `SPECIFICATION_SUMMARY.md` (30 min)
2. Skim `history/prompts/constitution/4-textbook-plan.plan.prompt.md` (15 min)
3. Review `history/prompts/constitution/5-textbook-design.design.prompt.md` (30 min)
4. Check `history/prompts/constitution/7-textbook-implement.implement.prompt.md` (your role-specific section) (60 min)

### Getting Started with Code?
1. Clone repo
2. Follow Day 1 commands in `7-textbook-implement.implement.prompt.md`
3. Run setup scripts
4. Check that all services connect
5. Start with your assigned tasks

---

## 🚨 Common Issues & Solutions

### Build Issues
**Issue**: Docusaurus build fails  
**Solution**: Check Node version (18+), npm install, clear cache

**Issue**: FastAPI won't start  
**Solution**: Check Python version (3.11+), pip install -r requirements.txt, verify .env

### Connection Issues
**Issue**: Can't connect to Qdrant  
**Solution**: Check API key in .env, verify Qdrant Cloud is initialized

**Issue**: Chat endpoint times out  
**Solution**: Check OpenAI API key, verify network, check rate limits

### Deployment Issues
**Issue**: GitHub Pages deployment fails  
**Solution**: Check branch is `main`, verify GitHub Actions secrets

**Issue**: Backend deployment fails  
**Solution**: Check Railway token, verify Dockerfile, check environment variables

---

## 📞 Support Resources

### Documentation
- [Docusaurus Docs](https://docusaurus.io)
- [FastAPI Tutorial](https://fastapi.tiangolo.com)
- [Qdrant Docs](https://qdrant.tech/documentation)
- [Neon Docs](https://neon.tech/docs)

### Community
- GitHub Issues (this repo)
- Discussions tab
- README for FAQs

### Team Contact
- Frontend Lead: [name]
- Backend Lead: [name]
- DevOps Lead: [name]
- PM: [name]

---

## 🎯 Next Steps

1. **Assign team members** to tasks
2. **Create GitHub issues** from tasks.md
3. **Setup GitHub Project board** for tracking
4. **Begin Phase 1 Week 1 setup**
5. **Hold daily standups** (15 min)
6. **Weekly retrospectives** (30 min)

---

## 📈 Success Indicators (Week 1-3)

### Week 1 ✅
- [ ] Repo setup complete
- [ ] All team members can run locally
- [ ] CI/CD pipeline working
- [ ] Services (Qdrant, Neon) connected

### Week 2 ✅
- [ ] Chapters 1-2 written and visible
- [ ] Embeddings generated and uploaded
- [ ] 50+ vectors in Qdrant

### Week 3 ✅
- [ ] Chat endpoint responding
- [ ] Chat widget in browser
- [ ] 10 test queries successful
- [ ] MVP deployed to GitHub Pages

---

**Project Status**: ✅ COMPLETE SPECIFICATION READY  
**Ready to Execute**: YES  
**Documentation Quality**: COMPREHENSIVE  
**Code Examples**: INCLUDED  
**Deployment Playbook**: READY  

🚀 **Ready to begin Phase 1 implementation!**

---

For detailed information on any topic, refer to the specific prompt file in `history/prompts/constitution/`
