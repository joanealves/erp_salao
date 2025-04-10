from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from datetime import datetime, date, timedelta
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
    date_str: Optional[str] = None,
    search: Optional[str] = None,
    page: Optional[int] = 1,
    limit: Optional[int] = 10,
    sort: Optional[str] = None,
):
    conditions = {}
    if status:
        conditions["status"] = status
    if date_str:
        conditions["date"] = date_str

    offset = (page - 1) * limit

    order_by = None
    if sort:
        field, order = sort.split(".") if "." in sort else (sort, "asc")
        order_by = f"{field} {'ASC' if order.lower() == 'asc' else 'DESC'}"

    total_count = 0

    if search:
        query = """
        SELECT * FROM appointments 
        WHERE name LIKE %s OR phone LIKE %s
        """
        params = [f"%{search}%", f"%{search}%"]

        if status:
            query += " AND status = %s"
            params.append(status)
        if date_str:
            query += " AND date = %s"
            params.append(date_str)

        if order_by:
            query += f" ORDER BY {order_by}"

        query += " LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        count_query = """
        SELECT COUNT(*) as count FROM appointments 
        WHERE name LIKE %s OR phone LIKE %s
        """
        count_params = [f"%{search}%", f"%{search}%"]

        if status:
            count_query += " AND status = %s"
            count_params.append(status)
        if date_str:
            count_query += " AND date = %s"
            count_params.append(date_str)

        count_result = execute_raw(count_query, count_params)
        total_count = count_result[0]["count"] if count_result else 0

        appointments = execute_raw(query, params)
    else:
        total_count = select_count("appointments", conditions)
        appointments = select_all(
            "appointments",
            conditions=conditions,
            limit=limit,
            offset=offset,
            order_by=order_by,
        )
    
    for item in appointments:
        if isinstance(item.get('date'), date):
            item['date'] = item['date'].isoformat()
            
        if hasattr(item.get('time', ''), 'total_seconds'):  
            seconds = item['time'].total_seconds()
            hours, remainder = divmod(seconds, 3600)
            minutes, _ = divmod(remainder, 60)
            item['time'] = f"{int(hours):02}:{int(minutes):02}"

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
    
    if isinstance(appointment.get('date'), date):
        appointment['date'] = appointment['date'].isoformat()
        
    if hasattr(appointment.get('time', ''), 'total_seconds'): 
        seconds = appointment['time'].total_seconds()
        hours, remainder = divmod(seconds, 3600)
        minutes, _ = divmod(remainder, 60)
        appointment['time'] = f"{int(hours):02}:{int(minutes):02}"
        
    return appointment

@router.post("/", response_model=Appointment)
async def create_appointment(appointment: AppointmentCreate):
    try:
        print(f"Received appointment data: {appointment}")
        
        appointment_data = appointment.dict(exclude_unset=True)
        
        required_fields = ['service', 'date', 'time', 'name', 'phone']
        for field in required_fields:
            if field not in appointment_data or not appointment_data[field]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"O campo '{field}' é obrigatório"
                )
        
        if isinstance(appointment_data.get('date'), str):
            try:
                appointment_data['date'] = datetime.strptime(appointment_data['date'], "%Y-%m-%d").date()
            except ValueError as e:
                print(f"Data format error: {e}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Formato de data inválido. Use YYYY-MM-DD: {str(e)}"
                )
        
        if isinstance(appointment_data.get('time'), str):
            try:
                time_parts = appointment_data['time'].split(":")
                if len(time_parts) != 2:
                    raise ValueError("Formato de hora inválido")
                    
                hours = int(time_parts[0])
                minutes = int(time_parts[1])
                appointment_data['time'] = timedelta(hours=hours, minutes=minutes)
            except (ValueError, IndexError) as e:
                print(f"Time format error: {e}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Formato de hora inválido. Use HH:MM: {str(e)}"
                )
        
        if 'status' not in appointment_data:
            appointment_data['status'] = 'pending'
            
        if 'client_id' in appointment_data and appointment_data['client_id'] is None:
            appointment_data['client_id'] = None  

            
        print(f"Processed data for database: {appointment_data}")
        
        result = insert("appointments", appointment_data)
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Falha ao criar agendamento"
            )
            
        if isinstance(result.get('date'), date):
            result['date'] = result['date'].isoformat()
            
        if hasattr(result.get('time', ''), 'total_seconds'):
            seconds = result['time'].total_seconds()
            hours, remainder = divmod(seconds, 3600)
            minutes, _ = divmod(remainder, 60)
            result['time'] = f"{int(hours):02}:{int(minutes):02}"
            
        return result
        
    except HTTPException as he:
        raise he  
    except Exception as e:
        print(f"Error creating appointment: {str(e)}")
        print(traceback.format_exc())  
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create appointment: {str(e)}"
        )

# Novo endpoint com único decorador
@router.put("/{appointment_id}", response_model=Appointment)
async def update_appointment(appointment_id: int, appointment: AppointmentUpdate):
    # Método correto
    existing = select_by_id("appointments", appointment_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Atualizar apenas campos não nulos
    update_data = {k: v for k, v in appointment.dict().items() if v is not None}

    result = update("appointments", appointment_id, update_data)
    return result

@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_appointment(appointment_id: int):
    existing = select_by_id("appointments", appointment_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Appointment not found")

    delete("appointments", appointment_id)
    return None