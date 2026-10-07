import React, { useState } from "react";
import {
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { MonthlyItem } from "@/lib/api";
import { Calendar, Filter } from "lucide-react";

interface SalesChartProps {
  data: MonthlyItem[];
}

export function SalesChart({ data }: SalesChartProps) {
  const [selectedQuarter, setSelectedQuarter] = useState<string>("Todos");

  const filteredData = data.filter((d) => {
    if (selectedQuarter === "Q1") return [1, 2, 3].includes(d.mes);
    if (selectedQuarter === "Q2") return [4, 5, 6].includes(d.mes);
    if (selectedQuarter === "Q3") return [7, 8, 9].includes(d.mes);
    if (selectedQuarter === "Q4") return [10, 11, 12].includes(d.mes);
    return true;
  });

  return (
    <div className="glass-panel rounded-xl p-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-lg font-semibold text-white">Evolução Mensal: Faturamento x Meta x Margem</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Análise temporal agregada diretamente do DuckDB com acompanhamento de margem de contribuição.
          </p>
        </div>

        {/* Filtros de Trimestre */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-lg border border-slate-800 text-xs">
          {["Todos", "Q1", "Q2", "Q3", "Q4"].map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuarter(q)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                selectedQuarter === q
                  ? "bg-cyan-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis
              yAxisId="left"
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={(v) => `R$ ${(v / 1000000).toFixed(1)}M`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={(v) => `${v}%`}
              domain={[30, 55]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as MonthlyItem;
                  return (
                    <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1.5">
                      <p className="font-semibold text-slate-200 border-b border-slate-800 pb-1">{item.month} - 2025</p>
                      <p className="text-cyan-400">Faturamento: {formatCurrency(item.revenue)}</p>
                      <p className="text-amber-400">Meta Orçada: {formatCurrency(item.target)}</p>
                      <p className="text-emerald-400">Margem: {item.margin}%</p>
                      <p className="text-slate-400">Pedidos: {item.orders}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
              iconType="circle"
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              name="Faturamento Real"
              fill="url(#colorRevenue)"
              stroke="#0ea5e9"
              strokeWidth={2.5}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="target"
              name="Meta Orçada"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="margin"
              name="Margem de Contribuição %"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ fill: "#10b981", r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
