from fastapi import APIRouter, HTTPException, status
from typing import List
import database  # ✅ Importamos o módulo inteiro

from models.service import Service, ServiceCreate, ServiceUpdate

router = APIRouter()

@router.get("/", response_model=List[Service])
async def get_services():
    services = database.select_all("services")  # ✅ Agora chamamos usando database.
    return services or []

@router.get("/{service_id}", response_model=Service)
async def get_service(service_id: int):
    service = database.select_by_id("services", service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@router.post("/", response_model=Service)
async def create_service(service: ServiceCreate):
    service_data = service.dict()
    result = database.insert("services", service_data)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to create service")
    return result

@router.put("/{service_id}", response_model=Service)
async def update_service(service_id: int, service: ServiceUpdate):
    existing = database.select_by_id("services", service_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Service not found")

    update_data = {k: v for k, v in service.dict().items() if v is not None}
    result = database.update("services", service_id, update_data)
    return result

@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(service_id: int):
    existing = database.select_by_id("services", service_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Service not found")

    database.delete("services", service_id)
    return None
