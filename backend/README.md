# 🚀 Backend da API & AI Copilot (FastAPI + DuckDB + Gemini)

API analítica de alto desempenho construída em **FastAPI** com motor OLAP **DuckDB** e Agente de IA Conversacional integrado ao **Google Gemini**.

---

## 🛠️ Tecnologias Utilizadas

* **Python 3.11+**
* **FastAPI:** Framework web assíncrono para construção de APIs REST de alta performance.
* **DuckDB:** Banco de dados analítico colunar embutido (processa agregações e agrupamentos em memória com velocidade extrema).
* **Google Gemini SDK (`google-genai`):** LLM de última geração para tradução de linguagem natural em SQL analítico (**Text-to-SQL**) e síntese executiva.
* **Pydantic v2 & Pydantic-Settings:** Validação estrita de contratos de dados e variáveis de ambiente.

---

## ⚙️ Variáveis de Ambiente (`.env`)

Crie um arquivo `.env` dentro da pasta `backend/` a partir do `.env.example`:

```bash
# Google Gemini API Key (Obtenha gratuitamente em https://aistudio.google.com)
GEMINI_API_KEY=sua_chave_aqui
GEMINI_MODEL=gemini-2.0-flash

# Caminho para o banco DuckDB
DUCKDB_PATH=../data/sales.duckdb
```

> **Nota:** Se nenhuma chave `GEMINI_API_KEY` for configurada, a API ativa automaticamente o **Modo Fallback Analítico Inteligente**, respondendo com consultas analíticas reais no DuckDB sem quebrar o sistema.

---

## 🏃 Como Executar

```bash
# 1. Ativar o ambiente virtual (opcional, mas recomendado)
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# ou no Windows:
.\.venv\Scriptsctivate

# 2. Instalar dependências
pip install -r requirements.txt

# 3. Iniciar a API
uvicorn app.main:app --reload --port 8000
```

Acesse a documentação interativa Swagger em: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📡 Endpoints Disponíveis

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/` | Informações de status e caminho do DuckDB |
| `GET` | `/health` | Health check da API |
| `GET` | `/api/v1/analytics/kpis` | Resumo executivo (Faturamento, Margem, Pedidos, Ticket Médio) |
| `GET` | `/api/v1/analytics/monthly?year=2025` | Performance mensal (Faturamento x Meta x Margem) |
| `GET` | `/api/v1/analytics/pareto` | Curva ABC de produtos e participação percentual |
| `GET` | `/api/v1/analytics/reps` | Ranking de vendedores e atingimento de quota |
| `GET` | `/api/v1/analytics/channels` | Desempenho e margem por canal comercial |
| `POST` | `/api/v1/chat` | Mensagem para o Copilot de IA com retorno de SQL e dados |
