# models/service.py
from pydantic import BaseModel, Field
from typing import Optional

class ServiceBase(BaseModel):
    name: str = Field(..., min_length=3)
    description: Optional[str] = None
    price: float = Field(...)
    duration: int = Field(...)

class Service(ServiceBase):
    id: int

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[int] = None