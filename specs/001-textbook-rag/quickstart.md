# Quickstart: Physical AI & Humanoid Robotics — Essentials Textbook with RAG Chatbot

This guide provides instructions to quickly set up and run the Physical AI & Humanoid Robotics textbook with its integrated RAG chatbot.

## 1. Prerequisites

Ensure you have the following installed:

- **Node.js**: (LTS version recommended for Docusaurus)
- **Python 3.11+**: (for FastAPI backend)
- **npm** or **Yarn**: (package manager for Docusaurus)
- **Git**: (for cloning the repository)
- **Docker**: (Optional, for local Qdrant instance if not using a managed service)

## 2. Setup

### 2.1. Clone the Repository

```bash
git clone [REPOSITORY_URL]
cd PhysicalAITextbook
```

### 2.2. Frontend Setup (Docusaurus)

Navigate to the `frontend/` directory and install dependencies:

```bash
cd frontend
npm install  # or yarn install
```

### 2.3. Backend Setup (FastAPI, Qdrant, Neon)

Navigate to the `backend/` directory and set up a Python virtual environment:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

**Database (Neon/Qdrant)**:

- **Neon (PostgreSQL)**: Obtain connection details for your Neon PostgreSQL database. You will need the database URL.
- **Qdrant (Vector Database)**:
    - **Managed Service**: Obtain API key and URL for your Qdrant managed service.
    - **Local Docker**: For local development, you can run a Qdrant Docker container:
      ```bash
      docker run -p 6333:6333 -p 6334:6334 -d qdrant/qdrant
      ```

Create a `.env` file in the `backend/` directory with your environment variables:

```
DATABASE_URL="[YOUR_NEON_DATABASE_URL]"
QDRANT_URL="[YOUR_QDRANT_URL or http://localhost:6333]"
QDRANT_API_KEY="[YOUR_QDRANT_API_KEY if using managed service]"
EMBEDDING_API_KEY="[YOUR_CLOUD_EMBEDDING_SERVICE_API_KEY]"
EMBEDDING_MODEL_NAME="[YOUR_CLOUD_EMBEDDING_MODEL_NAME]"
```

## 3. Running the Application

### 3.1. Start the Backend (FastAPI)

From the `backend/` directory (with virtual environment activated):

```bash
uvicorn src.api.main:app --reload
```

The backend API will be available at `http://localhost:8000` (default).

### 3.2. Start the Frontend (Docusaurus)

From the `frontend/` directory:

```bash
npm start # or yarn start
```

The Docusaurus textbook will open in your browser, typically at `http://localhost:3000`.

## 4. Interacting with the Chatbot

Once both frontend and backend are running:

1.  **Read Textbook**: Navigate through the Docusaurus site to browse chapters.
2.  **Ask AI**: Use the integrated chatbot widget to ask questions related to the textbook content.
3.  **Select Text & Ask**: Select a portion of text within a chapter, and then use the "Ask AI" feature to get context-specific answers.

## 5. Building for Deployment

### 5.1. Build Frontend

From the `frontend/` directory:

```bash
npm run build # or yarn build
```

This will create a `build/` directory with the static Docusaurus site, ready for GitHub Pages deployment.

### 5.2. Deploy Backend (Serverless)

The FastAPI backend will be deployed as serverless functions. Specific deployment steps will depend on the chosen serverless platform (e.g., AWS Lambda, Google Cloud Functions, Vercel Functions). Refer to the documentation for your chosen provider.
