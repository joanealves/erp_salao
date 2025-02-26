# routes/services.py
from fastapi import APIRouter, HTTPException, status
from typing import List
from database import supabase
from models.service import Service, ServiceCreate, ServiceUpdate

router = APIRouter()

@router.get("/", response_model=List[Service])
async def get_services():
    response = supabase.table("services").select("*").execute()
    if response.data is None:
        return []
    return response.data

@router.post("/", response_model=Service)
async def create_service(service: ServiceCreate):
    response = supabase.table("services").insert(service.dict()).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create service")
    return response.data[0]