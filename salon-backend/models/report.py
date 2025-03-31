from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class RevenueReport(BaseModel):
    name: str
    valor: float

class AppointmentsReport(BaseModel):
    name: str
    valor: int

class ServicesReport(BaseModel):
    name: str
    valor: int

class ClientsReport(BaseModel):
    name: str
    valor: int

class ReportSummary(BaseModel):
    total: float
    growth_rate: float
    avg_value: float
    occupation_rate: float