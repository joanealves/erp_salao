from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime, timedelta
import database

from models.report import (
    RevenueReport, 
    AppointmentsReport, 
    ServicesReport, 
    ClientsReport,
    ReportSummary
)

router = APIRouter()

@router.get("/revenue", response_model=List[RevenueReport])
async def get_revenue_report(
    time_frame: str = Query("month", enum=["week", "month", "quarter", "year"])
):
    """Retorna dados de faturamento baseado no período selecionado"""
    # Calcular data início baseado no time_frame
    now = datetime.now()
    if time_frame == "week":
        start_date = now - timedelta(days=7)
    elif time_frame == "month":
        start_date = now - timedelta(days=30)
    elif time_frame == "quarter":
        start_date = now - timedelta(days=90)
    else:  # year
        start_date = now - timedelta(days=365)
    
    start_date_str = start_date.strftime("%Y-%m-%d")
    
    try:
        revenue_data = database.execute_raw(
            """
            SELECT 
                DATE_FORMAT(date, '%Y-%m') as period,
                SUM(s.price) as value
            FROM appointments a
            JOIN services s ON a.service = s.name
            WHERE date >= %s AND status = 'completed'
            GROUP BY period
            ORDER BY period
            """,
            (start_date_str,)
        )
        
        # Formatar para o frontend
        result = []
        for item in revenue_data:
            if "period" in item and item["period"]:
                date_parts = item["period"].split("-")
                if len(date_parts) == 2:
                    month_names = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
                    month_name = month_names[int(date_parts[1]) - 1]
                    
                    result.append({
                        "name": month_name,
                        "valor": float(item["value"]) if item["value"] else 0
                    })
        
        # Se não tiver dados, criar exemplos baseados no período
        if not result:
            # Criar dados de exemplo para o período selecionado
            months_to_show = 12 if time_frame == "year" else (3 if time_frame == "quarter" else 1)
            for i in range(months_to_show):
                month_date = now - timedelta(days=30 * i)
                month_name = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][month_date.month - 1]
                result.insert(0, {"name": month_name, "valor": 0})
        
        print(f"Revenue report data: {result}")  # Debug log
        return result
    except Exception as e:
        print(f"Error in get_revenue_report: {str(e)}")
        # Return empty result in case of error
        return []

@router.get("/appointments", response_model=List[AppointmentsReport])
async def get_appointments_report(
    time_frame: str = Query("month", enum=["week", "month", "quarter", "year"])
):
    """Retorna dados de agendamentos baseado no período selecionado"""
    # Similar ao get_revenue_report, mas contando agendamentos
    now = datetime.now()
    if time_frame == "week":
        start_date = now - timedelta(days=7)
    elif time_frame == "month":
        start_date = now - timedelta(days=30)
    elif time_frame == "quarter":
        start_date = now - timedelta(days=90)
    else:  # year
        start_date = now - timedelta(days=365)
    
    try:
        appointments_data = database.execute_raw(
            """
            SELECT 
                DATE_FORMAT(date, '%Y-%m') as period,
                COUNT(*) as value
            FROM appointments
            WHERE date >= %s
            GROUP BY period
            ORDER BY period
            """,
            (start_date.strftime("%Y-%m-%d"),)
        )
        
        result = []
        for item in appointments_data:
            if "period" in item and item["period"]:
                date_parts = item["period"].split("-")
                if len(date_parts) == 2:
                    month_names = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
                    month_name = month_names[int(date_parts[1]) - 1]
                    
                    result.append({
                        "name": month_name,
                        "valor": int(item["value"]) if item["value"] else 0
                    })
        
        # Se não tiver dados, criar exemplos baseados no período
        if not result:
            months_to_show = 12 if time_frame == "year" else (3 if time_frame == "quarter" else 1)
            for i in range(months_to_show):
                month_date = now - timedelta(days=30 * i)
                month_name = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][month_date.month - 1]
                result.insert(0, {"name": month_name, "valor": 0})
        
        return result
    except Exception as e:
        print(f"Error in get_appointments_report: {str(e)}")
        return []

