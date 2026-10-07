-- ============================================================================
-- PROJETO: Sales BI & AI Copilot
-- MODELAGEM: Star Schema Dimensional (Kimball Methodology)
-- DIALETO: SQL / DuckDB / PostgreSQL Compatible
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. DIMENSÃO CALENDÁRIO (d_calendario)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS d_calendario (
    data_id INT PRIMARY KEY,              -- Formato YYYYMMDD (ex: 20250115)
    data DATE NOT NULL,
    ano INT NOT NULL,
    mes INT NOT NULL,
    nome_mes VARCHAR(20) NOT NULL,
    mes_ano VARCHAR(10) NOT NULL,        -- Formato Jan/2025
    trimestre VARCHAR(5) NOT NULL,        -- Formato Q1, Q2, etc.
    semestre VARCHAR(5) NOT NULL,         -- Formato S1, S2
    dia_semana VARCHAR(20) NOT NULL,
    dia_util BOOLEAN NOT NULL
);

-- ----------------------------------------------------------------------------
-- 2. DIMENSÃO PRODUTOS (d_produtos)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS d_produtos (
    produto_id INT PRIMARY KEY,
    sku VARCHAR(30) UNIQUE NOT NULL,
    nome_produto VARCHAR(120) NOT NULL,
    categoria VARCHAR(50) NOT NULL,       -- Software, Serviços, Cloud, Hardware
    subcategoria VARCHAR(50) NOT NULL,
    preco_tabela DECIMAL(12,2) NOT NULL,
    custo_base DECIMAL(12,2) NOT NULL,
    margem_alvo_pct DECIMAL(5,2) NOT NULL,
    classe_abc VARCHAR(2) NOT NULL        -- 'A', 'B', 'C'
);

-- ----------------------------------------------------------------------------
-- 3. DIMENSÃO VENDEDORES (d_vendedores)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS d_vendedores (
    vendedor_id INT PRIMARY KEY,
    nome_vendedor VARCHAR(100) NOT NULL,
    regional VARCHAR(50) NOT NULL,        -- Sudeste, Sul, Nordeste, Centro-Oeste
    cargo VARCHAR(50) NOT NULL,          -- Account Executive, SDR, Sales Manager
    data_admissao DATE NOT NULL,
    email VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'Ativo'
);

-- ----------------------------------------------------------------------------
-- 4. DIMENSÃO CLIENTES (d_clientes)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS d_clientes (
    cliente_id INT PRIMARY KEY,
    razao_social VARCHAR(150) NOT NULL,
    segmento VARCHAR(60) NOT NULL,        -- Tecnologia, Varejo, Financeiro, Indústria, Saúde
    porte VARCHAR(30) NOT NULL,           -- Enterprise, Mid-Market, SMB
    estado VARCHAR(2) NOT NULL,           -- SP, RJ, PR, RS, BA, MG, etc.
    regiao VARCHAR(30) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 5. DIMENSÃO CANAIS (d_canais)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS d_canais (
    canal_id INT PRIMARY KEY,
    nome_canal VARCHAR(50) NOT NULL,      -- B2B Enterprise, E-commerce Direto, Canais & Parceiros, Grandes Contas
    tipo_canal VARCHAR(30) NOT NULL       -- Direto, Indireto, Digital
);

-- ----------------------------------------------------------------------------
-- 6. FATO METAS (f_metas)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS f_metas (
    meta_id INT PRIMARY KEY,
    ano INT NOT NULL,
    mes INT NOT NULL,
    data_id INT NOT NULL,
    vendedor_id INT,
    regional VARCHAR(50),
    canal_id INT,
    meta_faturamento DECIMAL(14,2) NOT NULL,
    meta_pedidos INT NOT NULL,
    meta_margem_pct DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (vendedor_id) REFERENCES d_vendedores(vendedor_id),
    FOREIGN KEY (canal_id) REFERENCES d_canais(canal_id)
);

-- ----------------------------------------------------------------------------
-- 7. FATO VENDAS (f_vendas) - Granularidade: Item de Pedido
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS f_vendas (
    venda_id BIGINT PRIMARY KEY,
    numero_pedido VARCHAR(30) NOT NULL,
    data_id INT NOT NULL,
    produto_id INT NOT NULL,
    vendedor_id INT NOT NULL,
    cliente_id INT NOT NULL,
    canal_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario_praticado DECIMAL(12,2) NOT NULL,
    valor_bruto DECIMAL(14,2) NOT NULL,
    valor_desconto DECIMAL(12,2) NOT NULL,
    valor_liquido DECIMAL(14,2) NOT NULL,       -- Faturamento real
    custo_total DECIMAL(14,2) NOT NULL,
    margem_contribuicao_valor DECIMAL(14,2) NOT NULL, -- Lucro bruto / Margem
    margem_contribuicao_pct DECIMAL(6,2) NOT NULL,    -- Margem %
    status_pedido VARCHAR(30) NOT NULL,        -- Faturado, Cancelado, Devolvido
    FOREIGN KEY (data_id) REFERENCES d_calendario(data_id),
    FOREIGN KEY (produto_id) REFERENCES d_produtos(produto_id),
    FOREIGN KEY (vendedor_id) REFERENCES d_vendedores(vendedor_id),
    FOREIGN KEY (cliente_id) REFERENCES d_clientes(cliente_id),
    FOREIGN KEY (canal_id) REFERENCES d_canais(canal_id)
);

-- Índices de Performance Analítica
CREATE INDEX IF NOT EXISTS idx_f_vendas_data ON f_vendas(data_id);
CREATE INDEX IF NOT EXISTS idx_f_vendas_prod ON f_vendas(produto_id);
CREATE INDEX IF NOT EXISTS idx_f_vendas_vend ON f_vendas(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_f_vendas_canal ON f_vendas(canal_id);
CREATE INDEX IF NOT EXISTS idx_f_vendas_cli ON f_vendas(cliente_id);
