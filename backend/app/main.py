from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Relative imports ko absolute banayein agar error aaye
from api import health, chat 

def create_app() -> FastAPI:
    app = FastAPI(title="PhysicalAI Textbook API")

    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"], # Testing ke liye sab allow karein
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers (Prefix optional hai, lekin organizing ke liye acha hai)
    app.include_router(health.router)
    app.include_router(chat.router)

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    # Make sure app path is correct
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
