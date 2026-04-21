# backend/vector_db/vector_service.py
import chromadb
from chromadb.utils import embedding_functions

client = chromadb.PersistentClient(path="./vector_db/storage")
default_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

def retrieve_from_index_list(query: str, index_list: list):
    merged_context = []

    for idx_name in index_list:
        try:
            collection = client.get_collection(name=idx_name, embedding_function=default_ef)
            
            # Query the specific local collection
            results = collection.query(
                query_texts=[query],
                n_results=2
            )
            
            # Extract and label context so the Agent knows the source
            for doc_list in results['documents']:
                for doc in doc_list:
                    merged_context.append(f"Source [{idx_name}]: {doc}")
        
        except Exception as e:
            print(f"Index {idx_name} not found locally.")

    return "\n---\n".join(merged_context)