# routes/stats.py
from fastapi import APIRouter, HTTPException
import database as db
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/")
async def get_dashboard_stats():
    """Retorna estatísticas para o dashboard administrativo"""
    today = datetime.now().strftime("%Y-%m-%d")
    
    # Agendamentos de hoje
    today_appointments = db.select_count("appointments", {"date": today})
    
    # Agendamentos pendentes
    pending_appointments = db.select_count("appointments", {"status": "pending"})
    
    # Total de clientes
    total_clients = db.select_count("clients")
    
    # Faturamento mensal (último mês)
    first_day = (datetime.now().replace(day=1) - timedelta(days=1)).replace(day=1).strftime("%Y-%m-%d")
    last_day = datetime.now().replace(day=1) - timedelta(days=1)
    last_day = last_day.strftime("%Y-%m-%d")
    
    # Query para calcular receita: buscar agendamentos concluídos e juntar com tabela de serviços
    revenue_query = """
    SELECT SUM(s.price) as total_revenue
    FROM appointments a
    JOIN services s ON a.service = s.name
    WHERE a.status = 'completed'
    AND a.date BETWEEN %s AND %s
    """
    
    revenue_result = db.execute_raw(revenue_query, (first_day, last_day))
    revenue = revenue_result[0]['total_revenue'] if revenue_result and revenue_result[0]['total_revenue'] else 0
    
    return {
        "todayAppointments": today_appointments,
        "pendingAppointments": pending_appointments,
        "totalClients": total_clients,
        "revenue": round(float(revenue), 2)
    }