from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from datetime import datetime
from models.appointment import Appointment, AppointmentCreate, AppointmentUpdate
import traceback
from database import (
    select_all,
    select_by_id,
    insert,
    update,
    delete,
    execute_raw,
    select_count,
)

router = APIRouter()

@router.get("/", response_model=dict)
async def get_appointments(
    status: Optional[str] = None,
    date: Optional[str] = None,
    search: Optional[str] = None,
    page: Optional[int] = 1,
    limit: Optional[int] = 10,
    sort: Optional[str] = None,
):
    # Construir condições para filtro
    conditions = {}
    if status:
        conditions["status"] = status
    if date:
        conditions["date"] = date

    # Calcular paginação
    offset = (page - 1) * limit

    # Construir ordenação
    order_by = None
    if sort:
        field, order = sort.split(".") if "." in sort else (sort, "asc")
        order_by = f"{field} {'ASC' if order.lower() == 'asc' else 'DESC'}"

    # Obter contagem total (para paginação)
    total_count = 0

    # Se houver busca, usar SQL personalizado
    if search:
        # Busca por nome ou telefone
        query = """
        SELECT * FROM appointments 
        WHERE name LIKE %s OR phone LIKE %s
        """
        params = [f"%{search}%", f"%{search}%"]

        # Adicionar filtros adicionais
        if status:
            query += " AND status = %s"
            params.append(status)
        if date:
            query += " AND date = %s"
            params.append(date)

        # Adicionar ordenação
        if order_by:
            query += f" ORDER BY {order_by}"

        # Adicionar paginação
        query += " LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        # Contar total
        count_query = """
        SELECT COUNT(*) as count FROM appointments 
        WHERE name LIKE %s OR phone LIKE %s
        """
        count_params = [f"%{search}%", f"%{search}%"]

        # Adicionar filtros adicionais à query de contagem
        if status:
            count_query += " AND status = %s"
            count_params.append(status)
        if date:
            count_query += " AND date = %s"
            count_params.append(date)

        count_result = execute_raw(count_query, count_params)
        total_count = count_result[0]["count"] if count_result else 0

        # Executar a query principal
        appointments = execute_raw(query, params)
    else:
        # Usar funções helpers para consultas simples
        total_count = select_count("appointments", conditions)
        appointments = select_all(
            "appointments",
            conditions=conditions,
            limit=limit,
            offset=offset,
            order_by=order_by,
        )

    # Calcular total de páginas
    total_pages = (total_count + limit - 1) // limit if total_count > 0 else 1

    return {
        "items": appointments or [],
        "total": total_count,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
    }


@router.get("/{appointment_id}", response_model=Appointment)
async def get_appointment(appointment_id: int):
    appointment = select_by_id("appointments", appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment


@router.post("/", response_model=Appointment)
async def create_appointment(appointment: AppointmentCreate):
    try:
        print(f"Dados recebidos na API: {appointment.dict()}")
        
        appointment_data = appointment.dict()
        result = insert("appointments", appointment_data)
        
        if not result:
            print("Resultado da inserção vazio ou nulo")
            raise HTTPException(status_code=500, detail="Failed to create appointment")
        
        print(f"Agendamento criado com sucesso: {result}")
        return result
    
    except Exception as e:
        # Captura qualquer exceção e imprime detalhes
        import traceback
        error_detail = f"Erro ao criar agendamento: {str(e)}\n{traceback.format_exc()}"
        print(error_detail)
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{appointment_id}", response_model=Appointment)
async def update_appointment(appointment_id: int, appointment: AppointmentUpdate):
    # Verificar se o agendamento existe
    existing = select_by_id("appointments", appointment_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Atualizar apenas campos não nulos
    update_data = {k: v for k, v in appointment.dict().items() if v is not None}

    result = update("appointments", appointment_id, update_data)
    return result


@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_appointment(appointment_id: int):
    # Verificar se o agendamento existe
    existing = select_by_id("appointments", appointment_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Appointment not found")

    delete("appointments", appointment_id)
    return None