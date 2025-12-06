from fastapi import APIRouter

router = APIRouter()


@router.get("/api/health")
async def health_check():
    """Simple health check for the backend."""
    return {
        "status": "ok",
        "db": "unknown",
        "qdrant": "unknown",
        "llm": "unknown",
    }
