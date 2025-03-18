from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class ClientBase(BaseModel):
    name: str = Field(..., min_length=3, description="Nome completo do cliente")
    phone: str = Field(..., min_length=8, description="Número de telefone do cliente")
    email: Optional[str] = Field(None, pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", description="Email do cliente")  

class ClientCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None 

class Client(ClientBase):
    id: int
    created_at: datetime
    last_visit: Optional[datetime] = None
    total_visits: int = 0

class ClientResponse(ClientBase):
    id: int
    created_at: str
    last_visit: Optional[str] = None
    total_visits: int = 0

class PaginatedResponse(BaseModel):
    items: List[Dict[str, Any]]
    total: int
    page: int
    total_pages: int
    limit: int