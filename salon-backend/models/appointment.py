from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AppointmentBase(BaseModel):
    service: str = Field(..., min_length=3)
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    time: str = Field(..., pattern=r"^\d{2}:\d{2}$") 
    name: str = Field(..., min_length=3)
    phone: str = Field(..., min_length=8)
    client_id: Optional[int] = None

class Appointment(AppointmentBase):
    id: int
    created_at: datetime
    status: str = "pending"

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(BaseModel):
    service: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = None
    client_id: Optional[int] = None