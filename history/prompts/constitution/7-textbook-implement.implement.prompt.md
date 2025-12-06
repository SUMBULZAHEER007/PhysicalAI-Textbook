---
id: 7
title: Implementation Execution & Development
stage: implement
date: 2025-12-06
surface: agent
model: claude-sonnet-4-5-20250929
feature: textbook-generation
branch: main
user: unknown
command: /sp.implement
labels: ["implementation", "execution", "development"]
links:
  spec: 2
  clarify: 3
  plan: 4
  design: 5
  tasks: 6
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/implementation.md
  - backend/
  - src/
  - docs/
tests:
  - tests/test_chat_api.py
  - tests/test_rag_service.py
  - tests/test_embedding_pipeline.py
---

## Prompt

Feature: textbook-generation
Stage: implement

Objective:
Execute Phase 1 implementation of the Physical AI textbook with RAG chatbot. Begin with infrastructure setup, create initial chapters, and launch MVP.

---

## Implementation Strategy

### Phase 1: MVP Development (Weeks 1-3)

**Execution Approach**:
1. **Parallel Workstreams**:
   - **Frontend Team**: Docusaurus setup + sidebar configuration
   - **Backend Team**: FastAPI + Qdrant + Neon setup
   - **Content Team**: Write chapters 1-2
   - **DevOps**: CI/CD pipeline, GitHub Pages deployment

2. **Integration Points**:
   - Week 1 end: Docusaurus builds + backend API running
   - Week 2 end: Embeddings uploaded to Qdrant + RAG retrieval working
   - Week 3 end: Chat widget functional + MVP deployed

3. **Daily Standup**: 15 min sync on blockers and progress

---

## Week 1: Foundation Setup

### Day 1-2: Repository & Infrastructure Setup

#### Task 1.1.1: GitHub Repository Setup
```bash
# Create repository structure
git init PhysicalAI-Textbook
cd PhysicalAI-Textbook

# Create directory structure
mkdir -p docs backend src tests scripts
mkdir -p .github/workflows
mkdir -p .specify/memory

# Initialize frontend
npm create docusaurus@latest frontend classic
cd frontend
npm install remark-math rehype-katex
npm install @docusaurus/plugin-content-docs

# Initialize backend
cd ../backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary
pip install qdrant-client openai anthropic python-dotenv

# Create initial files
touch .env.template
touch requirements.txt
```

#### Task 1.1.2: Create GitHub Actions Deployment Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy Textbook

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Build Docusaurus
        run: |
          cd frontend
          npm ci
          npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/build
