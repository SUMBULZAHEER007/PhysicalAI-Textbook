# 🤖 CHATBOT & GITHUB SETUP - COMPLETE GUIDE

## Part 1️⃣: RAG CHATBOT - HAI YA FULLY DESIGNED!

### ✅ What We Built

A complete **RAG (Retrieval-Augmented Generation) Chatbot** with:
- Semantic search in Qdrant (vector database)
- LLM responses from OpenAI/Claude
- Citation tracking
- React chat widget

---

## 🏗️ Chatbot Architecture

```
User Types Question
    ↓
React ChatWidget Component
    ↓
Send to FastAPI Backend (/api/chat)
    ↓
Convert Question to Embedding (OpenAI)
    ↓
Search Qdrant for Similar Chunks (Top 5)
    ↓
Build Context from Found Chunks
    ↓
Send to LLM with Context + System Prompt
    ↓
LLM Generates Response with Citations
    ↓
Return to Frontend
    ↓
User Sees Answer + Links to Source
```

---

## 💾 DATABASE FLOW

### Qdrant Collection Setup

```
Collection: "chapters"
├── Vector Size: 1536 (OpenAI embedding size)
├── Distance Metric: Cosine similarity
├── Payload:
│   ├── chapter_id: "01-foundations"
│   ├── chunk_id: "chunk_001"
│   ├── text: "Physical AI is..."
│   └── file: "docs/01-foundations/index.mdx"
```

### Example Data

```json
{
  "id": 1,
  "vector": [0.123, -0.456, 0.789, ...],
  "payload": {
    "chapter_id": "01-foundations",
    "chunk_id": "chunk_001",
    "text": "Physical AI is artificial intelligence applied to systems that operate in the physical world...",
    "file": "docs/01-foundations/index.mdx"
  }
}
```

---

## 📝 IMPLEMENTATION STEPS

### Step 1: Extract Chapters into Chunks

**File:** `backend/scripts/extract_chapters.py`

```python
import os
import json
from typing import List

def extract_chapters():
    """Extract MDX chapters into chunks"""
    
    chunks = []
    chapters_dir = "frontend/docs"
    
    for chapter_file in os.listdir(chapters_dir):
        if chapter_file.endswith('.mdx'):
            with open(f"{chapters_dir}/{chapter_file}", 'r') as f:
                content = f.read()
            
            # Extract chapter ID from filename
            chapter_id = chapter_file.replace('.mdx', '')
            
            # Split into chunks (500 tokens per chunk, 50 token overlap)
            chunk_size = 2000  # ~500 tokens in characters
            overlap = 200
            
            for i in range(0, len(content), chunk_size - overlap):
                chunk_text = content[i:i + chunk_size]
                
                chunks.append({
                    'chapter_id': chapter_id,
                    'chunk_id': f"{chapter_id}_chunk_{i//chunk_size}",
                    'text': chunk_text,
                    'file': chapter_file
                })
    
    # Save chunks
    with open('backend/data/chapters_chunks.json', 'w') as f:
        json.dump(chunks, f, indent=2)
    
    print(f"✅ Extracted {len(chunks)} chunks from {len(set([c['chapter_id'] for c in chunks]))} chapters")

if __name__ == "__main__":
    extract_chapters()
```

**Run:**
```bash
cd backend
python scripts/extract_chapters.py
```

---

### Step 2: Generate Embeddings

**File:** `backend/app/services/embedding_service.py`

```python
import openai
import os
from typing import List

class EmbeddingService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.model = "text-embedding-3-small"  # Cheap & fast
    
    async def embed(self, text: str) -> List[float]:
        """Generate embedding for single text"""
        response = openai.Embedding.create(
            input=text,
            model=self.model,
            api_key=self.api_key
        )
        return response['data'][0]['embedding']
    
    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for batch (cheaper!)"""
        response = openai.Embedding.create(
            input=texts,
            model=self.model,
            api_key=self.api_key
        )
        return [item['embedding'] for item in response['data']]
```

**Usage:**
```python
from app.services.embedding_service import EmbeddingService

service = EmbeddingService()

# Single embedding
embedding = await service.embed("What is Physical AI?")

# Batch embeddings (faster & cheaper)
texts = ["Physical AI...", "Humanoid robots..."]
embeddings = await service.embed_batch(texts)
```

