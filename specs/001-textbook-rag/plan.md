# Implementation Plan: Physical AI & Humanoid Robotics — Essentials Textbook with RAG Chatbot

**Branch**: `001-textbook-rag` | **Date**: 2025-12-06 | **Spec**: [specs/001-textbook-rag/spec.md](specs/001-textbook-rag/spec.md)
**Input**: Feature specification from `/specs/001-textbook-rag/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan outlines the implementation roadmap for building the AI-native textbook with an integrated RAG chatbot for "Physical AI & Humanoid Robotics — Essentials". The frontend will be a Docusaurus application hosted on GitHub Pages, while the RAG chatbot backend (FastAPI, Qdrant, Neon) will be deployed using serverless functions to maintain free-tier compatibility. The chatbot will leverage cloud-provider free-tier embedding services for lightweight embeddings and will synthesize/summarize information exclusively from the textbook. Optional Urdu translation will be prioritized for initial implementation.

## Technical Context

**Language/Version**: Python 3.11+ (for FastAPI), JavaScript/TypeScript (for Docusaurus)
**Primary Dependencies**: Docusaurus, FastAPI, Qdrant, Neon, cloud-provider embedding service (e.g., OpenAI/Cohere free tier)
**Storage**: Neon (PostgreSQL for metadata), Qdrant (vector database)
**Testing**:
- Docusaurus Frontend: Jest, React Testing Library (unit/component), Cypress/Playwright (E2E)
- FastAPI Backend: pytest, FastAPI's TestClient, httpx, pytest-asyncio (unit/integration)
- General Integration: pytest with httpx/requests (Python), Karate DSL (API-centric)
**Target Platform**: Web (Docusaurus on GitHub Pages), Serverless functions (FastAPI/Qdrant backend)
**Project Type**: Hybrid (web application + serverless API)
**Performance Goals**:
- Users can successfully navigate between any two chapters in under 2 seconds.
- The UI/UX for text selection and AI interaction is intuitive, allowing users to complete "select text and ask AI" task in under 5 seconds.
**Constraints**:
- No heavy GPU usage.
- Minimal embeddings.
- Free-tier compatibility for all services.
- RAG chatbot answers ONLY from book text.
**Scale/Scope**: 6 short chapters, initially for a single-language user base (Urdu as prioritized optional feature).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Core Principles Adherence**:
- **Simplicity**: Aligns with using Docusaurus, serverless functions, and free-tier services.
- **Accuracy**: RAG chatbot's responses exclusively from textbook content, with explicit success criteria for accuracy.
- **Minimalism**: Emphasis on lightweight embeddings and free-tier architecture.
- **Fast Builds**: Docusaurus is chosen for its fast build capabilities.
- **Free-Tier Architecture**: Explicitly designing for free-tier compatibility across all components.
- **RAG Answers Only from Book Text**: Functional requirements and success criteria strictly enforce this principle.

**Conclusion**: All core principles of the constitution are upheld by this plan. No violations are currently present.

## Project Structure

### Documentation (this feature)

```text
specs/001-textbook-rag/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/             # FastAPI endpoints for RAG
│   ├── services/        # RAG logic, embedding calls, Qdrant interaction
│   └── models/          # Data models for RAG requests/responses
└── tests/               # Backend tests (unit, integration)

frontend/
├── src/
│   ├── components/      # Docusaurus components (UI, chatbot widget)
│   ├── pages/           # Docusaurus content pages (chapters)
│   ├── services/        # Frontend interaction with RAG backend
│   └── styles/          # Docusaurus styles
└── tests/               # Frontend tests (unit, E2E)
```

**Structure Decision**: The project will adopt a `backend/` and `frontend/` split. The `frontend/` will house the Docusaurus application for the textbook and UI, deployed on GitHub Pages. The `backend/` will contain the FastAPI application for the RAG chatbot, deployed as serverless functions. This structure promotes modularity, clear separation of concerns, and aligns with the hybrid project type.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
