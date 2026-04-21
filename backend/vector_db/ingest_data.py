# backend/vector_db/ingest_data.py
import chromadb
from chromadb.utils import embedding_functions

# Use a 100% Free Local Embedding Model (Sentence Transformers)
default_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

# Persistent Client (Saves to your G:\proGlobax folder)
client = chromadb.PersistentClient(path="./vector_db/storage")

def ingest_to_local_collection(text: str, collection_name: str):
    collection = client.get_or_create_collection(
        name=collection_name, 
        embedding_function=default_ef
    )
    
    # Simple chunking logic
    chunks = [text[i:i+800] for i in range(0, len(text), 800)]
    ids = [f"{collection_name}_{i}" for i in range(len(chunks))]
    
    collection.add(
        documents=chunks,
        ids=ids
    )
    return len(chunks)