# 📐 Catálogo de KPIs e Métricas Analíticas em SQL (DuckDB)

Este documento documenta todas as fórmulas de negócio e consultas SQL analíticas utilizadas no projeto **Sales BI & AI Copilot**. O Agente de IA (Gemini) utiliza este dicionário como referência semântica para geração de queries analíticas precisas (**Text-to-SQL**).

---

## 1. Métricas Principais (Executive KPIs)

### 1.1 Faturamento Líquido Total
Representa a receita líquida realizada de pedidos faturados (descontos já subtraídos).
```sql
SELECT ROUND(SUM(valor_liquido), 2) AS faturamento_total
FROM f_vendas
WHERE status_pedido = 'Faturado';
```

### 1.2 Margem de Contribuição (R$ e %)
Mede o lucro bruto residual após dedução dos custos diretos dos produtos vendidos.
```sql
SELECT 
    ROUND(SUM(margem_contribuicao_valor), 2) AS margem_total_reais,
    ROUND((SUM(margem_contribuicao_valor) / SUM(valor_liquido)) * 100, 2) AS margem_contribuicao_pct
FROM f_vendas
WHERE status_pedido = 'Faturado';
```

### 1.3 Ticket Médio
Valor médio transacionado por pedido faturado.
```sql
SELECT ROUND(SUM(valor_liquido) / COUNT(DISTINCT numero_pedido), 2) AS ticket_medio
FROM f_vendas
WHERE status_pedido = 'Faturado';
```

---

## 2. Análise Temporal & Sazonalidade (Mensal / Trimestral)

### 2.1 Faturamento Mensal vs Meta vs Margem
```sql
SELECT 
    c.ano,
    c.mes,
    c.nome_mes,
    ROUND(SUM(v.valor_liquido), 2) AS faturamento_real,
    ROUND(AVG(m.meta_faturamento), 2) AS meta_faturamento,
    ROUND((SUM(v.margem_contribuicao_valor) / SUM(v.valor_liquido)) * 100, 2) AS margem_pct,
    COUNT(DISTINCT v.numero_pedido) AS total_pedidos
FROM f_vendas v
JOIN d_calendario c ON v.data_id = c.data_id
LEFT JOIN (
    SELECT ano, mes, SUM(meta_faturamento) AS meta_faturamento
    FROM f_metas
    GROUP BY ano, mes
) m ON c.ano = m.ano AND c.mes = m.mes
WHERE v.status_pedido = 'Faturado' AND c.ano = 2025
GROUP BY c.ano, c.mes, c.nome_mes
ORDER BY c.mes;
```

---

## 3. Curva ABC de Produtos (Princípio de Pareto 80/20)

Classifica os produtos pela participação acumulada no faturamento:
* **Classe A:** Até 80% da receita acumulada (produtos mais críticos).
* **Classe B:** De 80% a 95% da receita acumulada.
* **Classe C:** De 95% a 100% da receita acumulada.

```sql
WITH receita_por_produto AS (
    SELECT 
        p.produto_id,
        p.sku,
        p.nome_produto,
        p.categoria,
        ROUND(SUM(v.valor_liquido), 2) AS receita,
        ROUND(AVG(v.margem_contribuicao_pct), 2) AS margem_media_pct,
        SUM(v.quantidade) AS volume_total
    FROM f_vendas v
    JOIN d_produtos p ON v.produto_id = p.produto_id
    WHERE v.status_pedido = 'Faturado'
    GROUP BY p.produto_id, p.sku, p.nome_produto, p.categoria
),
total_geral AS (
    SELECT SUM(receita) AS receita_total FROM receita_por_produto
),
acumulado AS (
    SELECT 
        r.*,
        ROUND((r.receita / t.receita_total) * 100, 2) AS share_pct,
        ROUND(SUM(r.receita) OVER (ORDER BY r.receita DESC) / t.receita_total * 100, 2) AS share_acumulado_pct
    FROM receita_por_produto r, total_geral t
)
SELECT 
    *,
    CASE 
        WHEN share_acumulado_pct <= 80 THEN 'A'
        WHEN share_acumulado_pct <= 95 THEN 'B'
        ELSE 'C'
    END AS classe_abc_dinamica
FROM acumulado
ORDER BY receita DESC;
```

---

## 4. Ranking de Representantes & Atingimento de Quota

```sql
SELECT 
    vend.nome_vendedor,
    vend.regional,
    ROUND(SUM(v.valor_liquido), 2) AS faturado,
    ROUND(SUM(m.meta_faturamento), 2) AS meta_quota,
    ROUND((SUM(v.valor_liquido) / NULLIF(SUM(m.meta_faturamento), 0)) * 100, 2) AS atingimento_meta_pct,
    COUNT(DISTINCT v.numero_pedido) AS total_pedidos,
    ROUND(SUM(v.valor_liquido) / COUNT(DISTINCT v.numero_pedido), 2) AS ticket_medio,
    ROUND(AVG(v.margem_contribuicao_pct), 2) AS margem_media_pct
FROM f_vendas v
JOIN d_vendedores vend ON v.vendedor_id = vend.vendedor_id
LEFT JOIN f_metas m ON v.vendedor_id = m.vendedor_id AND v.data_id / 100 = m.data_id / 100
WHERE v.status_pedido = 'Faturado'
GROUP BY vend.nome_vendedor, vend.regional
ORDER BY faturado DESC;
```

---

## 5. Performance por Canal de Venda

```sql
SELECT 
    c.nome_canal,
    c.tipo_canal,
    ROUND(SUM(v.valor_liquido), 2) AS faturamento,
    ROUND((SUM(v.valor_liquido) / (SELECT SUM(valor_liquido) FROM f_vendas WHERE status_pedido = 'Faturado')) * 100, 2) AS share_canal_pct,
    ROUND(AVG(v.margem_contribuicao_pct), 2) AS margem_media_pct,
    COUNT(DISTINCT v.numero_pedido) AS total_pedidos,
    ROUND(SUM(v.valor_liquido) / COUNT(DISTINCT v.numero_pedido), 2) AS ticket_medio
FROM f_vendas v
JOIN d_canais c ON v.canal_id = c.canal_id
WHERE v.status_pedido = 'Faturado'
GROUP BY c.nome_canal, c.tipo_canal
ORDER BY faturamento DESC;
```
