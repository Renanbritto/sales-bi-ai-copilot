# 📊 Sales BI & AI Copilot

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![DuckDB](https://img.shields.io/badge/DuckDB-OLAP-FFF000?style=for-the-badge&logo=duckdb&logoColor=black)](https://duckdb.org)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.0_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Power BI](https://img.shields.io/badge/Power_BI-Star_Schema-F2C811?style=for-the-badge&logo=powerbi&logoColor=black)](https://powerbi.microsoft.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> Plataforma analítica moderna de **Business Intelligence Comercial & Vendas** integrada a um **Copilot de Inteligência Artificial Conversacional (Google Gemini)** com motor analítico colunar **DuckDB**.

---

## 🎯 Visão Geral do Projeto

Este repositório apresenta uma solução analítica corporativa completa (End-to-End Modern Data Stack) inspirada em necessidades reais de diretorias comerciais:

1. **Modelagem Dimensional Star Schema:** Fato Vendas conectada a 4 dimensões (Calendário, Produtos, Vendedores, Clientes) e Fato Metas.
2. **Motor Analítico Colunar de Alta Velocidade (DuckDB):** Processamento OLAP em memória capaz de agregar milhões de registros em milissegundos.
3. **Agente de IA Conversacional (Text-to-SQL & Analytics Copilot):** Assistente executivo integrado ao **Google Gemini** que traduz linguagem natural em queries SQL executadas com precisão na base de dados, prevenindo alucinações.
4. **Dashboard Executivo Interativo (Next.js & Recharts):** Interface web executiva com KPIs de faturamento, margem, funil B2B, curva ABC (Pareto) e ranking de representantes.
5. **Power BI Ready:** Modelagem e catálogo de medidas DAX prontas para replicação em relatórios corporativos.

---

## 🏛️ Arquitetura da Solução

`mermaid
flowchart TD
    subgraph Data_Layer [Camada de Dados & Modelagem]
        RAW[Dataset Sintético Realista (15k+ Vendas)] --> ETL[ETL / Seed Script (Python)]
        ETL --> DUCK[DuckDB OLAP (sales.duckdb)]
        ETL --> PBI[Export Parquet / CSV (Power BI)]
    end

    subgraph Backend_Layer [Backend & AI Engine (FastAPI)]
        DUCK --> SQL_EXEC[DuckDB Safe Executor (Read-Only)]
        SQL_EXEC <--> TOOLS[Analytical Tools (Text-to-SQL)]
        TOOLS <--> AGENT[Gemini AI Agent (System Prompt & Schema)]
        AGENT <--> API[FastAPI Endpoints (/analytics, /chat)]
    end

    subgraph Frontend_Layer [Frontend Executivo (Next.js 14)]
        API <--> DASH[Dashboard Executivo Interativo]
        API <--> COPILOT[Painel do AI Copilot (Chat Lateral)]
    end
`

---

## 📁 Estrutura do Repositório

`	ext
sales-bi-ai-copilot/
├── backend/                  # API REST em FastAPI + DuckDB + Agente Gemini
│   ├── app/
│   │   ├── agent/            # Motor do Agente de IA, Prompts e Tools
│   │   ├── api/              # Endpoints de Analytics e Chat
│   │   ├── core/             # Configurações de ambiente e segurança
│   │   ├── db/               # Sessão DuckDB e Introspecção de Schema
│   │   └── main.py           # Ponto de entrada FastAPI
│   └── requirements.txt
├── data-pipeline/            # Scripts de geração de dados e Star Schema
│   ├── generate_dataset.py   # Gerador de dados com sazonalidade e regras de negócio
│   ├── star_schema_ddl.sql   # DDL SQL das tabelas fato e dimensões
│   └── dax_measures.md       # Catálogo com mais de 15 medidas DAX documentadas
├── frontend/                 # Aplicação Next.js (Dashboard + Copilot)
│   ├── app/                  # Rotas e páginas (App Router)
│   ├── components/           # Componentes visuais do Dashboard e Chat
│   └── package.json
├── powerbi/                  # Recursos e documentação para Power BI
│   ├── data_dictionary.md    # Dicionário de dados
│   └── README.md             # Guia de modelagem e conexão
├── .gitignore
├── LICENSE
└── README.md
`

---

## 🚀 Como Iniciar

Consulte os guias específicos dentro de cada diretório:
* Backend & AI Copilot: cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
* Frontend: cd frontend && npm install && npm run dev
* Pipeline de Dados: cd data-pipeline && python generate_dataset.py

---

## 👨‍💻 Autor

**Renan Nocelli Britto**
* Portfólio: [renan-nocelli.vercel.app](https://renan-nocelli.vercel.app)
* GitHub: [@Renanbritto](https://github.com/Renanbritto)
* LinkedIn: [linkedin.com/in/renan-nocelli](https://linkedin.com/in/renan-nocelli)
