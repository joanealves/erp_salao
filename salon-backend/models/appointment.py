from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date, time

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

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            date: lambda v: v.isoformat(),
            time: lambda v: v.strftime("%H:%M")
        }
        
    @classmethod
    def model_validate(cls, obj):
        # Converter date e time para string se necessário
        if isinstance(obj.get('date'), date):
            obj['date'] = obj['date'].isoformat()
            
        if hasattr(obj.get('time', ''), 'total_seconds'):  # Se for timedelta
            seconds = obj['time'].total_seconds()
            hours, remainder = divmod(seconds, 3600)
            minutes, _ = divmod(remainder, 60)
            obj['time'] = f"{int(hours):02}:{int(minutes):02}"
        
        return obj

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