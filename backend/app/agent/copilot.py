# -*- coding: utf-8 -*-
"""
Agente Analítico RN Intelligence com RAG e Text-to-SQL.
"""

import time
from typing import Any
from app.core.config import settings
from app.db.schema_info import get_database_schema_context
from app.agent.prompts import SYSTEM_RN_INTELLIGENCE_PROMPT
from app.agent.rag import process_rag_query, get_rag_context

async def run_copilot_pipeline(message: str, history: list[dict] | None = None) -> dict[str, Any]:
    start_time = time.time()
    api_key = settings.GEMINI_API_KEY.strip()
    
    # Se não houver chave configurada ou for placeholder, usa o motor analítico RAG local
    if not api_key or api_key == "your_gemini_api_key_here":
        reply, sql, data = process_rag_query(message)
        elapsed = round((time.time() - start_time) * 1000, 2)
        return {
            "reply": reply,
            "sql_query": sql,
            "query_results": data,
            "execution_time_ms": elapsed,
            "mode": "rag_analytical_engine"
        }
    
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        schema_context = get_database_schema_context()
        rag_context = get_rag_context()
        
        # Executa consulta RAG analítica no banco de dados
        rag_reply, rag_sql, rag_data = process_rag_query(message)
        
        # Sintetiza com Gemini potencializado por RAG
        prompt = (
            f"{SYSTEM_RN_INTELLIGENCE_PROMPT}\n\n"
            f"=== BASE DE CONHECIMENTO DO BI (RAG) ===\n"
            f"{rag_context}\n\n"
            f"=== SCHEMA E REGRAS ANALÍTICAS ===\n"
            f"{schema_context}\n\n"
            f"=== CONSULTA SQL REAL E RESULTADOS EXTRAÍDOS ===\n"
            f"SQL: {rag_sql}\n"
            f"Resultados Reais: {rag_data}\n\n"
            f"Pergunta do Usuário: {message}\n\n"
            f"Por favor, responda à pergunta do usuário baseando-se com rigor executivo nos dados reais acima. "
            f"Utilize números formatados no padrão brasileiro (R$, %) e destaque insights acionáveis."
        )
        
        resp = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt
        )
        
        elapsed = round((time.time() - start_time) * 1000, 2)
        return {
            "reply": resp.text.strip(),
            "sql_query": rag_sql,
            "query_results": rag_data,
            "execution_time_ms": elapsed,
            "mode": "gemini_rag_agent"
        }
    except Exception:
        # Fallback de alta resiliência para o motor RAG local
        reply, sql, data = process_rag_query(message)
        elapsed = round((time.time() - start_time) * 1000, 2)
        return {
            "reply": reply,
            "sql_query": sql,
            "query_results": data,
            "execution_time_ms": elapsed,
            "mode": "rag_analytical_engine"
        }
