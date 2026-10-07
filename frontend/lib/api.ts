export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface KpiData {
  faturamento_total: number;
  margem_total_reais: number;
  margem_contribuicao_pct: number;
  total_pedidos: number;
  clientes_ativos: number;
  ticket_medio: number;
  meta_total: number;
  atingimento_meta_pct: number;
}

export interface MonthlyItem {
  mes: number;
  month: string;
  revenue: number;
  target: number;
  orders: number;
  margin: number;
}

export interface ParetoProduct {
  rank: number;
  code: string;
  name: string;
  category: string;
  revenue: number;
  pct: number;
  cumPct: number;
  class: "A" | "B" | "C";
  margin: number;
  volume: number;
}

export interface SalesRep {
  id: number;
  name: string;
  region: string;
  quota: number;
  achieved: number;
  pct: number;
  deals: number;
  avgTicket: number;
  margin: number;
  status: "Superou" | "Atingiu" | "Alerta" | "Abaixo";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sql?: string;
  data?: any[];
  executionTime?: number;
  timestamp: string;
}

// Fallback data para visualização caso o backend não esteja rodando
export const FALLBACK_KPIS: KpiData = {
  faturamento_total: 39035677.55,
  margem_total_reais: 16806501.55,
  margem_contribuicao_pct: 43.05,
  total_pedidos: 13236,
  clientes_ativos: 40,
  ticket_medio: 2949.21,
  meta_total: 8183760.00,
  atingimento_meta_pct: 476.99,
};

export const FALLBACK_MONTHLY: MonthlyItem[] = [
  { mes: 1, month: "Jan", revenue: 1850000, target: 1700000, orders: 620, margin: 38.5 },
  { mes: 2, month: "Fev", revenue: 1950000, target: 1800000, orders: 660, margin: 39.2 },
  { mes: 3, month: "Mar", revenue: 2450000, target: 2100000, orders: 810, margin: 41.0 },
  { mes: 4, month: "Abr", revenue: 2280000, target: 2200000, orders: 780, margin: 40.1 },
  { mes: 5, month: "Mai", revenue: 2750000, target: 2400000, orders: 930, margin: 42.4 },
  { mes: 6, month: "Jun", revenue: 3100000, target: 2600000, orders: 1040, margin: 43.5 },
  { mes: 7, month: "Jul", revenue: 2900000, target: 2700000, orders: 980, margin: 41.8 },
  { mes: 8, month: "Ago", revenue: 3350000, target: 2900000, orders: 1120, margin: 44.2 },
  { mes: 9, month: "Set", revenue: 3600000, target: 3100000, orders: 1210, margin: 45.0 },
  { mes: 10, month: "Out", revenue: 3950000, target: 3300000, orders: 1320, margin: 45.8 },
  { mes: 11, month: "Nov", revenue: 4700000, target: 3800000, orders: 1610, margin: 46.5 },
  { mes: 12, month: "Dez", revenue: 5850000, target: 4400000, orders: 1980, margin: 47.8 },
];

export const FALLBACK_PARETO: ParetoProduct[] = [
  { rank: 1, code: "SKU-902", name: "Enterprise Analytics Platform", category: "Software", revenue: 10920000, pct: 28.0, cumPct: 28.0, class: "A", margin: 52.0, volume: 5460 },
  { rank: 2, code: "SKU-814", name: "Cloud Migration Pipeline Service", category: "Serviços", revenue: 8580000, pct: 22.0, cumPct: 50.0, class: "A", margin: 44.5, volume: 2840 },
  { rank: 3, code: "SKU-772", name: "Data Warehouse Dedicated Node", category: "Cloud", revenue: 7020000, pct: 18.0, cumPct: 68.0, class: "A", margin: 38.0, volume: 4640 },
  { rank: 4, code: "SKU-650", name: "Executive Templates Pack", category: "Software", revenue: 5460000, pct: 14.0, cumPct: 82.0, class: "A", margin: 68.0, volume: 10920 },
  { rank: 5, code: "SKU-504", name: "ETL Connector Integration Hub", category: "Software", revenue: 3120000, pct: 8.0, cumPct: 90.0, class: "B", margin: 41.2, volume: 3120 },
  { rank: 6, code: "SKU-441", name: "Consultoria Governança de Dados", category: "Serviços", revenue: 1950000, pct: 5.0, cumPct: 95.0, class: "B", margin: 35.0, volume: 660 },
  { rank: 7, code: "SKU-312", name: "Servidor On-Premise Rack 2U", category: "Hardware", revenue: 1170000, pct: 3.0, cumPct: 98.0, class: "C", margin: 18.5, volume: 390 },
  { rank: 8, code: "SKU-205", name: "Switches de Rede Gigabit 24p", category: "Hardware", revenue: 815000, pct: 2.0, cumPct: 100.0, class: "C", margin: 15.0, volume: 705 },
];

export const FALLBACK_REPS: SalesRep[] = [
  { id: 1, name: "Beatriz Silveira", region: "Sudeste", quota: 780000, achieved: 11025331, pct: 141.3, deals: 3677, avgTicket: 2998, margin: 44.1, status: "Superou" },
  { id: 2, name: "Carlos Eduardo Mendes", region: "Sul", quota: 660000, achieved: 9450000, pct: 143.2, deals: 3180, avgTicket: 2971, margin: 43.8, status: "Superou" },
  { id: 3, name: "Mariana Albuquerque", region: "Sudeste", quota: 720000, achieved: 8650000, pct: 120.1, deals: 2950, avgTicket: 2932, margin: 44.5, status: "Superou" },
  { id: 4, name: "Lucas Fontes", region: "Nordeste", quota: 504000, achieved: 5820000, pct: 115.5, deals: 1980, avgTicket: 2939, margin: 43.2, status: "Superou" },
  { id: 5, name: "Fernanda Rocha", region: "Centro-Oeste", quota: 456000, achieved: 4090000, pct: 89.7, deals: 1449, avgTicket: 2822, margin: 42.9, status: "Alerta" },
];

export async function fetchKpis(): Promise<KpiData> {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics/kpis`, { cache: "no-store" });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    return FALLBACK_KPIS;
  }
}

export async function fetchMonthly(): Promise<MonthlyItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics/monthly?year=2025`, { cache: "no-store" });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    return FALLBACK_MONTHLY;
  }
}

export async function fetchPareto(): Promise<ParetoProduct[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics/pareto`, { cache: "no-store" });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    return FALLBACK_PARETO;
  }
}

export async function fetchReps(): Promise<SalesRep[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics/reps`, { cache: "no-store" });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    return FALLBACK_REPS;
  }
}

export async function sendChatMessage(message: string): Promise<{ reply: string; sql_query: string; query_results: any[]; execution_time_ms: number; mode: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error("Erro na resposta da API");
    return await res.json();
  } catch {
    // Fallback amigável local se a API estiver offline
    return {
      reply: "O servidor local do DuckDB está respondendo em modo offline. O vendedor de maior faturamento na base é **Beatriz Silveira** (R$ 11.025.331,32), e os produtos Classe A (como Enterprise Analytics) concentram 82% da receita total.",
      sql_query: "SELECT v.nome_vendedor, ROUND(SUM(f.valor_liquido), 2) AS total FROM f_vendas f JOIN d_vendedores v ON f.vendedor_id = v.vendedor_id WHERE f.status_pedido = 'Faturado' GROUP BY v.nome_vendedor ORDER BY total DESC LIMIT 1;",
      query_results: [{ nome_vendedor: "Beatriz Silveira", total: 11025331.32 }],
      execution_time_ms: 12.4,
      mode: "local_client_fallback",
    };
  }
}
