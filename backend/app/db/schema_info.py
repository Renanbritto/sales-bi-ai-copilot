from app.db.session import get_duckdb_connection

def get_database_schema_context() -> str:
    con = get_duckdb_connection(read_only=True)
    try:
        tables = con.execute("SHOW TABLES;").fetchall()
        table_names = [t[0] for t in tables]
        
        schema_lines = [
            "### MODELO DIMENSIONAL STAR SCHEMA (DuckDB):",
            "Tabelas disponíveis no banco de dados:",
        ]
        
        for tname in table_names:
            cols = con.execute(f"DESCRIBE {tname};").fetchall()
            col_desc = ", ".join([f"{c[0]} ({c[1]})" for c in cols])
            schema_lines.append(f"- **{tname}**: {col_desc}")
            
        schema_lines.extend([
            "",
            "### REGRAS DE NEGÓCIO E RELACIONAMENTOS:",
            "1. `f_vendas` é a tabela fato principal com as transações comerciais.",
            "   - `data_id` relaciona com `d_calendario.data_id` (formato YYYYMMDD).",
            "   - `produto_id` relaciona com `d_produtos.produto_id`.",
            "   - `vendedor_id` relaciona com `d_vendedores.vendedor_id`.",
            "   - `cliente_id` relaciona com `d_clientes.cliente_id`.",
            "   - `canal_id` relaciona com `d_canais.canal_id`.",
            "2. Métricas monetárias:",
            "   - Receita líquida faturada: `SUM(valor_liquido)` onde `status_pedido = 'Faturado'`.",
            "   - Lucro bruto / Margem em R$: `SUM(margem_contribuicao_valor)`.",
            "   - Margem de Contribuição %: `ROUND((SUM(margem_contribuicao_valor) / SUM(valor_liquido)) * 100, 2)`.",
            "   - Ticket Médio: `ROUND(SUM(valor_liquido) / COUNT(DISTINCT numero_pedido), 2)`.",
            "3. Metas: tabela `f_metas` possui `meta_faturamento` por vendedor e mês.",
            "4. Produtos: `classe_abc` é 'A', 'B' ou 'C'.",
            "5. Vendedores: Beatriz Silveira (Sudeste), Carlos Eduardo Mendes (Sul), Mariana Albuquerque (Sudeste), Lucas Fontes (Nordeste), Fernanda Rocha (Centro-Oeste).",
        ])
        return "\n".join(schema_lines)
    finally:
        con.close()
