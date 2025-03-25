from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional, Dict, Any
import math
import database as db
from models.client import Client, ClientCreate, ClientResponse, PaginatedResponse
import re
import traceback

router = APIRouter()

@router.get("/", response_model=PaginatedResponse)
async def get_clients(
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    offset = (page - 1) * limit
    
    base_query = "FROM clients"
    count_query = f"SELECT COUNT(*) {base_query}"
    where_clause = ""
    params = []
    
    if search:
        where_clause = " WHERE name LIKE %s OR phone LIKE %s OR email LIKE %s"
        search_param = f"%{search}%"
        params = [search_param, search_param, search_param]
    
    count_result = db.execute_raw(count_query + where_clause, params)
    total_items = count_result[0]['COUNT(*)'] if count_result else 0
    
    total_pages = math.ceil(total_items / limit)
    
    items_query = f"SELECT * {base_query}{where_clause} ORDER BY id DESC LIMIT %s OFFSET %s"
    items_params = params + [limit, offset]
    items = db.execute_raw(items_query, items_params) or []
    
    for item in items:
        if 'created_at' in item and item['created_at']:
            item['created_at'] = item['created_at'].isoformat()
        if 'last_visit' in item and item['last_visit']:
            item['last_visit'] = item['last_visit'].isoformat()
    
    return {
        "items": items,
        "total": total_items,
        "page": page,
        "total_pages": total_pages,
        "limit": limit
    }

@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(client_id: int):
    client = db.select_by_id("clients", client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    
    if 'created_at' in client and client['created_at']:
        client['created_at'] = client['created_at'].isoformat()
    if 'last_visit' in client and client['last_visit']:
        client['last_visit'] = client['last_visit'].isoformat()
        
    return client

@router.post("/", response_model=ClientResponse)
async def create_client(client: ClientCreate):
    try:
        print("Received client data:", {
            "name": client.name,
            "phone": client.phone,
            "email": client.email
        })

        client_data = {
            "name": client.name.strip(),
            "phone": client.phone.strip(),
            "email": client.email.strip() if client.email else None
        }

        if not client_data["name"]:
            raise HTTPException(
                status_code=422, 
                detail=[{
                    "loc": ["body", "name"], 
                    "msg": "Nome é obrigatório"
                }]
            )

        if not client_data["phone"]:
            raise HTTPException(
                status_code=422, 
                detail=[{
                    "loc": ["body", "phone"], 
                    "msg": "Telefone é obrigatório"
                }]
            )

        if len(client_data["name"]) < 3:
            raise HTTPException(
                status_code=422, 
                detail=[{
                    "loc": ["body", "name"], 
                    "msg": "Nome deve ter pelo menos 3 caracteres"
                }]
            )

        if len(client_data["phone"]) < 8:
            raise HTTPException(
                status_code=422, 
                detail=[{
                    "loc": ["body", "phone"], 
                    "msg": "Telefone deve ter pelo menos 8 caracteres"
                }]
            )

        if client_data["email"] and not re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", client_data["email"]):
            raise HTTPException(
                status_code=422, 
                detail=[{
                    "loc": ["body", "email"], 
                    "msg": "Email inválido"
                }]
            )

        print("Prepared client data:", client_data)

        result = db.insert("clients", client_data)
        
        if not result:
            print("Database insertion failed")
            raise HTTPException(
                status_code=500, 
                detail="Falha ao criar cliente: Inserção no banco de dados falhou"
            )

        if result.get('created_at'):
            result['created_at'] = result['created_at'].isoformat()

        return result

    except Exception as e:
        print(f"Full error details: {type(e).__name__}: {str(e)}")
        print(f"Error traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500, 
            detail=f"Erro ao criar cliente: {str(e)}"
        )
    
@router.put("/{client_id}", response_model=ClientResponse)
async def update_client(client_id: int, client: ClientCreate):
    try:
        if len(client.name.strip()) < 3:
            raise HTTPException(
                status_code=422, 
                detail=[{
                    "loc": ["body", "name"], 
                    "msg": "Nome deve ter pelo menos 3 caracteres"
                }]
            )

        if len(client.phone.strip()) < 8:
            raise HTTPException(
                status_code=422, 
                detail=[{
                    "loc": ["body", "phone"], 
                    "msg": "Telefone deve ter pelo menos 8 caracteres"
                }]
            )

        existing_client = db.select_by_id("clients", client_id)
        if not existing_client:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")

        update_data = {
            "name": client.name.strip(),
            "phone": client.phone.strip(),
            "email": client.email.strip() if client.email else None
        }

        result = db.update("clients", client_id, update_data)
        
        if not result:
            raise HTTPException(
                status_code=500, 
                detail="Falha ao atualizar cliente"
            )

        if result.get('created_at'):
            result['created_at'] = result['created_at'].isoformat()
        if result.get('last_visit'):
            result['last_visit'] = result['last_visit'].isoformat()

        return result

    except Exception as e:
        print("Erro ao atualizar cliente:", str(e))
        raise HTTPException(
            status_code=500, 
            detail=f"Erro ao atualizar cliente: {str(e)}"
        )

@router.delete("/{client_id}")
async def delete_client(client_id: int):
    try:
        existing_client = db.select_by_id("clients", client_id)
        if not existing_client:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")

        delete_result = db.delete("clients", client_id)
        
        if not delete_result or delete_result.get('affected_rows', 0) == 0:
            raise HTTPException(
                status_code=500, 
                detail="Falha ao excluir cliente"
            )

        return {"message": "Cliente excluído com sucesso"}

    except Exception as e:
        print("Erro ao excluir cliente:", str(e))
        raise HTTPException(
            status_code=500, 
            detail=f"Erro ao excluir cliente: {str(e)}"
        )