# database.py
import os
import mysql.connector
from mysql.connector import pooling
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_PORT = os.environ.get("DB_PORT", "3307")
DB_USER = os.environ.get("DB_USER", "root")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "101023")
DB_NAME = os.environ.get("DB_NAME", "salon_management")

print(f"MySQL Connection Info - Host: {DB_HOST}, Port: {DB_PORT}, User: {DB_USER}, DB: {DB_NAME}")

# Criar pool de conexões com pool_reset_session=False
try:
    connection_pool = pooling.MySQLConnectionPool(
        pool_name="salon_pool",
        pool_size=5,
        pool_reset_session=False,  # 🔹 Evita erros ao resetar sessões
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )

    # Testar a conexão
    with connection_pool.get_connection() as conn:
        cursor = conn.cursor(dictionary=True, buffered=True)
        cursor.execute("SELECT 1")
        cursor.fetchall()
        cursor.close()

    print("Conexão com MySQL estabelecida com sucesso!")
except Exception as e:
    print(f"Erro na conexão com MySQL: {e}")
    raise


def get_connection():
    """Retorna uma conexão do pool"""
    return connection_pool.get_connection()


def execute_query(query, params=None, fetch=True):
    """Executa uma query e retorna os resultados, se houver"""
    connection = None
    cursor = None
    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True, buffered=True)
        
        cursor.execute(query, params or ())
        
        if fetch:
            result = cursor.fetchall()
        else:
            connection.commit()
            result = {"affected_rows": cursor.rowcount}
            if cursor.lastrowid:
                result["last_insert_id"] = cursor.lastrowid

        return result
    except Exception as e:
        if connection:
            connection.rollback()
        raise e
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def select_all(table, conditions=None, limit=None, offset=None, order_by=None):
    """Seleciona registros de uma tabela"""
    query = f"SELECT * FROM {table}"
    params = []

    if conditions:
        query += " WHERE "
        clauses = []
        for key, value in conditions.items():
            if isinstance(value, tuple) and len(value) == 2:
                operator, val = value
                clauses.append(f"{key} {operator} %s")
                params.append(val)
            else:
                clauses.append(f"{key} = %s")
                params.append(value)
        query += " AND ".join(clauses)

    if order_by:
        query += f" ORDER BY {order_by}"

    if limit:
        query += " LIMIT %s"
        params.append(limit)

        if offset:
            query += " OFFSET %s"
            params.append(offset)

    return execute_query(query, params)


def select_by_id(table, record_id):
    """Seleciona um registro por ID"""
    query = f"SELECT * FROM {table} WHERE id = %s"
    result = execute_query(query, (record_id,))
    return result[0] if result else None


def insert(table, data):
    """Insere um novo registro"""
    columns = ", ".join(data.keys())
    placeholders = ", ".join(["%s"] * len(data))
    query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
    
    result = execute_query(query, tuple(data.values()), fetch=False)
    
    if "last_insert_id" in result:
        return select_by_id(table, result["last_insert_id"])
    return None


def update(table, record_id, data):
    """Atualiza um registro existente"""
    if not data:
        return select_by_id(table, record_id)

    set_clause = ", ".join([f"{key} = %s" for key in data.keys()])
    query = f"UPDATE {table} SET {set_clause} WHERE id = %s"

    params = list(data.values())
    params.append(record_id)

    execute_query(query, params, fetch=False)
    return select_by_id(table, record_id)


def delete(table, record_id):
    """Remove um registro"""
    query = f"DELETE FROM {table} WHERE id = %s"
    return execute_query(query, (record_id,), fetch=False)

def execute_raw(query, params=None):
    """Executa uma query SQL diretamente e retorna os resultados"""
    return execute_query(query, params or ())

def select_count(table, conditions=None):
    """Conta registros em uma tabela com base em condições"""
    query = f"SELECT COUNT(*) as count FROM {table}"
    params = []

    if conditions:
        query += " WHERE "
        clauses = []
        for key, value in conditions.items():
            if isinstance(value, tuple) and len(value) == 2:
                operator, val = value
                clauses.append(f"{key} {operator} %s")
                params.append(val)
            else:
                clauses.append(f"{key} = %s")
                params.append(value)
        query += " AND ".join(clauses)

    result = execute_query(query, params)
    return result[0]['count'] if result else 0    

def search(table, field, term):
    """Busca registros que contenham um termo específico em um campo"""
    query = f"SELECT * FROM {table} WHERE {field} LIKE %s"
    params = (f"%{term}%",)
    return execute_query(query, params)    