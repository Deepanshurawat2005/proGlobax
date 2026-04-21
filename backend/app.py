import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from datetime import datetime
from dotenv import load_dotenv

from typing import List
from vector_db.ingest_data import ingest_to_local_collection
from vector_db.vector_service import retrieve_from_index_list

# Load environment variables
load_dotenv()

# 🔥 Supabase Database URL (from .env)
DATABASE_URL = os.getenv("DATABASE_URL")

# ✅ Create engine WITHOUT SSL (for local PostgreSQL)
engine = create_engine(
    DATABASE_URL,
    connect_args={"sslmode": "disable"}
)

# DB session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base model
Base = declarative_base()

# -------------------------------
# 📦 DATABASE MODEL
# -------------------------------
class Item(Base):
    """
    Stores the information about company products
    """
    __tablename__ = "proGlobax_Data" 

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create table
Base.metadata.create_all(bind=engine)

# -------------------------------
# 🚀 FASTAPI APP
# -------------------------------
app = FastAPI(title="proglobax-backend")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# 📥 REQUEST MODEL
# -------------------------------
class ItemRequest(BaseModel):
    id: str
    name: str
    description: str

# -------------------------------
# ➕ CREATE ITEM
# -------------------------------
@app.post("/api/v1/items")
async def create_item(item: ItemRequest):
    db: Session = SessionLocal()
    try:
        print(f"📥 Received item: {item}")
        
        # Check if exists
        existing = db.query(Item).filter(Item.id == item.id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Item ID already exists")

        # Create item
        db_item = Item(
            id=item.id,
            name=item.name,
            description=item.description
        )

        db.add(db_item)
        db.commit()
        db.refresh(db_item)

        print(f"✅ Item saved successfully: {item.id}")
        return {
            "status": "success",
            "message": "Item saved to PostgreSQL",
            "id": item.id
        }

    except HTTPException as e:
        print(f"❌ HTTP Error: {e}")
        db.rollback()
        raise
    except Exception as e:
        print(f"❌ Database Error: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    finally:
        db.close()

# -------------------------------
# 📤 GET ALL ITEMS
# -------------------------------
@app.get("/api/v1/items")
async def list_items():
    db: Session = SessionLocal()
    try:
        items = db.query(Item).all()

        return {
            "status": "success",
            "items": [
                {
                    "id": item.id,
                    "name": item.name,
                    "description": item.description,
                    "created_at": item.created_at.isoformat() if item.created_at else None
                }
                for item in items
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()
#------------------------------------------------------------------------------------------
@app.get("/api/v1/compliance_data")
async def get_compliance_data():
    # This is a placeholder for the actual compliance data retrieval logic
    # You can replace this with your actual implementation to fetch data from Supabase or any other source
    compliance_data = {
        "compliance_status": "compliant",
        "last_checked": datetime.utcnow().isoformat()
    }
    return compliance_data


# -------------------------------
# RAG

class IngestRequest(BaseModel):
    text: str
    target_index: str

class AccessRequest(BaseModel):
    query: str
    index_list: List[str]

# --- RAG Endpoints ---

@app.post("/api/v1/ingest_vector_db")
async def ingest_vector_db(request: IngestRequest):
    try:
        # 👉 Clean index name: "Legal Docs" -> "legal_docs"
        safe_index = request.target_index.lower().replace(" ", "_")
        
        count = ingest_to_local_collection(request.text, safe_index)
        return {
            "status": "success", 
            "chunks_created": count, 
            "index": safe_index
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/access_vector_db")
async def access_vector_db(request: AccessRequest):
    try:
        # 👉 Clean the list to match stored names
        safe_list = [idx.lower().replace(" ", "_") for idx in request.index_list]
        
        context = retrieve_from_index_list(request.query, safe_list)
        return {"context": context or "No relevant context found in selected indexes."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=8003, host="localhost")