---

### Step 3: Upload to Qdrant

**File:** `backend/scripts/upload_embeddings.py`

```python
import json
import asyncio
import os
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
from app.services.embedding_service import EmbeddingService

async def upload_embeddings():
    """Upload chapter embeddings to Qdrant"""
    
    # Load chunks
    with open('backend/data/chapters_chunks.json', 'r') as f:
        chunks = json.load(f)
    
    print(f"📊 Loaded {len(chunks)} chunks")
    
    # Initialize services
    embedding_service = EmbeddingService()
    qdrant_client = QdrantClient(
        url=os.getenv("QDRANT_URL"),
        api_key=os.getenv("QDRANT_API_KEY")
    )
    
    # Create collection if not exists
    try:
        qdrant_client.create_collection(
            collection_name="chapters",
            vectors_config=VectorParams(
                size=1536,  # OpenAI embedding size
                distance=Distance.COSINE
            )
        )
        print("✅ Collection 'chapters' created")
    except:
        print("⚠️  Collection 'chapters' already exists")
    
    # Generate embeddings in batches
    batch_size = 10
    embeddings = []
    
    for i in range(0, len(chunks), batch_size):
        batch_chunks = chunks[i:i+batch_size]
        batch_texts = [c['text'] for c in batch_chunks]
        
        print(f"⏳ Generating embeddings for batch {i//batch_size + 1}...")
        batch_embeddings = await embedding_service.embed_batch(batch_texts)
        embeddings.extend(batch_embeddings)
    
    print(f"✅ Generated {len(embeddings)} embeddings")
    
    # Create points
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
    
    # Upload to Qdrant
    print(f"🔄 Uploading {len(points)} points to Qdrant...")
    qdrant_client.upsert(
        collection_name="chapters",
        points=points
    )
    
    print(f"✅ Successfully uploaded all embeddings!")
    print(f"📈 Qdrant collection 'chapters' now has {len(points)} vectors")

if __name__ == "__main__":
    asyncio.run(upload_embeddings())
```

**Run:**
```bash
cd backend
python scripts/upload_embeddings.py
```

---

### Step 4: RAG Service

**File:** `backend/app/services/rag_service.py`

```python
from typing import List, Dict
from qdrant_client import QdrantClient
from app.services.embedding_service import EmbeddingService
import openai
import os

class RAGService:
    def __init__(self):
        self.qdrant = QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY")
        )
        self.embedding_service = EmbeddingService()
        self.openai_key = os.getenv("OPENAI_API_KEY")
    
    async def retrieve_context(self, query: str, top_k: int = 5) -> List[Dict]:
        """
        Retrieve relevant chunks from textbook
        """
        # Generate query embedding
        query_embedding = await self.embedding_service.embed(query)
        
        # Search Qdrant
        results = self.qdrant.search(
            collection_name="chapters",
            query_vector=query_embedding,
            limit=top_k,
            score_threshold=0.7
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
    
    async def generate_response(
        self, 
        query: str, 
        context: List[Dict],
        user_level: str = "beginner"
    ) -> Dict:
        """
        Generate response using LLM + context
        """
        
        # Build context string
        context_text = "\n\n".join([
            f"[{c['chapter']}]\n{c['text']}"
            for c in context
        ])
        
        # Create system prompt
        level_guidance = {
            "beginner": "Use simple language, include more examples",
            "intermediate": "Balance theory and practice",
            "advanced": "Include technical details and edge cases"
        }
        
        system_prompt = f"""You are an expert AI tutor for Physical AI and Humanoid Robotics.
        
User Level: {user_level}
{level_guidance.get(user_level, '')}

Answer questions ONLY using the provided textbook context.
If the answer is not in the context, say "This topic is not covered in the textbook."
Include citations showing which chapter the information came from.
Keep responses concise (2-3 paragraphs)."""
        
        user_prompt = f"""Context from textbook:
{context_text}

Question: {query}

Answer with proper citations:"""
        
        # Call OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=500,
            api_key=self.openai_key
        )
        
        return {
            'response': response['choices'][0]['message']['content'],
            'citations': [
                {'chapter': c['chapter'], 'chunk_id': c['chunk_id']}
                for c in context
            ],
            'confidence': sum([c['score'] for c in context]) / len(context)
        }
```

