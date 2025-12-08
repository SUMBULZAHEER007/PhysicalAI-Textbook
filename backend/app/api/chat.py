from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import time
import os
from groq import Groq
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

encoder = SentenceTransformer('all-MiniLM-L6-v2')
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"), 
    api_key=os.getenv("QDRANT_API_KEY"),
    timeout=60
)

class ChatRequest(BaseModel):
    user_id: str
    message: str
    selected_text: str = None
    conversation_id: str = None

class ChatResponse(BaseModel):
    response: str
    citations: list = []
    confidence: float = 0.9
    timestamp: float

@router.post("/api/chat")
async def chat(request: ChatRequest) -> ChatResponse:
    try:
        user_message = request.message
        selected_text = request.selected_text

        # Step 1: Local Embedding
        query_vector = encoder.encode(user_message).tolist()

        # Step 2: Vector Search
        search_results = qdrant_client.query_points(
            collection_name="textbook",
            query=query_vector,
            limit=3
        ).points

        retrieved_context = "\n".join([str(res.payload.get("text", "")) for res in search_results])

        # Step 3: Prompt Engineering (English enforcement added)
        if selected_text:
            system_prompt = (
                "You are a helpful AI assistant. Answer the user's question ONLY in English "
                "based on the provided selected text."
            )
            context_text = f"Selected text from user:\n{selected_text}"
        else:
            # "ALWAYS respond in English" instruction add ki gayi hai
            system_prompt = (
                "You are a Physical AI expert. Answer using the provided textbook context. "
                "CRITICAL: Regardless of the language of the user's question, ALWAYS respond only in English."
            )
            context_text = f"Textbook Context:\n{retrieved_context}"

        # Step 4: Response Generation
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"{context_text}\n\nUser Question: {user_message}"}
            ]
        )

        final_response = completion.choices[0].message.content

        citations = [{"chapter": res.payload.get("chapter"), "page": res.payload.get("page")} for res in search_results]

        return ChatResponse(
            response=final_response,
            citations=citations,
            confidence=0.9,
            timestamp=time.time()
        )

    except Exception as e:
        print(f"Error in Groq chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))