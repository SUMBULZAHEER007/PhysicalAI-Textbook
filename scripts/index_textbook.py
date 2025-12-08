import os
from qdrant_client import QdrantClient
from qdrant_client.http import models
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

encoder = SentenceTransformer('all-MiniLM-L6-v2') 

# Updated client with correct URL (No :6333) and timeout
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"), 
    api_key=os.getenv("QDRANT_API_KEY"),
    timeout=60
)

COLLECTION_NAME = "textbook"
BOOK_PATH = "./physical-ai-book/docs" 

def index_files():
    print(f"🚀 Indexing started. Scanning path: {os.path.abspath(BOOK_PATH)}")
    
    if qdrant_client.collection_exists(COLLECTION_NAME):
        qdrant_client.delete_collection(COLLECTION_NAME)
    
    qdrant_client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE)
    )

    points = []
    idx = 1

    # Loop with Debugging
    for root, dirs, files in os.walk(BOOK_PATH):
        print(f"🔍 Checking folder: {root}") 
        for file in files:
            if file.endswith(".md"):
                print(f"📄 Found file: {file}") 
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    text = f.read()
                    chunks = [text[i:i+1000] for i in range(0, len(text), 800)]
                    
                    for chunk in chunks:
                        emb = encoder.encode(chunk).tolist()
                        points.append(
                            models.PointStruct(
                                id=idx,
                                vector=emb,
                                payload={"text": chunk, "chapter": file}
                            )
                        )
                        idx += 1

    if points:
        print(f"⬆️  Uploading {len(points)} chunks to Qdrant...")
        qdrant_client.upsert(collection_name=COLLECTION_NAME, points=points)
        print(f"✅ Successfully indexed {idx - 1} chunks locally!")
    else:
        print("⚠️ No markdown files found. Please check your BOOK_PATH.")

if __name__ == "__main__":
    index_files()