"""
Vector Database Module for RAG Implementation
Handles vector storage, ingestion, and retrieval using local ChromaDB
"""

from .ingest_data import ingest_to_local_collection
from .vector_service import retrieve_from_index_list

__all__ = [
    "ingest_to_local_collection", 
    "retrieve_from_index_list"
]