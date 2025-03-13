# routes/clients.py
from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional, Dict, Any
import math
import database as db
from models.client import Client, ClientCreate, ClientResponse, PaginatedResponse

router = APIRouter()

@router.get("/", response_model=PaginatedResponse)
async def get_clients(
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    # Calcular offset para paginação
    offset = (page - 1) * limit
    
    # Construir query base
    base_query = "FROM clients"
    count_query = f"SELECT COUNT(*) {base_query}"
    where_clause = ""
    params = []
    
    # Adicionar filtro de busca se fornecido
    if search:
        where_clause = " WHERE name LIKE %s OR phone LIKE %s OR email LIKE %s"
        search_param = f"%{search}%"
        params = [search_param, search_param, search_param]
    
    # Executar contagem total para paginação
    count_result = db.execute_raw(count_query + where_clause, params)
    total_items = count_result[0]['COUNT(*)'] if count_result else 0
    
    # Calcular total de páginas
    total_pages = math.ceil(total_items / limit)
    
    # Consultar itens da página atual
    items_query = f"SELECT * {base_query}{where_clause} ORDER BY id DESC LIMIT %s OFFSET %s"
    items_params = params + [limit, offset]
    items = db.execute_raw(items_query, items_params) or []
    
    # Formatar dados de visitas para cada cliente
    for item in items:
        # Converter datas para string ISO para serialização JSON adequada
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
    
    # Formatar datas
    if 'created_at' in client and client['created_at']:
        client['created_at'] = client['created_at'].isoformat()
    if 'last_visit' in client and client['last_visit']:
        client['last_visit'] = client['last_visit'].isoformat()
        
    return client

@router.post("/", response_model=ClientResponse)
async def create_client(client: ClientCreate):
    # Converter o modelo para dicionário
    client_data = client.model_dump()
    
    # Inserir no banco de dados
    result = db.insert("clients", client_data)
    if not result:
        raise HTTPException(status_code=500, detail="Falha ao criar cliente")
    
    # Formatar datas para resposta
    if 'created_at' in result and result['created_at']:
        result['created_at'] = result['created_at'].isoformat()
    
    return result