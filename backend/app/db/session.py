import re
from decimal import Decimal
import duckdb
from typing import Any
from app.core.config import settings

FORBIDDEN_SQL_KEYWORDS = [
    r"\bDROP\b",
    r"\bDELETE\b",
    r"\bINSERT\b",
    r"\bUPDATE\b",
    r"\bALTER\b",
    r"\bATTACH\b",
    r"\bDETACH\b",
    r"\bCOPY\s+TO\b",
    r"\bEXPORT\s+DATABASE\b",
    r"\bPRAGMA\b",
    r"\bCREATE\b",
    r"\bREPLACE\b",
    r"\bTRUNCATE\b",
]

def get_duckdb_connection(read_only: bool = True) -> duckdb.DuckDBPyConnection:
    db_path = settings.get_resolved_db_path()
    return duckdb.connect(db_path, read_only=read_only)

def validate_safe_sql(query: str) -> None:
    cleaned = query.strip()
    if not cleaned.upper().startswith(("SELECT", "WITH", "DESCRIBE", "EXPLAIN")):
        raise ValueError("Apenas consultas de leitura (SELECT, WITH) são permitidas.")
    
    for pattern in FORBIDDEN_SQL_KEYWORDS:
        if re.search(pattern, cleaned, re.IGNORECASE):
            raise ValueError("Comando SQL não autorizado detectado na consulta.")

def execute_safe_query(query: str, max_rows: int = 100) -> list[dict[str, Any]]:
    validate_safe_sql(query)
    con = get_duckdb_connection(read_only=True)
    try:
        rel = con.sql(query)
        columns = rel.columns
        rows = rel.fetchall()
        
        results = []
        for row in rows[:max_rows]:
            row_dict = {}
            for col, val in zip(columns, row):
                if hasattr(val, "isoformat"):
                    row_dict[col] = val.isoformat()
                elif isinstance(val, Decimal):
                    row_dict[col] = float(val)
                elif isinstance(val, (int, float, str, bool)) or val is None:
                    row_dict[col] = val
                else:
                    try:
                        row_dict[col] = float(val)
                    except (ValueError, TypeError):
                        row_dict[col] = str(val)
            results.append(row_dict)
        return results
    finally:
        con.close()