---

### Step 5: FastAPI Chat Endpoint

**File:** `backend/app/api/chat.py`

```python
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.services.rag_service import RAGService

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: str
    message: str
    selected_text: str = None
    conversation_id: str = None

class ChatResponse(BaseModel):
    response: str
    citations: list
    confidence: float
    timestamp: str

@router.post("/api/chat")
async def chat(request: ChatRequest):
    """
    Main chat endpoint
    """
    
    rag_service = RAGService()
    
    # Retrieve context
    context = await rag_service.retrieve_context(
        query=request.message,
        top_k=5
    )
    
    # Generate response
    result = await rag_service.generate_response(
        query=request.message,
        context=context,
        user_level="beginner"  # Get from user profile in real app
    )
    
    return ChatResponse(
        response=result['response'],
        citations=result['citations'],
        confidence=result['confidence'],
        timestamp=datetime.now().isoformat()
    )
```

---

### Step 6: React ChatWidget

**File:** `frontend/src/components/ChatWidget.tsx`

```typescript
import React, { useState, useRef, useEffect } from 'react';
import './ChatWidget.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{ chapter: string; chunk_id: string }>;
  timestamp?: string;
}

export const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Hi! I\'m your AI tutor. Ask me anything about Physical AI and Humanoid Robotics!',
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Detect selected text in textbook
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()?.toString() || '';
      setSelectedText(selection);
    };
    
    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: localStorage.getItem('user_id') || 'anonymous',
          message: input,
          selected_text: selectedText || null,
          conversation_id: 'default'
        })
      });

      if (!response.ok) throw new Error('Chat failed');

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        citations: data.citations,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setSelectedText(''); // Clear selected text after send
      
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget-container" ref={containerRef}>
      {/* Chat Button */}
      <button 
        className={`chat-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? 'Close chat' : 'Open chat'}
      >
        💬
        <span className="badge">AI</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div>
              <h3>🤖 AI Tutor</h3>
              <p>Ask about Physical AI & Robotics</p>
            </div>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>
                
                <div className="message-content">
                  <div className="text">{msg.content}</div>
                  
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="citations">
                      <strong>📚 Source:</strong>
                      {msg.citations.map((cite, idx) => (
                        <a 
                          key={idx} 
                          href={`#${cite.chunk_id}`}
                          className="citation-link"
                        >
                          {cite.chapter}
                        </a>
                      ))}
                    </div>
                  )}
                  
                  {msg.timestamp && (
                    <div className="timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="message assistant">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="chat-input-form">
            {selectedText && (
              <div className="selected-text-hint">
                📌 Selected: "{selectedText.substring(0, 50)}..."
              </div>
            )}
            
            <div className="input-wrapper">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={loading}
                className="input-field"
              />
              
              <button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="send-button"
              >
                {loading ? '⏳' : '➤'}
              </button>
            </div>
            
            <div className="input-hint">
              💡 Tip: Select text in the chapter, then ask about it!
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
```

**Styles:** `frontend/src/components/ChatWidget.css`

```css
.chat-widget-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
}

.chat-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.chat-toggle .badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.chat-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 400px;
  height: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 18px;
}

.chat-header p {
  margin: 4px 0 0 0;
  font-size: 12px;
  opacity: 0.9;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f8f9fa;
}

.message {
  display: flex;
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  justify-content: flex-end;
}

.message-avatar {
  font-size: 24px;
  margin-right: 8px;
}

.message.user .message-avatar {
  margin-right: 0;
  margin-left: 8px;
  order: 2;
}

