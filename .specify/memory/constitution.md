<!-- Sync Impact Report
Version change: N/A → 1.0.0
List of modified principles: None
Added sections: None
Removed sections: None
Templates requiring updates:
- .specify/templates/plan-template.md: ✅ updated
- .specify/templates/spec-template.md: ✅ updated
- .specify/templates/tasks-template.md: ✅ updated
- .specify/templates/commands/*.md: ✅ updated
- README.md: ✅ updated
- docs/quickstart.md: ✅ updated
Follow-up TODOs: None
-->
# Physical AI & Humanoid Robotics — Essentials Constitution

## Core Principles

### Simplicity
Prioritize straightforward design and implementation to ensure ease of understanding and maintainability.

### Accuracy
All content, explanations, and chatbot responses must be technically correct and reliable.

### Minimalism
Focus on essential features and content, avoiding unnecessary complexity or bloat.

### Fast Builds
Optimize the build process for quick compilation and deployment, supporting rapid iteration.

### Free-Tier Architecture
Design and implement solutions using services and technologies available within free tiers to minimize cost barriers.

### RAG Answers Only from Book Text
The RAG chatbot must generate responses exclusively from the content of the textbook, ensuring contextual relevance and preventing hallucination.

## Scope and Features

**Scope**:
- 6 short chapters:
  1. Introduction to Physical AI
  2. Basics of Humanoid Robotics
  3. ROS 2 Fundamentals
  4. Digital Twin Simulation (Gazebo + Isaac)
  5. Vision-Language-Action Systems
  6. Capstone: Simple AI-Robot Pipeline
- Clean UI
- Free-tier friendly
- Lightweight embeddings

**Key Features**:
- Docusaurus textbook
- RAG chatbot (Qdrant + Neon + FastAPI)
- Select-text → Ask AI
- Optional Urdu / Personalize features

## Constraints and Success Criteria

**Constraints**:
- No heavy GPU usage
- Minimal embeddings

**Success Criteria**:
- Build success
- Accurate chatbot
- Clean UI
- Smooth GitHub Pages deployment

## Governance
This constitution supersedes all other practices. Amendments require documentation, approval, and a migration plan. All Pull Requests and reviews must verify compliance with these principles. Complexity must always be justified.

**Version**: 1.0.0 | **Ratified**: 2025-12-06 | **Last Amended**: 2025-12-06
