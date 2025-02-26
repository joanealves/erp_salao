from fastapi import APIRouter, HTTPException
from database import supabase
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/")
async def get_dashboard_stats():
    """Retorna estatísticas para o dashboard administrativo"""
    today = datetime.now().strftime("%Y-%m-%d")
    
    # Agendamentos de hoje
    today_appointments = supabase.table("appointments").select("count").eq("date", today).execute()
    
    # Agendamentos pendentes
    pending_appointments = supabase.table("appointments").select("count").eq("status", "pending").execute()
    
    # Total de clientes
    total_clients = supabase.table("clients").select("count").execute()
    
    # Faturamento mensal (último mês)
    first_day = (datetime.now().replace(day=1) - timedelta(days=1)).replace(day=1).strftime("%Y-%m-%d")
    last_day = datetime.now().replace(day=1) - timedelta(days=1)
    last_day = last_day.strftime("%Y-%m-%d")
    
    revenue_query = """
    SELECT SUM(s.price) as revenue
    FROM appointments a
    JOIN services s ON a.service = s.name
    WHERE a.status = 'completed'
    AND a.date BETWEEN $1 AND $2
    """
    
    revenue = supabase.rpc("revenue_calculation", {"start_date": first_day, "end_date": last_day}).execute()
    
    return {
        "todayAppointments": today_appointments.data[0]["count"] if today_appointments.data else 0,
        "pendingAppointments": pending_appointments.data[0]["count"] if pending_appointments.data else 0,
        "totalClients": total_clients.data[0]["count"] if total_clients.data else 0,
        "revenue": revenue.data[0]["revenue"] if revenue.data else 0
    }