```

#### Task 1.1.3: Environment Setup
```bash
# .env.template
DATABASE_URL=postgresql://user:password@region.neon.tech/dbname
QDRANT_URL=https://your-qdrant-cloud-url
QDRANT_API_KEY=your-qdrant-api-key
OPENAI_API_KEY=sk-your-openai-key
CLAUDE_API_KEY=sk-ant-your-claude-key
ENVIRONMENT=development
REDIS_URL=redis://localhost:6379
```

### Day 3: Frontend - Docusaurus Configuration

#### Task 1.2.1: Configure Docusaurus
```javascript
// docusaurus.config.js
module.exports = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'AI-Native Textbook with RAG Chatbot',
  url: 'https://username.github.io',
  baseUrl: '/PhysicalAI-Textbook/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  
  organizationName: 'your-github-username',
  projectName: 'PhysicalAI-Textbook',
  
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/your-username/PhysicalAI-Textbook/tree/main/',
          remarkPlugins: [
            [require('remark-math')],
          ],
          rehypePlugins: [
            [require('rehype-katex')],
          ],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  
  themeConfig: {
    navbar: {
      title: 'Physical AI',
      logo: {
        alt: 'Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Textbook',
        },
        {
          href: 'https://github.com/your-username/PhysicalAI-Textbook',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © 2025 Physical AI Textbook. Built with Docusaurus.`,
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  },
};
```

#### Task 1.2.2: Create Sidebar Configuration
```javascript
// sidebars.js
module.exports = {
  textbookSidebar: [
    {
      type: 'category',
      label: '📚 Introduction to Physical AI',
      items: [
        'intro',
        '01-intro/01-foundations',
        '01-intro/02-embodied',
        '01-intro/03-landscape',
        '01-intro/04-sensors',
      ],
    },
    {
      type: 'category',
      label: '🤖 Humanoid Robotics Basics',
      items: [
        '02-robotics/01-anatomy',
        '02-robotics/02-actuators',
        '02-robotics/03-sensors-integration',
        '02-robotics/04-control',
      ],
    },
    {
      type: 'category',
      label: '🔧 ROS 2 Fundamentals',
      items: [
        '03-ros2/01-architecture',
        '03-ros2/02-nodes-topics',
        '03-ros2/03-packages',
        '03-ros2/04-launch',
      ],
    },
    {
      type: 'category',
      label: '🎮 Digital Twin Simulation',
      items: [
        '04-gazebo/01-setup',
        '04-gazebo/02-urdf',
        '04-gazebo/03-physics',
        '04-gazebo/04-unity',
      ],
    },
    {
      type: 'category',
      label: '🧠 NVIDIA Isaac Platform',
      items: [
        '05-isaac/01-sdk',
        '05-isaac/02-perception',
        '05-isaac/03-learning',
        '05-isaac/04-sim-to-real',
      ],
    },
    {
      type: 'category',
      label: '🎯 Vision-Language-Action',
      items: [
        '06-vla/01-convergence',
        '06-vla/02-whisper',
        '06-vla/03-planning',
        '06-vla/04-multimodal',
      ],
    },
    {
      type: 'category',
      label: '🏆 Capstone Project',
      items: [
        '07-capstone/01-integration',
        '07-capstone/02-autonomous',
        '07-capstone/03-guidelines',
      ],
    },
  ],
};
```

### Day 4-5: Backend - FastAPI Setup

#### Task 1.3.1: Initialize FastAPI Application
```python
# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Import routers
from app.api import chat, query, health, auth, user, personalization

# Lifespan context
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting textbook RAG API...")
    yield
    # Shutdown
    print("👋 Shutting down...")

# Create FastAPI app
app = FastAPI(
    title="Physical AI Textbook RAG API",
    description="RAG-powered chatbot for Physical AI textbook",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8000",
        "https://username.github.io"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(query.router, prefix="/api", tags=["Search"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(user.router, prefix="/api", tags=["User"])
app.include_router(personalization.router, prefix="/api", tags=["Personalization"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

#### Task 1.3.2: Create API Route Stubs
```python
# backend/app/api/health.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "version": "1.0.0",
        "service": "Physical AI Textbook RAG"
    }

# backend/app/api/query.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class QueryRequest(BaseModel):
    query: str
    top_k: int = 5

@router.post("/query")
async def semantic_search(request: QueryRequest):
    """Semantic search in embedded chapters"""
    # TODO: Implement Qdrant search
    return {"results": []}

# backend/app/api/chat.py
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: str
    message: str
    selected_text: Optional[str] = None
    conversation_id: Optional[str] = None

class Citation(BaseModel):
    chapter: str
    section: str
    excerpt: str
    url: str

class ChatResponse(BaseModel):
    response: str
    citations: List[Citation]
    confidence: float

@router.post("/chat")
async def chat(request: ChatRequest) -> ChatResponse:
    """Main RAG chatbot endpoint"""
    # TODO: Implement RAG chat
    return ChatResponse(
        response="Coming soon...",
        citations=[],
        confidence=0.0
    )

# backend/app/api/auth.py
from fastapi import APIRouter

router = APIRouter()

@router.post("/auth/signup")
async def signup(email: str, oauth_provider: str):
    """Sign up user"""
    # TODO: Implement better-auth integration
    return {"user_id": "stub"}

@router.post("/auth/signin")
async def signin(email: str, password: str):
    """Sign in user"""
    # TODO: Implement better-auth integration
    return {"token": "stub"}

# backend/app/api/user.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/user/profile")
async def get_profile(user_id: str):
    """Get user profile"""
    # TODO: Implement
    return {"user_id": user_id}

@router.post("/user/profile")
async def update_profile(user_id: str, profile_data: dict):
    """Update user profile"""
    # TODO: Implement
    return {"status": "updated"}

# backend/app/api/personalization.py
from fastapi import APIRouter

router = APIRouter()

@router.post("/user/personalization")
async def set_personalization(user_id: str, settings: dict):
    """Set personalization settings"""
    # TODO: Implement
    return {"status": "saved"}
```

### Day 5-6: Database Setup

#### Task 1.4.1: Neon Database Configuration
```sql
-- Initialize Neon Database
-- Run these SQL statements in Neon Console

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_backgrounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    software_experience VARCHAR(50),
    hardware_experience VARCHAR(50),
    robotics_background BOOLEAN,
    ai_knowledge VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    conversation_id UUID,
    role VARCHAR(20),
    content TEXT NOT NULL,
    citations JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_chat_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_conversation ON chat_history(conversation_id);
```

#### Task 1.4.2: Qdrant Setup
```python
# backend/app/qdrant_client.py
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams
import os

# Initialize Qdrant client
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

# Create collection for chapters
try:
    qdrant_client.create_collection(
        collection_name="chapters",
        vectors_config=VectorParams(
            size=1536,  # OpenAI embeddings
            distance=Distance.COSINE
        )
    )
    print("✅ Qdrant collection 'chapters' created")
except Exception as e:
    print(f"⚠️ Collection might already exist: {e}")

def get_qdrant_client():
    return qdrant_client
```

---

## Week 2: Content & Embeddings

### Day 1-2: Write Chapter 1

#### Task 2.1.1: Chapter 1 - Introduction to Physical AI
```markdown
# docs/01-intro/index.mdx

---
title: Introduction to Physical AI
description: Foundations of embodied intelligence and humanoid robotics
keywords: physical ai, embodied intelligence, robotics
---

## Module 1: Introduction to Physical AI (Weeks 1-2)

### Overview
Physical AI represents the convergence of artificial intelligence with the physical world.
Unlike traditional AI confined to digital spaces, Physical AI systems must understand and
navigate physical laws, making real-time decisions in dynamic environments.

### Learning Objectives
- Understand Physical AI principles
- Learn embodied intelligence concepts
- Explore humanoid robotics applications
- Master sensor systems and perception

---

## Section 1: Foundations of Physical AI

### What is Physical AI?

Physical AI is artificial intelligence applied to systems that operate in and perceive
the physical world. This includes robots, autonomous vehicles, and other embodied systems.

**Key Characteristics**:
- **Embodiment**: The system has a body that interacts with the environment
- **Perception**: Sensors gather real-time environmental data
- **Action**: Actuators perform physical movements
- **Learning**: The system learns from real-world interactions

### Historical Context

The evolution from digital AI to Physical AI represents a fundamental shift:

$$
\text{Digital AI} \rightarrow \text{Embodied Intelligence} \rightarrow \text{Physical Autonomy}
$$

### Applications

1. **Humanoid Robots**: Task robots in human-centric environments
2. **Autonomous Vehicles**: Navigation in complex urban environments
3. **Industrial Automation**: Precision manufacturing and assembly
4. **Space Exploration**: Remote operation in extreme environments

---

## Section 2: Embodied Intelligence

### Definition

Embodied Intelligence is the theory that intelligence is deeply rooted in the interaction
between an agent's body and its environment.

### The Importance of a Body

Why does a robot need a body that matches its environment?

**Example**: A humanoid robot designed to work in offices needs:
- Arms with gripping capability
- Legs capable of navigating stairs
- Height approximating human dimensions
- Similar sensor placement (eyes, ears)

### Brain-Body Co-Evolution

The physical form shapes cognitive development:

$$
\text{Morphology} + \text{Environment} + \text{Learning} = \text{Intelligence}
$$

---

## Section 3: Humanoid Robotics Landscape

### Why Humanoids?

Humanoid robots are optimally designed for human environments because:
- They share our physical form
- They can use tools designed for humans
- They communicate through familiar gestures
- They can navigate spaces built for humans

### Current Humanoid Robots

| Robot | Company | Status | Use Cases |
|-------|---------|--------|-----------|
| H1 | Unitree | Commercial | Manufacturing, logistics |
| G1 | Unitree | Development | Research, development |
| Tesla Bot | Tesla | Prototype | Future autonomous workers |
| ARMAR-6 | KIT | Research | Industrial tasks |

---

## Section 4: Sensor Systems

### Overview

Robots perceive the world through multiple sensor types working in coordination.

### Primary Sensors

#### Vision Systems
```python
import cv2
from camera import RGBCamera, DepthCamera

# Initialize dual camera system
rgb_camera = RGBCamera(resolution=(1920, 1080))
depth_camera = DepthCamera(resolution=(848, 480))

# Capture synchronized frames
rgb_frame = rgb_camera.capture()
depth_frame = depth_camera.capture()

# Process for object detection
objects = detect_objects(rgb_frame, depth_frame)
```

#### LiDAR
- Range: 0-20+ meters
- Resolution: 0.1-1.0 degrees
- Use: SLAM, obstacle detection

#### IMU (Inertial Measurement Unit)
- Accelerometer: Linear motion
- Gyroscope: Rotational motion
- Magnetometer: Orientation

### Sensor Fusion

Combining multiple sensors for robust perception:

$$
\text{State} = f(\text{Vision}, \text{LiDAR}, \text{IMU}, \text{Proprioception})
$$

---

## Key Takeaways

✅ Physical AI bridges digital intelligence with physical embodiment  
✅ Humanoid form factors optimize for human environments  
✅ Multiple sensor systems enable rich environmental understanding  
✅ Embodied intelligence emerges from body-environment interaction  

---

## Next Steps

In the next section, we'll explore the foundational concepts of humanoid robot design
and control systems.

[Next Chapter: Humanoid Robotics Basics →](/docs/02-robotics)
```

### Day 3-4: Write Chapter 2

#### Task 2.1.2: Chapter 2 - Humanoid Robotics Basics
```markdown
# docs/02-robotics/index.mdx

---
title: Humanoid Robotics Basics
description: Understanding humanoid robot design, actuators, and control
---

## Module 2: Basics of Humanoid Robotics

### Module Overview

This module covers the mechanical and electrical foundations of humanoid robots,
including design principles, actuation systems, and basic control concepts.

### Learning Objectives
- Understand humanoid robot anatomy
- Learn actuator types and selection
- Master sensor integration
- Grasp basic control principles

---

## Section 1: Robot Anatomy

### Skeletal Structure

A humanoid robot mimics human skeletal proportions:

- **Head**: Sensors, computing
- **Torso**: Main body, computing core
- **Arms**: Manipulation, balance, interaction
- **Legs**: Locomotion, stability

### Degrees of Freedom (DoF)

Each joint provides degrees of freedom:

$$
\text{Total DoF} = \sum_{i=1}^{n} \text{DoF}_i
$$

**Example**: 
- Each arm: 7 DoF (shoulder 3, elbow 1, wrist 3)
- Each leg: 6 DoF (hip 3, knee 1, ankle 2)
- Torso: 2 DoF
- Head: 2 DoF
- **Total**: ~30 DoF

### Workspace

The workspace defines the region a robot can reach:

```python
class Manipulator:
    def __init__(self, dof, link_lengths):
        self.dof = dof
        self.links = link_lengths
    
    def forward_kinematics(self, joint_angles):
        """Calculate end-effector position"""
        position = [0, 0, 0]
        angle = 0
        
        for i, (link, theta) in enumerate(zip(self.links, joint_angles)):
            angle += theta
            position[0] += link * np.cos(angle)
            position[1] += link * np.sin(angle)
        
        return position
```

---

## Section 2: Actuators & Motors

### Motor Types

#### DC Motors
- **Pros**: Simple, cheap, fast
- **Cons**: Limited torque, brushes wear out
- **Use**: Hobby robots

#### Brushless Motors (BLDC)
- **Pros**: Efficient, precise, durable
- **Cons**: More complex control
- **Use**: Professional robots

#### Stepper Motors
- **Pros**: Position control, holding torque
- **Cons**: Limited speed, cogging
- **Use**: Positioning systems

### Servo Motors

Servo motors combine motor + gearbox + control circuit:

```python
from servo import ServoMotor

# Create servo
servo = ServoMotor(port=1, max_torque=20)  # Nm

# Set position
servo.set_position(angle=90)  # degrees
servo.wait_for_completion()

# Read position
current_angle = servo.get_position()
print(f"Current angle: {current_angle}°")
```

### Gearboxes

Gearboxes trade speed for torque:

$$
\text{Output Torque} = \text{Motor Torque} \times \text{Gear Ratio}
$$

---

## Section 3: Sensor Integration

### Proprioception

Proprioceptors measure internal robot state:

- **Joint Encoders**: Joint position
- **IMU**: Orientation, acceleration
- **Force/Torque Sensors**: Joint loads

```python
from sensors import JointEncoder, IMU

# Joint encoder
encoder = JointEncoder(resolution=0.01)  # 0.01 degree resolution
position = encoder.read()

# IMU
imu = IMU()
acceleration = imu.read_acceleration()  # m/s²
orientation = imu.read_orientation()     # quaternion
```

### Exteroception

Exteroceptors sense the external environment:

- **Vision**: RGB, depth cameras
- **LiDAR**: Distance scanning
- **Tactile**: Pressure, touch sensors

---

## Section 4: Control Principles

### Open-Loop vs Closed-Loop

**Open-Loop**: Commands without feedback
```
Command → Actuator → [no feedback]
```

**Closed-Loop**: Commands with feedback
```
Command → Controller → Actuator → Sensor → Controller
```

### PID Control

The most common control loop:

$$
u(t) = K_p e(t) + K_i \int_0^t e(\tau)d\tau + K_d \frac{de(t)}{dt}
$$

```python
class PIDController:
    def __init__(self, kp, ki, kd):
        self.kp = kp
        self.ki = ki
        self.kd = kd
        self.integral = 0
        self.last_error = 0
    
    def update(self, error, dt):
        self.integral += error * dt
        derivative = (error - self.last_error) / dt
        
        output = (self.kp * error + 
                 self.ki * self.integral + 
                 self.kd * derivative)
        
        self.last_error = error
        return output
```

---

## Key Takeaways

✅ Humanoids share human form factor for environmental adaptation  
✅ Servo motors provide precise joint control  
✅ Sensor fusion creates robust state estimation  
✅ Closed-loop control enables stable operation  

---

## Next Steps

[Next Chapter: ROS 2 Fundamentals →](/docs/03-ros2)
```

---

## Week 3: Embedding Pipeline & Chat Widget

### Day 1-2: Embedding Pipeline

#### Task 3.1.1: Extract & Chunk Chapters
```python
# backend/scripts/extract_chapters.py
import os
import json
import re
from pathlib import Path
from typing import List, Dict

class ChapterExtractor:
    def __init__(self, docs_dir: str):
        self.docs_dir = docs_dir
        self.chapters = []
    
    def extract_text(self, mdx_file: str) -> Dict:
        """Extract metadata and content from MDX file"""
        with open(mdx_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract frontmatter
        frontmatter_match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
        frontmatter = {}
        if frontmatter_match:
            fm_text = frontmatter_match.group(1)
            for line in fm_text.split('\n'):
                if ':' in line:
                    key, value = line.split(':', 1)
                    frontmatter[key.strip()] = value.strip()
        
        # Extract body content
        body = re.sub(r'^---\n.*?\n---\n', '', content, flags=re.DOTALL)
        
        return {
            'frontmatter': frontmatter,
            'body': body,
            'file': mdx_file
        }
    
    def chunk_text(self, text: str, chunk_size: int = 512, overlap: int = 50) -> List[str]:
        """Split text into chunks with overlap"""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = ' '.join(words[i:i + chunk_size])
            if chunk.strip():
                chunks.append(chunk)
        
        return chunks
    
    def process_all_chapters(self) -> str:
        """Process all MDX files"""
        all_data = []
        
        for mdx_file in Path(self.docs_dir).rglob('*.mdx'):
            chapter_data = self.extract_text(str(mdx_file))
            chunks = self.chunk_text(chapter_data['body'])
            
            for i, chunk in enumerate(chunks):
                all_data.append({
                    'chapter_id': chapter_data['frontmatter'].get('title', 'unknown'),
                    'chunk_id': f"{chapter_data['frontmatter'].get('title', 'ch')}-{i}",
                    'text': chunk,
                    'file': mdx_file.name
                })
        
        # Save to JSON
        output_file = 'backend/data/chapters_chunks.json'
        os.makedirs('backend/data', exist_ok=True)
        with open(output_file, 'w') as f:
            json.dump(all_data, f, indent=2)
        
        print(f"✅ Extracted {len(all_data)} chunks from chapters")
        return output_file

# Run extraction
if __name__ == "__main__":
    extractor = ChapterExtractor('docs')
    extractor.process_all_chapters()
```

#### Task 3.1.2: Generate Embeddings
```python
# backend/app/services/embedding_service.py
import openai
import os
from typing import List

class EmbeddingService:
    def __init__(self):
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.model = "text-embedding-3-small"  # Free tier friendly
    
    async def embed(self, text: str) -> List[float]:
        """Generate embedding for single text"""
        response = openai.Embedding.create(
            input=text,
            model=self.model
        )
        return response['data'][0]['embedding']
    
    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts"""
        response = openai.Embedding.create(
            input=texts,
            model=self.model
        )
        return [item['embedding'] for item in response['data']]

# backend/scripts/upload_embeddings.py
import json
import asyncio
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct
from app.services.embedding_service import EmbeddingService

async def upload_embeddings():
    """Upload chapter embeddings to Qdrant"""
    
    # Load chunks
    with open('backend/data/chapters_chunks.json', 'r') as f:
        chunks = json.load(f)
    
    # Initialize services
    embedding_service = EmbeddingService()
    qdrant_client = QdrantClient(
        url=os.getenv("QDRANT_URL"),
        api_key=os.getenv("QDRANT_API_KEY")
    )
    
    # Generate embeddings
    texts = [chunk['text'] for chunk in chunks]
    embeddings = await embedding_service.embed_batch(texts)
    
    # Upload to Qdrant
    points = [
        PointStruct(
            id=i,
            vector=embedding,
            payload={
                'chapter_id': chunk['chapter_id'],
                'chunk_id': chunk['chunk_id'],
                'text': chunk['text'],
                'file': chunk['file']
            }
        )
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings))
    ]
    
    qdrant_client.upsert(
        collection_name="chapters",
        points=points
    )
    
    print(f"✅ Uploaded {len(points)} embeddings to Qdrant")

if __name__ == "__main__":
    asyncio.run(upload_embeddings())
```

### Day 3: RAG Service Implementation

#### Task 3.2.1: RAG Service
```python
# backend/app/services/rag_service.py
from typing import List
from qdrant_client import QdrantClient
import openai

class RAGService:
    def __init__(self, qdrant_client: QdrantClient):
        self.qdrant = qdrant_client
        self.embedding_service = EmbeddingService()
    
    async def retrieve_context(self, query: str, top_k: int = 5) -> List[Dict]:
        """Retrieve relevant chunks from Qdrant"""
        
        # Generate query embedding
        query_embedding = await self.embedding_service.embed(query)
        
        # Search Qdrant
        results = self.qdrant.search(
            collection_name="chapters",
            query_vector=query_embedding,
            limit=top_k,
            threshold=0.7
        )
        
        # Format results
        context = []
        for result in results:
            context.append({
                'text': result.payload['text'],
                'chapter': result.payload['chapter_id'],
                'chunk_id': result.payload['chunk_id'],
                'score': result.score
            })
        
        return context
    
    async def generate_response(self, query: str, context: List[Dict]) -> Dict:
        """Generate response using LLM"""
        
        # Build context string
        context_text = "\n\n".join([
            f"[{c['chapter']}]\n{c['text']}"
            for c in context
        ])
        
        # Create prompt
        system_prompt = """You are an expert AI tutor for Physical AI and Humanoid Robotics.
Answer questions ONLY using the provided textbook context.
If the answer is not in the context, say "This topic is not covered in the textbook."
Include citations in your response."""
        
        user_prompt = f"""Context from textbook:
{context_text}

Question: {query}

Answer:"""
        
        # Call OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        return {
            'response': response['choices'][0]['message']['content'],
            'context': context
        }
```

### Day 4-5: Chat Widget Frontend

#### Task 3.3.1: React ChatWidget Component
```typescript
// frontend/src/components/ChatWidget.tsx
import React, { useState, useRef, useEffect } from 'react';
import './ChatWidget.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{
    chapter: string;
    chunk_id: string;
  }>;
}

export const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'anonymous',
          message: input,
          selected_text: null
        })
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        citations: data.citations
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`chat-widget ${isOpen ? 'open' : 'closed'}`}>
      <button 
        className="chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>

      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <h3>AI Tutor</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="message-content">{msg.content}</div>
                {msg.citations && (
                  <div className="citations">
                    {msg.citations.map((cite, cidx) => (
                      <a key={cidx} href={`#${cite.chunk_id}`}>
                        📖 {cite.chapter}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="message assistant">Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a question..."
            />
            <button onClick={handleSendMessage} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
```

```css
/* frontend/src/components/ChatWidget.css */
.chat-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.chat-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
}

.chat-toggle:hover {
  transform: scale(1.1);
}

.chat-container {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 400px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  flex-direction: column;
}

.message.user {
  align-items: flex-end;
}

.message.assistant {
  align-items: flex-start;
}

.message-content {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 8px;
  word-wrap: break-word;
}

.message.user .message-content {
  background: #667eea;
  color: white;
}

.message.assistant .message-content {
  background: #f0f0f0;
  color: #333;
}

.citations {
  margin-top: 8px;
  font-size: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.citations a {
  color: #667eea;
  text-decoration: none;
  border: 1px solid #667eea;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.citations a:hover {
  background: #667eea;
  color: white;
}

.chat-input {
  padding: 12px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
}

.chat-input input {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 10px;
  font-size: 14px;
  outline: none;
}

.chat-input input:focus {
  border-color: #667eea;
}

.chat-input button {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.chat-input button:hover {
  background: #5568d3;
}

.chat-input button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

### Day 6: Integration & MVP Deployment

#### Task 3.4.1: Integrate ChatWidget into Docusaurus
```typescript
// frontend/src/theme/Root.tsx
import React from 'react';
import { ChatWidget } from '../components/ChatWidget';

export default function Root({children}) {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}
```

#### Task 3.4.2: Deploy to GitHub Pages
```bash
# Build and deploy
cd frontend
npm run build
npm run serve  # Test locally first

# Push to main branch
git add .
git commit -m "MVP: Textbook + RAG chatbot"
git push origin main

# GitHub Actions will automatically deploy to GitHub Pages
# Check Actions tab for deployment status
```

---

## MVP Verification Checklist

- [ ] Docusaurus builds successfully (< 60 seconds)
- [ ] 2 chapters written and displayed
- [ ] Sidebar auto-generates correctly
- [ ] FastAPI backend running on localhost:8000
- [ ] Qdrant contains 50+ vectors
- [ ] Neon database connected
- [ ] Chat endpoint responds in < 3 seconds
- [ ] ChatWidget displays and sends messages
- [ ] Citations shown below responses
- [ ] GitHub Pages deployment successful
- [ ] Site accessible at github.io URL
- [ ] All content loads correctly
- [ ] No console errors
- [ ] Mobile responsive verified
- [ ] Manual QA testing passed (10+ queries)

---

## Next Steps for Phase 2

1. Write remaining 4 chapters (Ch 3-6)
2. Re-run embedding pipeline
3. Polish UI/UX based on feedback
4. Setup authentication (better-auth)
5. Implement Claude Subagents

---

## Output

Generate detailed implementation execution guide at `.specify/memory/implementation.md` with:
- Day-by-day task breakdown
- Code snippets for each component
- Configuration templates
- Deployment verification checklist
- Troubleshooting guide
- Performance optimization tips
- Security hardening steps

## Response snapshot

Implementation execution guide created with complete code templates and day-by-day tasks.

## Outcome

- ✅ Impact: Ready for hands-on development execution.
- 🧪 Tests: Manual verification steps included.
- 📁 Files: Frontend, backend, and scripts structure created.
- 🔁 Next prompts: Follow `/sp.test` for QA validation.
- 🧠 Reflection: Detailed implementation guide enables parallel team development with clear tasks.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Start with Day 1 repository setup

```