@router.get("/services", response_model=List[ServicesReport])
async def get_services_report():
    """Retorna dados dos serviços mais procurados"""
    try:
        services_data = database.execute_raw(
            """
            SELECT 
                a.service as name,
                COUNT(*) as value
            FROM appointments a
            JOIN services s ON a.service = s.name
            GROUP BY a.service
            ORDER BY value DESC
            LIMIT 5
            """
        )
        
        result = []
        for item in services_data:
            result.append({
                "name": item["name"],
                "valor": int(item["value"]) if item["value"] else 0
            })
        
        # Se não tiver dados, retornar lista vazia
        if not result:
            # Tentar obter pelo menos alguns serviços para mostrar
            services = database.execute_raw("SELECT name FROM services LIMIT 5")
            for service in services:
                result.append({"name": service["name"], "valor": 0})
        
        return result
    except Exception as e:
        print(f"Error in get_services_report: {str(e)}")
        return []

@router.get("/clients", response_model=List[ClientsReport])
async def get_clients_report():
    """Retorna dados sobre clientes novos vs recorrentes"""
    try:
        # Verificar se temos clientes
        total_query = "SELECT COUNT(*) as total FROM clients"
        total_result = database.execute_raw(total_query)
        
        if not total_result or total_result[0]["total"] == 0:
            # Sem dados, retornar valores padrão
            return [
                {"name": "Recorrentes", "valor": 0},
                {"name": "Novos", "valor": 100}
            ]
        
        # Clientes com mais de um agendamento são considerados recorrentes
        client_counts = database.execute_raw(
            """
            SELECT 
                client_id,
                COUNT(*) as appointment_count
            FROM appointments
            WHERE client_id IS NOT NULL
            GROUP BY client_id
            """
        )
        
        total_clients = len(client_counts)
        recurring_clients = sum(1 for item in client_counts if item["appointment_count"] > 1)
        
        # Se não houver dados suficientes
        if total_clients == 0:
            return [
                {"name": "Recorrentes", "valor": 0},
                {"name": "Novos", "valor": 100}
            ]
        
        # Calcular percentuais
        recurring_percent = round((recurring_clients / total_clients) * 100)
        new_percent = 100 - recurring_percent
        
        return [
            {"name": "Recorrentes", "valor": recurring_percent},
            {"name": "Novos", "valor": new_percent}
        ]
    except Exception as e:
        print(f"Error in get_clients_report: {str(e)}")
        return [
            {"name": "Recorrentes", "valor": 0},
            {"name": "Novos", "valor": 100}
        ]

