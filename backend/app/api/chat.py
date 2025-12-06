from fastapi import APIRouter
from pydantic import BaseModel
import time

router = APIRouter()


class ChatRequest(BaseModel):
    user_id: str
    message: str
    selected_text: str = None
    conversation_id: str = None


class ChatResponse(BaseModel):
    response: str
    citations: list = []
    confidence: float = 0.8
    timestamp: str = None


@router.post("/api/chat")
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Simple chat endpoint stub.
    Returns a canned response for testing the frontend ChatWidget.
    """
    
    # Canned responses based on keywords
    canned_responses = {
        "physical ai": "Physical AI is artificial intelligence applied to systems that operate in the physical world. It combines digital intelligence with embodied systems like robots.",
        "humanoid": "Humanoid robots are robots designed to resemble human form and movement. They're optimized for human environments and can use tools designed for humans.",
        "sensor": "Robots use multiple sensors: vision (RGB/depth cameras), LiDAR for distance measurement, IMUs for orientation, and tactile sensors for touch feedback.",
        "default": "That's a great question about Physical AI and Humanoid Robotics! Our textbook covers this topic in detail. Feel free to explore the chapters."
    }
    
    # Find a matching response
    user_message = request.message.lower()
    response_text = canned_responses["default"]
    
    for keyword, canned_response in canned_responses.items():
        if keyword != "default" and keyword in user_message:
            response_text = canned_response
            break
    
    return ChatResponse(
        response=response_text,
        citations=[
            {"chapter": "01-foundations", "chunk_id": "chunk_001"},
            {"chapter": "02-robotics", "chunk_id": "chunk_002"}
        ],
        confidence=0.85,
        timestamp=time.time()
    )
