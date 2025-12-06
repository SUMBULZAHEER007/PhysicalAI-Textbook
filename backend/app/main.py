from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import health, chat


def create_app() -> FastAPI:
    app = FastAPI(title="PhysicalAI Textbook API")

    # CORS for local development (adjust origins for production)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://localhost:3002", "http://localhost:3001", "http://localhost:3003"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(health.router)
    app.include_router(chat.router)

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
