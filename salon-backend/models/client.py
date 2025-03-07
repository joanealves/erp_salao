from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ClientBase(BaseModel):
    name: str = Field(..., min_length=3)
    phone: str = Field(..., min_length=8)
    email: Optional[str] = Field(None, pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")  

class Client(ClientBase):
    id: int
    created_at: datetime

class ClientCreate(ClientBase):
    pass