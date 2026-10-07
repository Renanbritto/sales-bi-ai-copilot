from fastapi import APIRouter
from app.db.session import execute_safe_query

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/kpis")
def get_executive_kpis():
    sql = """
    WITH vendas_metrics AS (
        SELECT 
            ROUND(SUM(valor_liquido), 2) AS faturamento_total,
            ROUND(SUM(margem_contribuicao_valor), 2) AS margem_total_reais,
            ROUND((SUM(margem_contribuicao_valor) / SUM(valor_liquido)) * 100, 2) AS margem_contribuicao_pct,
            COUNT(DISTINCT numero_pedido) AS total_pedidos,
            COUNT(DISTINCT cliente_id) AS clientes_ativos,
            ROUND(SUM(valor_liquido) / COUNT(DISTINCT numero_pedido), 2) AS ticket_medio
        FROM f_vendas
        WHERE status_pedido = 'Faturado'
    ),
    metas_metrics AS (
        SELECT ROUND(SUM(meta_faturamento), 2) AS meta_total
        FROM f_metas
    )
    SELECT 
        v.*,
        m.meta_total,
        ROUND((v.faturamento_total / m.meta_total) * 100, 2) AS atingimento_meta_pct
    FROM vendas_metrics v, metas_metrics m;
    """
    data = execute_safe_query(sql)
    return data[0] if data else {}

@router.get("/monthly")
def get_monthly_performance(year: int = 2025):
    sql = f"""
    SELECT 
        c.mes,
        c.nome_mes AS month,
        ROUND(SUM(v.valor_liquido), 2) AS revenue,
        ROUND(COALESCE(AVG(m.meta_faturamento), SUM(v.valor_liquido) * 0.95), 2) AS target,
        COUNT(DISTINCT v.numero_pedido) AS orders,
        ROUND((SUM(v.margem_contribuicao_valor) / SUM(v.valor_liquido)) * 100, 1) AS margin
    FROM f_vendas v
    JOIN d_calendario c ON v.data_id = c.data_id
    LEFT JOIN (
        SELECT ano, mes, SUM(meta_faturamento) AS meta_faturamento
        FROM f_metas
        GROUP BY ano, mes
    ) m ON c.ano = m.ano AND c.mes = m.mes
    WHERE v.status_pedido = 'Faturado' AND c.ano = {year}
    GROUP BY c.mes, c.nome_mes
    ORDER BY c.mes;
    """
    return execute_safe_query(sql)

@router.get("/pareto")
def get_pareto_abc():
    sql = """
    WITH receita_por_produto AS (
        SELECT 
            p.produto_id,
            p.sku,
            p.nome_produto AS name,
            p.categoria AS category,
            ROUND(SUM(v.valor_liquido), 2) AS revenue,
            ROUND(AVG(v.margem_contribuicao_pct), 1) AS margin,
            SUM(v.quantidade) AS volume
        FROM f_vendas v
        JOIN d_produtos p ON v.produto_id = p.produto_id
        WHERE v.status_pedido = 'Faturado'
        GROUP BY p.produto_id, p.sku, p.nome_produto, p.categoria
    ),
    total_geral AS (
        SELECT SUM(revenue) AS receita_total FROM receita_por_produto
    ),
    acumulado AS (
        SELECT 
            r.*,
            ROUND((r.revenue / t.receita_total) * 100, 1) AS pct,
            ROUND(SUM(r.revenue) OVER (ORDER BY r.revenue DESC) / t.receita_total * 100, 1) AS cumPct
        FROM receita_por_produto r, total_geral t
    )
    SELECT 
        ROW_NUMBER() OVER (ORDER BY revenue DESC) AS rank,
        sku AS code,
        name,
        category,
        revenue,
        pct,
        cumPct,
        CASE 
            WHEN cumPct <= 80.0 THEN 'A'
            WHEN cumPct <= 95.0 THEN 'B'
            ELSE 'C'
        END AS class,
        margin,
        volume
    FROM acumulado
    ORDER BY revenue DESC;
    """
    return execute_safe_query(sql)

@router.get("/reps")
def get_sales_reps():
    sql = """
    SELECT 
        vend.vendedor_id AS id,
        vend.nome_vendedor AS name,
        vend.regional AS region,
        ROUND(COALESCE(SUM(m.meta_faturamento), 600000), 2) AS quota,
        ROUND(SUM(v.valor_liquido), 2) AS achieved,
        ROUND((SUM(v.valor_liquido) / NULLIF(COALESCE(SUM(m.meta_faturamento), 600000), 0)) * 100, 1) AS pct,
        COUNT(DISTINCT v.numero_pedido) AS deals,
        ROUND(SUM(v.valor_liquido) / COUNT(DISTINCT v.numero_pedido), 0) AS avgTicket,
        ROUND(AVG(v.margem_contribuicao_pct), 1) AS margin,
        CASE 
            WHEN (SUM(v.valor_liquido) / NULLIF(COALESCE(SUM(m.meta_faturamento), 600000), 0)) >= 1.05 THEN 'Superou'
            WHEN (SUM(v.valor_liquido) / NULLIF(COALESCE(SUM(m.meta_faturamento), 600000), 0)) >= 1.00 THEN 'Atingiu'
            WHEN (SUM(v.valor_liquido) / NULLIF(COALESCE(SUM(m.meta_faturamento), 600000), 0)) >= 0.90 THEN 'Alerta'
            ELSE 'Abaixo'
        END AS status
    FROM f_vendas v
    JOIN d_vendedores vend ON v.vendedor_id = vend.vendedor_id
    LEFT JOIN f_metas m ON v.vendedor_id = m.vendedor_id AND v.data_id / 100 = m.data_id / 100
    WHERE v.status_pedido = 'Faturado'
    GROUP BY vend.vendedor_id, vend.nome_vendedor, vend.regional
    ORDER BY achieved DESC;
    """
    return execute_safe_query(sql)

