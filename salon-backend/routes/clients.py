# routes/clients.py
from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
import database as db
from models.client import Client, ClientCreate

router = APIRouter()

@router.get("/", response_model=List[Client])
async def get_clients(search: Optional[str] = None):
    if search:
        # Buscar por nome ou telefone
        query = """
        SELECT * FROM clients 
        WHERE name LIKE %s OR phone LIKE %s
        """
        params = [f"%{search}%", f"%{search}%"]
        results = db.execute_raw(query, params)
    else:
        results = db.select_all("clients")
    return results or []

@router.get("/{client_id}", response_model=Client)
async def get_client(client_id: int):
    client = db.select_by_id("clients", client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@router.post("/", response_model=Client)
async def create_client(client: ClientCreate):
    client_data = client.dict()
    result = db.insert("clients", client_data)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to create client")
    return result