.message-content {
  max-width: 70%;
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message.user .message-content {
  background: #667eea;
  color: white;
}

.message-content .text {
  line-height: 1.5;
  font-size: 14px;
}

.citations {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #eee;
  font-size: 12px;
  color: #666;
}

.message.user .citations {
  color: rgba(255, 255, 255, 0.8);
  border-top-color: rgba(255, 255, 255, 0.2);
}

.citation-link {
  display: inline-block;
  margin-right: 8px;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.message.user .citation-link {
  color: #fff;
}

.timestamp {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #667eea;
  animation: bounce 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.chat-input-form {
  padding: 12px;
  border-top: 1px solid #eee;
  background: white;
}

.selected-text-hint {
  font-size: 12px;
  color: #ff6b6b;
  margin-bottom: 8px;
  padding: 8px;
  background: #ffe0e0;
  border-radius: 6px;
}

.input-wrapper {
  display: flex;
  gap: 8px;
}

.input-field {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.input-field:focus {
  border-color: #667eea;
}

.input-field:disabled {
  background: #f5f5f5;
  color: #999;
}

.send-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
}

.send-button:hover:not(:disabled) {
  background: #5568d3;
  transform: scale(1.05);
}

.send-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.input-hint {
  font-size: 11px;
  color: #999;
  margin-top: 6px;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .chat-window {
    width: calc(100vw - 40px);
    height: calc(100vh - 120px);
    bottom: 80px;
  }
}
```

---

---

## Part 2️⃣: GITHUB SETUP - KAHA TA SETUP KARNA HAI

### ✅ GitHub Repository Setup (Day 1-2)

**File Reference:** `7-textbook-implement.implement.prompt.md` Lines 1-150

---

## 🔧 GITHUB SETUP STEPS

### Step 1: Create Repository

```bash
# Create local repo
git init PhysicalAI-Textbook
cd PhysicalAI-Textbook

# Create directory structure
mkdir -p docs backend src tests scripts
mkdir -p .github/workflows
mkdir -p .specify/memory
mkdir -p frontend

# Initialize git
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Step 2: Create Folder Structure

```
PhysicalAI-Textbook/
├── .github/
│   └── workflows/
│       ├── deploy-frontend.yml    # Frontend deployment
│       ├── deploy-backend.yml     # Backend deployment
│       └── tests.yml              # Tests
├── frontend/                       # Docusaurus
│   ├── docs/                       # Chapters
│   ├── docusaurus.config.js
│   ├── sidebars.js
│   └── package.json
├── backend/                        # FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── chat.py
│   │   │   ├── query.py
│   │   │   └── health.py
│   │   ├── services/
│   │   │   ├── rag_service.py
│   │   │   └── embedding_service.py
│   │   └── agents/
│   ├── requirements.txt
│   ├── .env.template
│   └── Dockerfile
├── scripts/
│   ├── extract_chapters.py
│   ├── upload_embeddings.py
│   └── setup.sh
├── tests/
│   ├── test_chat_api.py
│   ├── test_rag_service.py
│   └── test_embedding_pipeline.py
├── .gitignore
├── README.md
└── CLAUDE.md
```

### Step 3: Create .gitignore

**File:** `.gitignore`

```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
venv/
ENV/
env/

# Node
node_modules/
package-lock.json
npm-debug.log
build/
dist/

# Environment
.env
.env.local
.env.*.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Data
data/
*.json
*.db

# Qdrant
qdrant_storage/

# Testing
.pytest_cache/
htmlcov/
.coverage
```

### Step 4: Create GitHub Actions Deployment

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy Textbook

on:
  push:
    branches: [main]

jobs:
  # Frontend deployment
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Build Docusaurus
        run: |
          cd frontend
          npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/build
          cname: physicalai-textbook.com  # Optional: custom domain

  # Backend deployment
  deploy-backend:
    runs-on: ubuntu-latest
    needs: deploy-frontend
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-python@v4
        with:
          python-version: 3.11
      
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      
      - name: Run tests
        run: |
          cd backend
          pytest tests/
      
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
          RAILWAY_PROJECT_ID: ${{ secrets.RAILWAY_PROJECT_ID }}
        run: |
          npm install -g railway
          railway deploy --projectId $RAILWAY_PROJECT_ID
```

### Step 5: Create README

**File:** `README.md`

```markdown
# Physical AI & Humanoid Robotics Textbook

AI-native educational platform with integrated RAG chatbot

## Quick Start

### Frontend Setup
```bash
cd frontend
npm install
npm run start  # http://localhost:3000
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env from template
cp .env.template .env
# Edit .env with your API keys

python -m uvicorn app.main:app --reload  # http://localhost:8000/docs
```

## Architecture

- **Frontend**: Docusaurus 3.x + React + MDX
- **Backend**: FastAPI + Qdrant + Neon PostgreSQL
- **AI**: OpenAI Embeddings + Claude/GPT Chat
- **Deploy**: GitHub Pages (frontend) + Railway (backend)

## Environment Variables

```env
DATABASE_URL=postgresql://...
QDRANT_URL=https://...
QDRANT_API_KEY=...
OPENAI_API_KEY=sk-...
CLAUDE_API_KEY=sk-ant-...
```

## Features

✅ AI-native Docusaurus textbook
✅ 6 chapters (19,300+ words)
✅ RAG chatbot with semantic search
✅ Select-text → Ask AI feature
✅ Free-tier optimized
✅ Mobile responsive

## Team

- Content: Chapters & examples
- Frontend: Docusaurus setup
- Backend: FastAPI + RAG service
- DevOps: CI/CD & deployment

## Timeline

Week 1: Infrastructure + Foundation
Week 2: Content + Embeddings
Week 3: Integration + MVP Launch
Week 4-5: Polish + Bonus Features
Week 6: Production Launch

## Bonus Features (200 points)

- ✅ Better-auth authentication (50 pts)
- ✅ Content personalization (50 pts)
- ✅ Urdu translation (50 pts)
- ✅ Claude Code Subagents (50 pts)

## License

MIT
```

### Step 6: Commit Initial Code

```bash
# Add files
git add .

# Commit
git commit -m "Initial commit: Project setup and structure"

# Create GitHub repository
# 1. Go to https://github.com/new
# 2. Create repository "PhysicalAI-Textbook"
# 3. Follow instructions to push

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/PhysicalAI-Textbook.git
git branch -M main
git push -u origin main
```

### Step 7: Setup Secrets in GitHub

In GitHub repository settings:

1. Go to **Settings** → **Secrets and variables** → **Actions**

2. Add these secrets:
   - `OPENAI_API_KEY` = Your OpenAI key
   - `CLAUDE_API_KEY` = Your Claude key
   - `QDRANT_API_KEY` = Your Qdrant API key
   - `QDRANT_URL` = Your Qdrant URL
   - `RAILWAY_TOKEN` = Your Railway token
   - `RAILWAY_PROJECT_ID` = Your Railway project ID

### Step 8: Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Set source to **GitHub Actions**
3. Domain will be `https://username.github.io/PhysicalAI-Textbook/`

---

## 📊 NEXT STEPS AFTER GITHUB SETUP

After your GitHub repository is created:

```bash
# Week 1 - Days 3-5
# 1. Initialize Docusaurus
npm create docusaurus@latest frontend classic

# 2. Install extensions
cd frontend
npm install remark-math rehype-katex

# 3. Initialize FastAPI
cd ../backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy

# 4. Create basic structure
touch app/main.py
touch app/api/chat.py
touch app/services/rag_service.py

# 5. Push to GitHub
cd ..
git add .
git commit -m "Week 1: Docusaurus and FastAPI initialization"
git push
```

---

## ✨ WHAT HAPPENS NEXT

**Automatic GitHub Actions:**
1. ✅ Every push to `main` triggers tests
2. ✅ Frontend builds and deploys to GitHub Pages
3. ✅ Backend builds Docker image and deploys to Railway
4. ✅ Health checks verify everything is running

**Result:**
- 🌐 Your textbook live at `https://username.github.io/PhysicalAI-Textbook/`
- 🔗 Backend API running on Railway
- 📊 Chat widget fully functional
- 🚀 Automatic deployments on every push

---

## 🎯 CHECKLIST

GitHub Setup:
- [ ] Repository created on GitHub
- [ ] Local repo initialized and pushed
- [ ] .gitignore added
- [ ] README created
- [ ] Secrets added in GitHub settings
- [ ] GitHub Pages enabled
- [ ] GitHub Actions workflows created
- [ ] First commit pushed successfully

Ready to build! 🚀
