# 💻 Frontend - Sales BI & AI Copilot

Aplicação web executiva construída em **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS** e **Recharts**, com painel conversacional integrado ao **AI Copilot (Google Gemini)**.

---

## 🌟 Funcionalidades

* **Painel Executivo Comercial:** Indicadores de Faturamento Líquido, Margem de Contribuição R$ e %, Pedidos Faturados e Ticket Médio.
* **Evolução Temporal:** Gráfico Composto (Receita vs Meta Orçada vs Margem de Contribuição) com filtro por trimestre.
* **Funil de Vendas B2B:** Pipeline comercial de 5 etapas com taxas de conversão de ponta a ponta.
* **Curva ABC (Pareto 80/20):** Segmentação de produtos em classes A, B e C com participação acumulada de receita.
* **Leaderboard de Representantes:** Ranking de vendedores com atingimento de quota e gráfico Radar Multidimensional por região.
* **AI Copilot Sidebar:** Chat conversacional executivo com **inspetor de código SQL DuckDB** e tempo de resposta em milissegundos.
* **Fallback Local Resiliente:** A interface carrega dados analíticos pré-calculados mesmo se a API estiver desconectada.

---

## 🚀 Como Executar

```bash
# 1. Instalar dependências
npm install

# 2. Executar em modo desenvolvimento
npm run dev
```

Abra no navegador em: [http://localhost:3000](http://localhost:3000)
