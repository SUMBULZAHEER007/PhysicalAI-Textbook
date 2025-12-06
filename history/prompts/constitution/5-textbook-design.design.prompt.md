---
id: 5
title: Architecture & Technical Design
stage: design
date: 2025-12-06
surface: agent
model: claude-sonnet-4-5-20250929
feature: textbook-generation
branch: main
user: unknown
command: /sp.design
labels: ["design", "architecture", "technical-specs"]
links:
  spec: 2
  clarify: 3
  plan: 4
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/design.md
tests:
  None
---

## Prompt

Feature: textbook-generation
Scope: Physical AI & Humanoid Robotics Textbook with RAG Chatbot

Objective:
Design a complete technical architecture for an AI-native Docusaurus textbook with integrated RAG chatbot, advanced personalization, authentication, and multilingual support.

---

## Project Overview

**Title**: Physical AI & Humanoid Robotics: AI-Native Textbook with RAG Chatbot

**Target Audience**: Students learning AI, robotics, ROS 2, and embodied intelligence

**Core Modules**:
1. Introduction to Physical AI & Embodied Intelligence
2. The Robotic Nervous System (ROS 2)
3. The Digital Twin (Gazebo & Unity)
4. The AI-Robot Brain (NVIDIA Isaac™)
5. Vision-Language-Action Systems (VLA)
6. Capstone: Autonomous Humanoid with Conversational AI

**Duration**: 13 weeks (structured in course quarter format)

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER (Docusaurus)                         │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  Chapters & Content (MDX)                                            │   │
│  │  - 6 main modules with weekly breakdown                             │   │
│  │  - Code samples, diagrams, embedded videos                          │   │
│  │  - LaTeX math support for robotics formulas                         │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  RAG Chat Widget                                                     │   │
│  │  - Sidebar chat interface with message history                      │   │
│  │  - "Ask AI" button on text selection                               │   │
│  │  - Source citation display (Chapter + Section)                     │   │
│  │  - Context-aware responses                                         │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  Authentication & Personalization                                    │   │
│  │  - better-auth.com integration (GitHub/Google OAuth)               │   │
│  │  - User onboarding: Software & Hardware background questions       │   │
│  │  - Chapter-level content personalization toggle                    │   │
│  │  - Urdu translation toggle button                                  │   │
│  │  - Progress tracking & bookmarks                                   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
        ┌───────────────────────────┴───────────────────────────┐
        ↓                                                         ↓
┌───────────────────────────┐                      ┌──────────────────────────┐
│   BACKEND API LAYER       │                      │  AI/AGENT LAYER          │
│   (FastAPI)               │                      │  (Claude Code Subagents) │
│                           │                      │                          │
│ POST /api/chat            │                      │ - Content Personalization│
│ POST /api/query           │                      │ - Urdu Translation Agent │
│ GET /api/health           │                      │ - RAG Enhancement Agent  │
│ POST /api/auth/login      │                      │ - Code Example Generator │
│ POST /api/user/profile    │                      │ - Interactive Tutorial   │
│ POST /api/personalization │                      │   Generation             │
│                           │                      │                          │
└───────────────────────────┘                      └──────────────────────────┘
        ↓                                                      ↓
        └──────────────────────┬──────────────────────────────┘
                               ↓
        ┌──────────────────────────────────────────┐
        │     DATA & VECTOR DATABASE LAYER         │
        │                                          │
        │ ┌─────────────────────────────────────┐  │
        │ │  Qdrant Cloud (Free Tier)           │  │
        │ │  - Vector embeddings (5k max)       │  │
        │ │  - Semantic search index            │  │
        │ │  - Metadata: chapter, section, URL  │  │
        │ └─────────────────────────────────────┘  │
        │                                          │
        │ ┌─────────────────────────────────────┐  │
        │ │  Neon Serverless PostgreSQL         │  │
        │ │  - User profiles & auth data        │  │
        │ │  - Personalization preferences      │  │
        │ │  - Chat history & bookmarks         │  │
        │ │  - Background survey responses      │  │
        │ └─────────────────────────────────────┘  │
        │                                          │
        │ ┌─────────────────────────────────────┐  │
        │ │  LLM API Integration                │  │
        │ │  - OpenAI GPT-4 (primary)           │  │
        │ │  - Claude API (backup/subagents)    │  │
        │ │  - Rate limiting & caching          │  │
        │ └─────────────────────────────────────┘  │
        │                                          │
        └──────────────────────────────────────────┘
