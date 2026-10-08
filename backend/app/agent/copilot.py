import time
import re
from typing import Any
from app.core.config import settings
from app.db.session import execute_safe_query
from app.db.schema_info import get_database_schema_context
from app.agent.prompts import SYSTEM_RN_INTELLIGENCE_PROMPT, SQL_GENERATION_PROMPT

def to_float(val: Any) -> float:
    try:
        return float(val)
    except (ValueError, TypeError):
        return 0.0

def extract_sql_from_response(text: str) -> str:
    match = re.search(r"```(?:sql)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    lines = text.strip().splitlines()
    for i, line in enumerate(lines):
        if line.strip().upper().startswith(("SELECT", "WITH")):
            return "\n".join(lines[i:]).strip()
    return ""

def generate_fallback_analysis(message: str) -> tuple[str, str, list[dict[str, Any]]]:
    msg_lower = message.lower()
    
    if any(k in msg_lower for k in ["vendedor", "quem vendeu mais", "ranking", "melhor vendedor", "meta"]):
        sql = """
        SELECT 
            v.nome_vendedor,
            v.regional,
            ROUND(SUM(f.valor_liquido), 2) AS total_faturado,
            COUNT(DISTINCT f.numero_pedido) AS pedidos,
            ROUND(AVG(f.margem_contribuicao_pct), 2) AS margem_media_pct
        FROM f_vendas f
        JOIN d_vendedores v ON f.vendedor_id = v.vendedor_id
        WHERE f.status_pedido = 'Faturado'
        GROUP BY v.nome_vendedor, v.regional
        ORDER BY total_faturado DESC;
        """.strip()
        data = execute_safe_query(sql)
        top = data[0] if data else {}
        total = to_float(top.get('total_faturado', 0))
        pedidos = top.get('pedidos', 0)
        margem = to_float(top.get('margem_media_pct', 0))
        nome = top.get('nome_vendedor', 'N/A')
        reg = top.get('regional', 'N/A')
        reply = (
            f"🏆 **Liderança Comercial:** O vendedor com maior faturamento é **{nome}** "
            f"({reg}), totalizando **R$ {total:,.2f}** faturados em "
            f"**{pedidos} pedidos**, com margem média de **{margem:.2f}%**.\n\n"
            f"A equipe demonstrou forte tração especialmente nas regionais Sudeste e Sul."
        )
        return reply, sql, data
        
    elif any(k in msg_lower for k in ["produto", "pareto", "classe a", "mais vendido", "sku"]):
        sql = """
        SELECT 
            p.sku,
            p.nome_produto,
            p.classe_abc,
            ROUND(SUM(f.valor_liquido), 2) AS faturamento,
            ROUND(AVG(f.margem_contribuicao_pct), 2) AS margem_pct,
            SUM(f.quantidade) AS volume_unidades
        FROM f_vendas f
        JOIN d_produtos p ON f.produto_id = p.produto_id
        WHERE f.status_pedido = 'Faturado'
        GROUP BY p.sku, p.nome_produto, p.classe_abc
        ORDER BY faturamento DESC
        LIMIT 5;
        """.strip()
        data = execute_safe_query(sql)
        top_prod = data[0] if data else {}
        fat = to_float(top_prod.get('faturamento', 0))
        margem = to_float(top_prod.get('margem_pct', 0))
        reply = (
            f"📦 **Análise de Produtos (Curva ABC):**\n"
            f"O produto de maior impacto na receita é **{top_prod.get('nome_produto')}** ({top_prod.get('sku')}), "
            f"classificado como **Classe {top_prod.get('classe_abc')}**, gerando **R$ {fat:,.2f}** "
            f"com margem de **{margem:.2f}%**.\n\n"
            f"Os produtos Classe A respondem pela maior fatia do faturamento comercial da companhia."
        )
        return reply, sql, data
        
    elif any(k in msg_lower for k in ["margem", "lucro", "rentabilidade"]):
        sql = """
        SELECT 
            ROUND(SUM(valor_liquido), 2) AS faturamento_total,
            ROUND(SUM(margem_contribuicao_valor), 2) AS margem_total_reais,
            ROUND((SUM(margem_contribuicao_valor) / SUM(valor_liquido)) * 100, 2) AS margem_contribuicao_pct
        FROM f_vendas
        WHERE status_pedido = 'Faturado';
        """.strip()
        data = execute_safe_query(sql)
        row = data[0] if data else {}
        fat = to_float(row.get('faturamento_total', 0))
        margem_val = to_float(row.get('margem_total_reais', 0))
        margem_pct = to_float(row.get('margem_contribuicao_pct', 0))
        reply = (
            f"📈 **Rentabilidade & Margem Geral:**\n"
            f"A empresa acumula **R$ {fat:,.2f}** em faturamento líquido, gerando "
            f"**R$ {margem_val:,.2f}** de margem de contribuição (**{margem_pct:.2f}%**).\n\n"
            f"A margem operacional média da carteira está saudável e alinhada às metas estratégicas."
        )
        return reply, sql, data
        
    else:
        sql = """
        SELECT 
            COUNT(*) AS total_pedidos,
            ROUND(SUM(valor_liquido), 2) AS faturamento_total,
            ROUND(AVG(margem_contribuicao_pct), 2) AS margem_media_pct,
            ROUND(SUM(valor_liquido) / COUNT(*), 2) AS ticket_medio
        FROM f_vendas
        WHERE status_pedido = 'Faturado';
        """.strip()
        data = execute_safe_query(sql)
        row = data[0] if data else {}
        fat = to_float(row.get('faturamento_total', 0))
        pedidos = row.get('total_pedidos', 0)
        ticket = to_float(row.get('ticket_medio', 0))
        margem = to_float(row.get('margem_media_pct', 0))
        reply = (
            f"📊 **Visão Geral Comercial (DuckDB):**\n"
            f"• **Faturamento Líquido:** R$ {fat:,.2f}\n"
            f"• **Total de Pedidos Faturados:** {pedidos:,}\n"
            f"• **Ticket Médio:** R$ {ticket:,.2f}\n"
            f"• **Margem Média:** {margem:.2f}%\n\n"
            f"*(Você pode perguntar sobre vendedores, metas, produtos da Curva ABC, canais ou margem por região!)*"
        )
        return reply, sql, data

async def run_copilot_pipeline(message: str, history: list[dict] | None = None) -> dict[str, Any]:
    start_time = time.time()
    api_key = settings.GEMINI_API_KEY.strip()
    
    if not api_key or api_key == "your_gemini_api_key_here":
        reply, sql, data = generate_fallback_analysis(message)
        elapsed = round((time.time() - start_time) * 1000, 2)
        return {
            "reply": reply,
            "sql_query": sql,
            "query_results": data,
            "execution_time_ms": elapsed,
            "mode": "demo_rule_based"
        }
    
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        schema_context = get_database_schema_context()
        
        # Etapa 1: Gerar SQL analítico
        sql_prompt = (
            f"{SQL_GENERATION_PROMPT}\n\n"
            f"{schema_context}\n\n"
            f"Pergunta do Usuário: {message}\n"
            f"Escreva a query SQL:"
        )
        
        sql_resp = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=sql_prompt
        )
        
        generated_sql = extract_sql_from_response(sql_resp.text)
        if not generated_sql:
            generated_sql = "SELECT ROUND(SUM(valor_liquido), 2) AS total FROM f_vendas WHERE status_pedido = 'Faturado';"
            
        # Etapa 2: Executar no DuckDB com segurança
        query_results = execute_safe_query(generated_sql)
        
        # Etapa 3: Síntese executiva
        synthesis_prompt = (
            f"{SYSTEM_RN_INTELLIGENCE_PROMPT}\n\n"
            f"Pergunta original: {message}\n\n"
            f"SQL executado no DuckDB:\n{generated_sql}\n\n"
            f"Dados reais retornados:\n{query_results}\n\n"
            f"Por favor, responda à pergunta com base estritamente nesses dados, com clareza e tom executivo."
        )
        
        analysis_resp = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=synthesis_prompt
        )
        
        elapsed = round((time.time() - start_time) * 1000, 2)
        return {
            "reply": analysis_resp.text.strip(),
            "sql_query": generated_sql,
            "query_results": query_results,
            "execution_time_ms": elapsed,
            "mode": "gemini_agent"
        }
    except Exception as e:
        reply, sql, data = generate_fallback_analysis(message)
        elapsed = round((time.time() - start_time) * 1000, 2)
        return {
            "reply": f"{reply}\n\n*(Nota: O Agente utilizou o motor analítico local devido ao aviso: {str(e)[:120]}...)*",
            "sql_query": sql,
            "query_results": data,
            "execution_time_ms": elapsed,
            "mode": "fallback_error"
        }