@router.get("/summary", response_model=ReportSummary)
async def get_report_summary(
    report_type: str = Query("revenue", enum=["revenue", "appointments"]),
    time_frame: str = Query("month", enum=["week", "month", "quarter", "year"])
):
    """Retorna resumo de métricas para o dashboard"""
    now = datetime.now()
    if time_frame == "week":
        current_start_date = now - timedelta(days=7)
        previous_start_date = now - timedelta(days=14)
    elif time_frame == "month":
        current_start_date = now - timedelta(days=30)
        previous_start_date = now - timedelta(days=60)
    elif time_frame == "quarter":
        current_start_date = now - timedelta(days=90)
        previous_start_date = now - timedelta(days=180)
    else:  # year
        current_start_date = now - timedelta(days=365)
        previous_start_date = now - timedelta(days=730)
    
    try:
        # Query e cálculos dependerão do tipo de relatório
        if report_type == "revenue":
            # Total do período atual
            current_total_query = """
            SELECT SUM(s.price) as total
            FROM appointments a
            JOIN services s ON a.service = s.name
            WHERE a.status = 'completed'
            AND a.date >= %s
            """
            
            current_result = database.execute_raw(current_total_query, 
                                          (current_start_date.strftime("%Y-%m-%d"),))
            current_total = float(current_result[0]["total"]) if current_result and current_result[0]["total"] else 0
            
            # Total do período anterior
            previous_total_query = """
            SELECT SUM(s.price) as total
            FROM appointments a
            JOIN services s ON a.service = s.name
            WHERE a.status = 'completed'
            AND a.date >= %s AND a.date < %s
            """
            
            previous_result = database.execute_raw(previous_total_query, 
                                            (previous_start_date.strftime("%Y-%m-%d"), 
                                             current_start_date.strftime("%Y-%m-%d")))
            previous_total = float(previous_result[0]["total"]) if previous_result and previous_result[0]["total"] else 0
            
            # Ticket médio
            avg_ticket_query = """
            SELECT AVG(s.price) as avg_value
            FROM appointments a
            JOIN services s ON a.service = s.name
            WHERE a.status = 'completed'
            AND a.date >= %s
            """
            
            avg_result = database.execute_raw(avg_ticket_query, 
                                       (current_start_date.strftime("%Y-%m-%d"),))
            avg_value = float(avg_result[0]["avg_value"]) if avg_result and avg_result[0]["avg_value"] else 0
            
        else:  # appointments
            # Total do período atual
            current_total_query = """
            SELECT COUNT(*) as total
            FROM appointments
            WHERE date >= %s
            """
            
            current_result = database.execute_raw(current_total_query, 
                                          (current_start_date.strftime("%Y-%m-%d"),))
            current_total = int(current_result[0]["total"]) if current_result and current_result[0]["total"] else 0
            
            # Total do período anterior
            previous_total_query = """
            SELECT COUNT(*) as total
            FROM appointments
            WHERE date >= %s AND date < %s
            """
            
            previous_result = database.execute_raw(previous_total_query, 
                                            (previous_start_date.strftime("%Y-%m-%d"), 
                                             current_start_date.strftime("%Y-%m-%d")))
            previous_total = int(previous_result[0]["total"]) if previous_result and previous_result[0]["total"] else 0
            
            # Média de agendamentos por cliente
            avg_query = """
            SELECT AVG(appointment_count) as avg_value
            FROM (
                SELECT client_id, COUNT(*) as appointment_count
                FROM appointments
                WHERE date >= %s
                GROUP BY client_id
            ) subquery
            """
            
            avg_result = database.execute_raw(avg_query, 
                                       (current_start_date.strftime("%Y-%m-%d"),))
            avg_value = float(avg_result[0]["avg_value"]) if avg_result and avg_result[0]["avg_value"] else 0
        
        # Ocupação (% de horários disponíveis vs. preenchidos)
        # Como não temos certeza se a tabela available_slots existe, vamos calcular um valor aproximado
        # baseado no número de agendamentos vs. capacidade estimada
        
        # Estimando horários disponíveis como 8 por dia (8h às 18h, um por hora)
        days_in_period = (now - current_start_date).days
        total_slots = days_in_period * 8  # 8 slots por dia
        
        appointments_count_query = """
        SELECT COUNT(*) as count
        FROM appointments
        WHERE date >= %s
        """
        
        appointments_result = database.execute_raw(appointments_count_query, 
                                            (current_start_date.strftime("%Y-%m-%d"),))
        appointments_count = int(appointments_result[0]["count"]) if appointments_result and appointments_result[0]["count"] else 0
        
        occupation_rate = min(100, (appointments_count / total_slots * 100)) if total_slots > 0 else 0
        
        # Calcular taxa de crescimento
        growth_rate = 0
        if previous_total > 0:
            growth_rate = ((current_total - previous_total) / previous_total) * 100
        
        return {
            "total": current_total,
            "growth_rate": growth_rate,
            "avg_value": avg_value,
            "occupation_rate": occupation_rate
        }
    except Exception as e:
        print(f"Error in get_report_summary: {str(e)}")
        return {
            "total": 0,
            "growth_rate": 0,
            "avg_value": 0,
            "occupation_rate": 0
        }