```

---

## Frontend Architecture (Docusaurus + React)

### 1. Directory Structure

```
/docs
  ├── /01-introduction-to-physical-ai
  │   ├── index.mdx
  │   ├── 01-foundations.mdx
  │   ├── 02-embodied-intelligence.mdx
  │   ├── 03-humanoid-landscape.mdx
  │   └── 04-sensors.mdx
  ├── /02-ros2-fundamentals
  │   ├── index.mdx
  │   ├── 01-architecture.mdx
  │   ├── 02-nodes-topics-services.mdx
  │   ├── 03-python-packages.mdx
  │   └── 04-launch-files.mdx
  ├── /03-gazebo-simulation
  │   ├── index.mdx
  │   ├── 01-setup.mdx
  │   ├── 02-urdf-sdf.mdx
  │   ├── 03-physics-sensors.mdx
  │   └── 04-unity-visualization.mdx
  ├── /04-nvidia-isaac
  │   ├── index.mdx
  │   ├── 01-isaac-sdk.mdx
  │   ├── 02-perception-pipeline.mdx
  │   ├── 03-reinforcement-learning.mdx
  │   └── 04-sim-to-real.mdx
  ├── /05-vision-language-action
  │   ├── index.mdx
  │   ├── 01-vla-convergence.mdx
  │   ├── 02-whisper-voice.mdx
  │   ├── 03-nlp-planning.mdx
  │   └── 04-multimodal-interaction.mdx
  └── /06-capstone
      ├── index.mdx
      ├── 01-integration.mdx
      ├── 02-autonomous-pipeline.mdx
      └── 03-project-guidelines.mdx

/src/components
  ├── ChatWidget.tsx          # RAG chat interface
  ├── TextSelection.tsx        # "Ask AI" on selection
  ├── AuthGate.tsx             # better-auth integration
  ├── UserProfileForm.tsx      # Onboarding (background questions)
  ├── PersonalizationToggle.tsx # Content personalization
  ├── LanguageToggle.tsx       # Urdu/English toggle
  ├── ProgressTracker.tsx      # Chapter progress
  ├── BookmarkButton.tsx       # Save & bookmark sections
  └── CitationDisplay.tsx      # Source attribution

/src/pages
  ├── dashboard.tsx            # User dashboard (authenticated)
  ├── profile.tsx              # User profile & settings
  └── progress.tsx             # Learning progress

/src/styles
  ├── chat-widget.css
  ├── personalization.css
  ├── auth-forms.css
  └── theme-overrides.css
```

### 2. Component Architecture

#### ChatWidget Component
```typescript
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  citations?: Array<{
    chapter: string;
    section: string;
    url: string;
    excerpt: string;
  }>;
  timestamp: Date;
}

interface ChatContextProps {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (text: string, context?: string) => Promise<void>;
  clearHistory: () => void;
}
```

#### Personalization System
```typescript
interface UserBackground {
  softwareExperience: "beginner" | "intermediate" | "advanced";
  hardwareExperience: "beginner" | "intermediate" | "advanced";
  roboticsBackground: boolean;
  aiKnowledge: "beginner" | "intermediate" | "advanced";
  preferredLanguage: "english" | "urdu";
}

