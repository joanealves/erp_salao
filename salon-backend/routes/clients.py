# routes/clients.py
from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from database import supabase
from models.client import Client, ClientCreate

router = APIRouter()

@router.get("/", response_model=List[Client])
async def get_clients(search: Optional[str] = None):
    query = supabase.table("clients").select("*")
    if search:
        query = query.ilike("name", f"%{search}%")
    response = query.execute()
    if response.data is None:
        return []
    return response.data

@router.post("/", response_model=Client)
async def create_client(client: ClientCreate):
    response = supabase.table("clients").insert(client.dict()).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create client")
    return response.data[0]