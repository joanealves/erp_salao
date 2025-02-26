# routes/appointments.py
from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from database import supabase
from models.appointment import Appointment, AppointmentCreate, AppointmentUpdate

router = APIRouter()

@router.get("/", response_model=List[Appointment])
async def get_appointments(status: Optional[str] = None, date: Optional[str] = None):
    query = supabase.table("appointments").select("*")
    if status:
        query = query.eq("status", status)
    if date:
        query = query.eq("date", date)
    response = query.execute()
    if response.data is None:
        return []
    return response.data

@router.get("/{appointment_id}", response_model=Appointment)
async def get_appointment(appointment_id: int):
    response = supabase.table("appointments").select("*").eq("id", appointment_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return response.data[0]

@router.post("/", response_model=Appointment)
async def create_appointment(appointment: AppointmentCreate):
    response = supabase.table("appointments").insert(appointment.dict()).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create appointment")
    return response.data[0]

@router.put("/{appointment_id}", response_model=Appointment)
async def update_appointment(appointment_id: int, appointment: AppointmentUpdate):
    update_data = {k: v for k, v in appointment.dict().items() if v is not None}
    response = supabase.table("appointments").update(update_data).eq("id", appointment_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return response.data[0]

@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_appointment(appointment_id: int):
    response = supabase.table("appointments").delete().eq("id", appointment_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return None