interface PersonalizationSettings {
  contentLevel: "beginner" | "intermediate" | "advanced";
  showCode: boolean;
  showMath: boolean;
  showDiagrams: boolean;
  language: "english" | "urdu";
  translationMode: "full" | "partial" | "glossary";
}
```

### 3. Docusaurus Configuration

```javascript
// docusaurus.config.js
module.exports = {
  title: "Physical AI & Humanoid Robotics",
  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        sidebarPath: require.resolve("./sidebars.js"),
        remarkPlugins: [
          [require("remark-math")],
          [require("remark-code-import")],
        ],
        rehypePlugins: [require("rehype-katex")],
      },
    ],
  ],
  themes: [
    [
      "@docusaurus/theme-classic",
      {
        customCss: require.resolve("./src/css/custom.css"),
      },
    ],
  ],
};
```

### 4. Auto-Sidebar Generation

```javascript
// sidebars.js - Auto-generated from chapter structure
module.exports = {
  textbookSidebar: [
    {
      type: "doc",
      id: "introduction",
      label: "Introduction to Physical AI",
      items: [
        "01-introduction-to-physical-ai/01-foundations",
        "01-introduction-to-physical-ai/02-embodied-intelligence",
        // ... auto-generated
      ],
    },
    // ... more modules
  ],
};
```

---

## Backend Architecture (FastAPI + Python)

### 1. Project Structure

```
/backend
├── main.py                    # FastAPI app initialization
├── requirements.txt           # Python dependencies
├── .env.template              # Environment variables template
│
├── /app
│   ├── __init__.py
│   ├── config.py              # Settings & secrets
│   ├── database.py            # Neon PostgreSQL connection
│   ├── qdrant_client.py       # Qdrant vector DB client
│   │
│   ├── /api
│   │   ├── __init__.py
│   │   ├── chat.py            # POST /api/chat endpoint
│   │   ├── query.py           # POST /api/query endpoint
│   │   ├── auth.py            # POST /api/auth/* endpoints
│   │   ├── user.py            # GET/POST /api/user/* endpoints
│   │   ├── personalization.py # Personalization endpoints
│   │   └── health.py          # GET /api/health endpoint
│   │
│   ├── /services
│   │   ├── __init__.py
│   │   ├── rag_service.py     # Retrieval-Augmented Generation logic
│   │   ├── embedding_service.py # Embedding generation
│   │   ├── llm_service.py     # LLM API calls & prompting
│   │   ├── user_service.py    # User management
│   │   └── personalization_service.py # Content personalization
│   │
│   ├── /agents
│   │   ├── __init__.py
│   │   ├── content_personalization_agent.py   # Claude Subagent
│   │   ├── urdu_translation_agent.py          # Claude Subagent
│   │   ├── rag_enhancement_agent.py           # Claude Subagent
│   │   └── code_generator_agent.py            # Claude Subagent
│   │
│   ├── /models
│   │   ├── __init__.py
│   │   ├── user.py            # SQLAlchemy User model
│   │   ├── chat_history.py    # Chat history model
│   │   ├── embedding.py       # Embedding metadata model
│   │   └── personalization.py # Personalization preferences model
│   │
│   └── /utils
│       ├── __init__.py
│       ├── logger.py          # Logging configuration
│       ├── validators.py      # Input validation
│       └── cache.py           # Response caching
│
├── /scripts
│   ├── embed_chapters.py      # Generate & upload embeddings
│   ├── setup_db.py            # Initialize databases
│   ├── seed_data.py           # Load initial data
│   └── health_check.py        # System health check
│
└── /tests
    ├── test_chat_api.py
    ├── test_rag_service.py
    ├── test_embedding_pipeline.py
    └── test_personalization.py