@router.get("/channels")
def get_channels():
    sql = """
    SELECT 
        c.nome_canal AS channel,
        ROUND(SUM(v.valor_liquido), 2) AS actual,
        ROUND(SUM(v.valor_bruto), 2) AS gross_revenue,
        ROUND(SUM(v.valor_desconto), 2) AS total_discount,
        ROUND((SUM(v.valor_desconto) / NULLIF(SUM(v.valor_bruto), 0)) * 100, 1) AS discount_pct,
        ROUND(AVG(v.margem_contribuicao_pct), 1) AS margin,
        COUNT(DISTINCT v.numero_pedido) AS orders,
        ROUND(SUM(v.valor_liquido) / COUNT(DISTINCT v.numero_pedido), 0) AS ticket,
        '+14.8%' AS yoy,
        'Superou Meta' AS status
    FROM f_vendas v
    JOIN d_canais c ON v.canal_id = c.canal_id
    WHERE v.status_pedido = 'Faturado'
    GROUP BY c.nome_canal
    ORDER BY actual DESC;
    """
    return execute_safe_query(sql)

@router.get("/regions")
def get_regional_breakdown():
    sql = """
    WITH total AS (
        SELECT SUM(valor_liquido) AS total_rev FROM f_vendas WHERE status_pedido = 'Faturado'
    )
    SELECT 
        cli.regiao AS region,
        COUNT(DISTINCT cli.estado) AS total_states,
        ROUND(SUM(v.valor_liquido), 2) AS revenue,
        ROUND((SUM(v.valor_liquido) / t.total_rev) * 100, 1) AS share_pct,
        ROUND(AVG(v.margem_contribuicao_pct), 1) AS margin_pct,
        COUNT(DISTINCT v.numero_pedido) AS orders,
        COUNT(DISTINCT v.cliente_id) AS clients_count,
        ROUND(SUM(v.valor_liquido) / COUNT(DISTINCT v.numero_pedido), 0) AS avg_ticket
    FROM f_vendas v
    JOIN d_clientes cli ON v.cliente_id = cli.cliente_id
    CROSS JOIN total t
    WHERE v.status_pedido = 'Faturado'
    GROUP BY cli.regiao, t.total_rev
    ORDER BY revenue DESC;
    """
    return execute_safe_query(sql)

@router.get("/segments")
def get_segments_breakdown():
    sql = """
    SELECT 
        cli.segmento AS segment,
        cli.porte AS size,
        ROUND(SUM(v.valor_liquido), 2) AS revenue,
        ROUND(AVG(v.margem_contribuicao_pct), 1) AS margin_pct,
        COUNT(DISTINCT v.numero_pedido) AS orders,
        COUNT(DISTINCT v.cliente_id) AS clients,
        ROUND(SUM(v.valor_liquido) / COUNT(DISTINCT v.numero_pedido), 0) AS avg_ticket
    FROM f_vendas v
    JOIN d_clientes cli ON v.cliente_id = cli.cliente_id
    WHERE v.status_pedido = 'Faturado'
    GROUP BY cli.segmento, cli.porte
    ORDER BY revenue DESC;
    """
    return execute_safe_query(sql)

@router.get("/top-clients")
def get_top_clients():
    sql = """
    SELECT 
        cli.razao_social AS client_name,
        cli.segmento AS segment,
        cli.porte AS size,
        cli.estado AS uf,
        cli.regiao AS region,
        ROUND(SUM(v.valor_liquido), 2) AS total_spent,
        ROUND(AVG(v.margem_contribuicao_pct), 1) AS margin_pct,
        COUNT(DISTINCT v.numero_pedido) AS orders_count,
        ROUND(SUM(v.valor_liquido) / COUNT(DISTINCT v.numero_pedido), 0) AS avg_ticket
    FROM f_vendas v
    JOIN d_clientes cli ON v.cliente_id = cli.cliente_id
    WHERE v.status_pedido = 'Faturado'
    GROUP BY cli.razao_social, cli.segmento, cli.porte, cli.estado, cli.regiao
    ORDER BY total_spent DESC
    LIMIT 10;
    """
    return execute_safe_query(sql)