```

### 2. Core API Endpoints

#### Chat Endpoint
```python
@router.post("/api/chat")
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Main RAG chatbot endpoint.
    
    Request:
    {
        "user_id": "uuid",
        "message": "How do I set up ROS 2?",
        "selected_text": "ROS 2 architecture", (optional)
        "conversation_id": "uuid" (optional)
    }
    
    Response:
    {
        "response": "ROS 2 is...",
        "citations": [
            {
                "chapter": "02-ros2-fundamentals",
                "section": "01-architecture",
                "excerpt": "...",
                "url": "/docs/02-ros2/01-architecture#architecture-overview"
            }
        ],
        "confidence": 0.95,
        "timestamp": "2025-12-06T10:30:00Z"
    }
    """
    pass
```

#### Query Endpoint (Semantic Search)
```python
@router.post("/api/query")
async def semantic_search(request: QueryRequest) -> QueryResponse:
    """
    Semantic search in embedded chapters.
    
    Request:
    {
        "query": "LIDAR sensor",
        "top_k": 5,
        "threshold": 0.7
    }
    
    Response:
    {
        "results": [
            {
                "chunk_id": "ch1-s4-chunk3",
                "text": "LIDAR emits light beams...",
                "chapter": "01-introduction-to-physical-ai",
                "section": "04-sensors",
                "similarity": 0.92
            }
        ]
    }
    """
    pass
```

#### Authentication Endpoints
```python
@router.post("/api/auth/signup")
async def signup(request: SignupRequest) -> AuthResponse:
    """
    Sign up with better-auth.com
    Collect background info survey.
    """
    pass

@router.post("/api/auth/signin")
async def signin(request: SigninRequest) -> AuthResponse:
    """
    Sign in with OAuth (GitHub, Google, etc.)
    """
    pass
```

#### Personalization Endpoints
```python
@router.get("/api/user/profile")
async def get_profile(user_id: str) -> UserProfileResponse:
    """Get user profile & background info."""
    pass

@router.post("/api/user/personalization")
async def set_personalization(
    user_id: str, 
    settings: PersonalizationSettings
) -> PersonalizationResponse:
    """Set content level, language, preferences."""
    pass

@router.post("/api/user/translate")
async def translate_chapter(
    user_id: str,
    chapter_id: str,
    target_language: str
) -> TranslationResponse:
    """Translate chapter to Urdu via Claude Subagent."""
    pass
```

### 3. Service Layer: RAG Service

```python
class RAGService:
    def __init__(self, qdrant_client, llm_client, db_session):
        self.vector_db = qdrant_client
        self.llm = llm_client
        self.db = db_session

    async def retrieve_context(self, query: str, top_k: int = 5) -> List[Document]:
        """
        1. Embed user query
        2. Search Qdrant for similar chunks
        3. Return top-k with metadata
        """
        # Generate embedding for query
        query_embedding = await self.embedding_service.embed(query)
        
        # Search Qdrant
        search_results = await self.vector_db.search(
            collection_name="chapters",
            query_vector=query_embedding,
            limit=top_k,
            threshold=0.7
        )
        
        return self._format_results(search_results)

    async def generate_response(
        self, 
        query: str, 
        context: List[Document],
        user_id: str,
        user_background: UserBackground
    ) -> ChatResponse:
        """
        1. Build prompt with context
        2. Apply personalization if user logged in
        3. Call LLM
        4. Format response with citations
        """
        # Retrieve user personalization settings
        personalization = await self.personalization_service.get(user_id)
        
        # Build system prompt with personalization
        system_prompt = self._build_system_prompt(
            user_background=user_background,
            personalization=personalization
        )
        
        # Build context blocks
        context_text = self._format_context(context)
        
        # Create prompt
        user_prompt = f"""
        User Query: {query}
        
        Context from textbook:
        {context_text}
        
        Answer the question using ONLY the context provided.
        If not found in context, say "This topic is not covered in the textbook."
        Include citations in your response.
        """
        
        # Call LLM
        response = await self.llm.create_message(
            system=system_prompt,
            user=user_prompt
        )
        
        # Extract citations from response
        citations = self._extract_citations(response, context)
        
        return ChatResponse(
            response=response,
            citations=citations,
            confidence=0.95
        )

    def _build_system_prompt(self, user_background, personalization):
        """
        Personalize system prompt based on user background.
        Example: If beginner, avoid advanced terminology.
        """
        if user_background.softwareExperience == "beginner":
            return """
            You are a patient, beginner-friendly AI tutor.
            Explain concepts simply, avoid jargon.
            Provide analogies and real-world examples.
            Answer ONLY from the provided textbook content.
            """
        else:
            return """
            You are an expert AI tutor.
            Provide technically accurate, detailed answers.
            Discuss advanced concepts and edge cases.
            Answer ONLY from the provided textbook content.
            """
```

### 4. Claude Code Subagents

#### Personalization Agent
```python
class ContentPersonalizationAgent:
    """
    Claude Subagent that personalizes chapter content based on user background.
    
    Input:
    - User background (software, hardware, AI knowledge level)
    - Chapter content
    - Personalization preferences
    
    Output:
    - Personalized chapter (adjusted complexity, examples, focus areas)
    """
    
    async def personalize_chapter(
        self,
        chapter_content: str,
        user_background: UserBackground,
        settings: PersonalizationSettings
    ) -> str:
        """
        Use Claude to rewrite chapter for user's level.
        Examples:
        - Beginner: Add more explanations, analogies
        - Advanced: Add technical depth, papers, advanced topics
        """
        pass
```

#### Urdu Translation Agent
```python
class UrduTranslationAgent:
    """
    Claude Subagent that translates chapter content to Urdu.
    Handles technical terminology, maintains code blocks, formulas.
    
    Input:
    - English chapter content
    - Context (robotics domain)
    
    Output:
    - Urdu translation with proper technical terms
    """
    
    async def translate_to_urdu(
        self,
        chapter_content: str,
        chapter_title: str
    ) -> str:
        """
        Translate chapter while preserving:
        - Code blocks (unchanged)
        - Mathematical formulas (unchanged)
        - Technical terminology (proper Urdu equivalents)
        """
        pass
```

#### RAG Enhancement Agent
```python
class RAGEnhancementAgent:
    """
    Claude Subagent that improves RAG responses.
    Detects when a response is incomplete or lacks examples.
    
    Input:
    - User query
    - RAG response
    - Context chunks
    
    Output:
    - Enhanced response with better structure, examples, analogies
    """
    
    async def enhance_response(
        self,
        query: str,
        response: str,
        context_chunks: List[str]
    ) -> str:
        """
        Improve response quality and completeness.
        """
        pass
```

#### Code Example Generator Agent
```python
class CodeGeneratorAgent:
    """
    Claude Subagent that generates contextual code examples.
    Creates runnable, commented code snippets for tutorials.
    
    Input:
    - Topic/concept
    - Programming language
    - User level
    
    Output:
    - Well-commented, runnable code examples
    """
    
    async def generate_example(
        self,
        concept: str,
        language: str,
        user_level: str
    ) -> str:
        """
        Generate practical code examples.
        """
        pass
```

---

## Data & Vector Database Layer

### 1. Qdrant Configuration

```yaml
# qdrant-cloud-config.yaml
collection_name: "chapters"
vector_size: 1536  # OpenAI embeddings (or 384 for HuggingFace)
distance: cosine

chunk_metadata:
  - chapter_id: string
  - chapter_title: string
  - section_id: string
  - section_title: string
  - chunk_index: integer
  - text: string
  - url: string
  - created_at: timestamp

indexing:
  - vector size: 1536
  - max_vectors: 5000 (free tier limit)
  - estimated chapters per vector: 50-100 chunks/chapter
  - coverage: 50-100 chapters possible
```

### 2. Neon PostgreSQL Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    oauth_provider VARCHAR(50), -- github, google
    oauth_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User backgrounds
CREATE TABLE user_backgrounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    software_experience VARCHAR(50), -- beginner, intermediate, advanced
    hardware_experience VARCHAR(50),
    robotics_background BOOLEAN,
    ai_knowledge VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personalization settings
CREATE TABLE personalization_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_level VARCHAR(50), -- beginner, intermediate, advanced
    show_code BOOLEAN DEFAULT true,
    show_math BOOLEAN DEFAULT true,
    show_diagrams BOOLEAN DEFAULT true,
    preferred_language VARCHAR(20), -- english, urdu
    translation_mode VARCHAR(50), -- full, partial, glossary
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat history
CREATE TABLE chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    conversation_id UUID,
    role VARCHAR(20), -- user, assistant
    content TEXT NOT NULL,
    citations JSONB, -- Array of citation objects
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookmarks
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    chapter_id VARCHAR(100),
    section_id VARCHAR(100),
    url VARCHAR(500),
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chapter progress
CREATE TABLE chapter_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    chapter_id VARCHAR(100),
    completed BOOLEAN DEFAULT false,
    progress_percent INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    last_visited TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cache for translations
CREATE TABLE translation_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id VARCHAR(100),
    source_language VARCHAR(20),
    target_language VARCHAR(20),
    translated_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);
```

### 3. Embedding Pipeline

```python
class EmbeddingPipeline:
    """
    Pipeline to:
    1. Extract text from MDX chapters
    2. Split into semantic chunks
    3. Generate embeddings
    4. Upload to Qdrant
    """
    
    async def process_chapters(self, chapters_dir: str):
        """
        1. Read all .mdx files from /docs
        2. Parse frontmatter and content
        3. Split into chunks (512 tokens, 50 token overlap)
        4. Generate embeddings via OpenAI/HuggingFace
        5. Upload to Qdrant with metadata
        """
        
        for chapter_file in glob(f"{chapters_dir}/**/*.mdx"):
            # Parse chapter
            metadata, content = self._parse_mdx(chapter_file)
            
            # Split into chunks
            chunks = self._chunk_text(content, chunk_size=512, overlap=50)
            
            # Generate embeddings
            embeddings = await self.embedding_service.embed_batch(chunks)
            
            # Upload to Qdrant
            for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                await self.qdrant_client.upsert(
                    collection_name="chapters",
                    points=[
                        Point(
                            id=f"{metadata['chapter_id']}-{i}",
                            vector=embedding,
                            payload={
                                "chapter_id": metadata["chapter_id"],
                                "chapter_title": metadata["title"],
                                "section_id": metadata.get("section_id"),
                                "chunk_index": i,
                                "text": chunk,
                                "url": metadata["url"]
                            }
                        )
                    ]
                )
```

---

## Authentication & Better-Auth Integration

### 1. Better-Auth Configuration

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth";
import { onboardingPlugin } from "@better-auth/plugins";

export const auth = betterAuth({
  database: {
    provider: "neon",
    url: process.env.DATABASE_URL,
  },
  
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  plugins: [
    onboardingPlugin({
      fields: [
        {
          name: "softwareExperience",
          type: "select",
          required: true,
          options: ["beginner", "intermediate", "advanced"],
          label: "Your software development experience",
        },
        {
          name: "hardwareExperience",
          type: "select",
          required: true,
          options: ["beginner", "intermediate", "advanced"],
          label: "Your hardware/electronics experience",
        },
        {
          name: "roboticsBackground",
          type: "checkbox",
          required: false,
          label: "Do you have robotics experience?",
        },
        {
          name: "aiKnowledge",
          type: "select",
          required: true,
          options: ["beginner", "intermediate", "advanced"],
          label: "Your AI/ML knowledge level",
        },
        {
          name: "preferredLanguage",
          type: "select",
          required: true,
          options: ["english", "urdu"],
          label: "Preferred language",
        },
      ],
    }),
  ],
});
```

### 2. Signup Flow

```typescript
// components/SignupForm.tsx
export const SignupForm = () => {
  const handleGitHubSignup = async () => {
    const { data, error } = await auth.signUp.social({
      provider: "github",
      callbackURL: "/onboarding",
    });
    
    if (data) {
      // User redirected to onboarding form
      // Background questions collected
      // Preferences saved to Neon
    }
  };

  return (
    <div>
      <button onClick={handleGitHubSignup}>
        Sign up with GitHub
      </button>
      <button onClick={handleGoogleSignup}>
        Sign up with Google
      </button>
    </div>
  );
};
```

---

## Content Personalization System

### 1. Personalization Workflow

```
User Signs Up
    ↓
Background Questions (Software, Hardware, AI Knowledge)
    ↓
User Preferences Stored in Neon
    ↓
User Reads Chapter
    ↓
Personalization Toggle Button Pressed
    ↓
Claude Personalization Agent Activated
    ↓
Content Rewritten for User Level
    ↓
Personalized Content Displayed
```

### 2. Example Personalization

**Chapter: "ROS 2 Fundamentals"**

**For Beginner (Software = Beginner)**
```
Simplified explanation with:
- Basic analogies (ROS 2 like a "messaging system")
- Step-by-step setup instructions
- Reduced technical jargon
- Visual diagrams instead of formulas
- Simple Python code examples
```

**For Advanced (Software = Advanced)**
```
Technical deep-dive with:
- Architecture details
- Performance considerations
- Advanced design patterns
- Links to academic papers
- Performance benchmarks
- Advanced debugging techniques
```

---

## Deployment Architecture

### 1. GitHub Pages Frontend Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy Docusaurus

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

### 2. Backend Deployment (Render/Railway)

```yaml
# render.yaml
services:
  - type: web
    name: textbook-rag-api
    env: python
    plan: free
    
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port 8000
    
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: postgres
          property: connectionString
      - key: QDRANT_API_KEY
        sync: false
      - key: OPENAI_API_KEY
        sync: false

databases:
  - name: postgres
    engine: postgresql
    version: 14
    plan: free
    initializer:
      source:
        type: url
        url: file://./scripts/init-db.sql
```

---

## Security & Rate Limiting

### 1. API Security

```python
# app/middleware/security.py
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

# Rate limits
@router.post("/api/chat")
@limiter.limit("10/minute")  # 10 requests per minute per IP
async def chat(request: ChatRequest):
    pass

@router.post("/api/query")
@limiter.limit("20/minute")
async def query(request: QueryRequest):
    pass
```

### 2. CORS Configuration

```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://yourdomain.com",
        "https://username.github.io"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Performance Optimization

### 1. Caching Strategy

```python
# app/utils/cache.py
from functools import lru_cache
import redis

redis_client = redis.Redis(host='localhost', port=6379)

async def cache_chat_response(query: str, user_level: str):
    """
    Cache common questions across users.
    """
    cache_key = f"chat:{hashlib.md5(query.encode()).hexdigest()}:{user_level}"
    
    # Check cache
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # Generate response
    response = await generate_response(query, user_level)
    
    # Cache for 24 hours
    redis_client.setex(cache_key, 86400, json.dumps(response))
    
    return response
```

### 2. Lazy Loading & Code Splitting

```typescript
// src/components/ChatWidget.tsx
const ChatWidget = lazy(() => import('./ChatWidget'));

export const App = () => {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatWidget />
    </Suspense>
  );
};
```

---

## Success Criteria & Metrics

### Core Functionality (100 points)
- ✅ All 6 chapters published in Docusaurus
- ✅ RAG chatbot answers questions with citations
- ✅ Text selection → Ask AI feature working
- ✅ Chat response time < 3 seconds
- ✅ Page load time < 2 seconds
- ✅ Sidebar auto-generates from chapters
- ✅ Deployment to GitHub Pages successful

### Bonus: Claude Code Subagents (up to 50 points)
- ✅ Content Personalization Agent functional
- ✅ Urdu Translation Agent working
- ✅ RAG Enhancement Agent improves responses
- ✅ Code Example Generator creates examples

### Bonus: Authentication & Signup (up to 50 points)
- ✅ better-auth.com integration complete
- ✅ Background survey collected at signup
- ✅ User preferences stored in Neon

### Bonus: Content Personalization (up to 50 points)
- ✅ Chapter personalization toggle functional
- ✅ Content adjusts based on user level
- ✅ Personalized content delivered in < 5 seconds

### Bonus: Urdu Translation (up to 50 points)
- ✅ Translation toggle button in UI
- ✅ Chapters translated to Urdu
- ✅ Technical terminology preserved
- ✅ Code blocks unchanged

---

## Environment Variables (.env)

```bash
# Frontend (GitHub Pages)
REACT_APP_API_URL=https://your-backend-url.com

# Backend
DATABASE_URL=postgresql://user:password@neon.tech/db
QDRANT_URL=https://your-qdrant-cloud.io
QDRANT_API_KEY=xxxxx
OPENAI_API_KEY=sk-xxxxx
CLAUDE_API_KEY=sk-ant-xxxxx

# Better-Auth
GITHUB_CLIENT_ID=xxxxx
GITHUB_CLIENT_SECRET=xxxxx
GOOGLE_CLIENT_ID=xxxxx
GOOGLE_CLIENT_SECRET=xxxxx

# Rate Limiting
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=INFO
```

---

## Dependencies

### Frontend (Node.js)
```json
{
  "dependencies": {
    "docusaurus": "^3.0.0",
    "@docusaurus/plugin-content-docs": "^3.0.0",
    "react": "^18.2.0",
    "remark-math": "^6.0.0",
    "rehype-katex": "^6.0.0",
    "better-auth": "^0.0.1"
  }
}
```

### Backend (Python)
```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
qdrant-client==2.7.0
openai==1.3.0
anthropic==0.7.0
pydantic==2.5.0
python-dotenv==1.0.0
redis==5.0.1
slowapi==0.1.9
```

---

## Implementation Phases & Timeline

| Phase | Duration | Focus | Deliverables |
|-------|----------|-------|--------------|
| 1: MVP | Weeks 1-3 | Core textbook + basic RAG | Docusaurus deployed, chat working |
| 2: Polish | Weeks 4-5 | All chapters, personalization, translation | Full feature set complete |
| 3: Deployment | Week 6 | Production launch | Live on GitHub Pages + backend |

---

## Next Steps

1. Review and approve architecture
2. Create technical design documents (ADRs)
3. Set up GitHub repository with base structure
4. Begin Phase 1 implementation
5. Execute embedding pipeline
6. Develop frontend components
7. Implement RAG service
8. Deploy MVP

---

## Output

Generate complete technical design document at `.specify/memory/design.md` with:
- Detailed component diagrams
- API specifications (OpenAPI)
- Database schema with indexes
- Claude Subagent prompts
- Deployment playbooks
- Troubleshooting guides
- Performance benchmarks
- Security checklist

## Response snapshot

Technical design document created at `.specify/memory/design.md` with full architecture details.

## Outcome

- ✅ Impact: Complete technical blueprint for implementation.
- 🧪 Tests: N/A
- 📁 Files: 1 file created.
- 🔁 Next prompts: Run `/sp.execute` to begin implementation.
- 🧠 Reflection: Comprehensive architecture enables parallel development and clear execution path.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A

```