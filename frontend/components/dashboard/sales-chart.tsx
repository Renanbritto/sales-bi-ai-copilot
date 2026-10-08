"use client";

import React, { useState, useEffect } from "react";
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
import {
  Cpu,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";

interface SalesChartProps {
  data: MonthlyItem[];
}

// Tooltip Futurista de Agente de IA para o Gráfico
function AiFuturisticSalesTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0].payload as MonthlyItem;
  const delta = item.target > 0 ? ((item.revenue - item.target) / item.target) * 100 : 0;
  const isSuperou = delta >= 0;

  // Insight dinâmico gerado pelo agente para o mês
  let aiInsight = "";
  if (isSuperou && delta > 15) {
    aiInsight = `Pico de performance (+${delta.toFixed(1)}% vs meta). Tração expressiva impulsionada pelo canal B2B Enterprise e produtos Classe A.`;
  } else if (isSuperou) {
    aiInsight = `Meta superada com margem sólida de ${item.margin}%. O volume de ${item.orders} pedidos manteve o ticket médio alto.`;
  } else {
    aiInsight = `Leve gap de ${Math.abs(delta).toFixed(1)}% contra a meta orçada. Margem de ${item.margin}% permaneceu equilibrada.`;
  }

  return (
    <div className="relative z-50 min-w-[300px] rounded-2xl p-4 bg-white/98 backdrop-blur-2xl border border-slate-200 shadow-xl shadow-black/5 text-slate-700 font-sans">
      {/* Glow corner effects */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-600/10 rounded-full blur-xl pointer-events-none" />

      

      {/* Título do Período */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Competência</span>
          <h4 className="text-base font-bold text-slate-700 tracking-tight">{item.month} / 2025</h4>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border ${
            isSuperou
              ? "bg-emerald-500/20 text-teal-700 border-emerald-500/40"
              : "bg-amber-500/20 text-slate-700 border-amber-500/40"
          }`}
        >
          {isSuperou ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isSuperou ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`}
        </span>
      </div>

      {/* Grid de Métricas HUD */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-200">
          <p className="text-[10px] text-slate-500 font-mono">Faturamento</p>
          <p className="font-bold text-blue-700 text-sm mt-0.5">{formatCurrency(item.revenue)}</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-200">
          <p className="text-[10px] text-slate-500 font-mono">Meta Orçada</p>
          <p className="font-bold text-slate-700 text-sm mt-0.5">{formatCurrency(item.target)}</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-200">
          <p className="text-[10px] text-slate-500 font-mono">Margem Realizada</p>
          <p className="font-bold text-teal-700 text-sm mt-0.5">{item.margin}%</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-200">
          <p className="text-[10px] text-slate-500 font-mono">Pedidos Faturados</p>
          <p className="font-bold text-slate-700 text-sm mt-0.5">{item.orders.toLocaleString("pt-BR")}</p>
        </div>
      </div>

      {/* Micro-insight do Agente de IA */}
      <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-50/50 to-slate-50 border border-slate-200 text-[11px] leading-relaxed text-slate-700">
        <p className="flex items-start gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
          <span>{aiInsight}</span>
        </p>
      </div>
    </div>
  );
}

export function SalesChart({ data }: SalesChartProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState<string>("Todos");

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredData = data.filter((d) => {
    if (selectedQuarter === "Q1") return [1, 2, 3].includes(d.mes);
    if (selectedQuarter === "Q2") return [4, 5, 6].includes(d.mes);
    if (selectedQuarter === "Q3") return [7, 8, 9].includes(d.mes);
    if (selectedQuarter === "Q4") return [10, 11, 12].includes(d.mes);
    return true;
  });

  return (
    <div className="glass-panel rounded-xl p-6 border border-slate-200 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-700 tracking-tight">
              Evolução Temporal: Faturamento vs Metas & Margem
            </h2>
            
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Série histórica de 12 meses com linha de tendência orçada e percentual de margem de contribuição.
          </p>
        </div>

        {/* Filtros de Trimestre (Quarter) */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden md:inline">Trimestre:</span>
          <div className="flex p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
            {["Todos", "Q1", "Q2", "Q3", "Q4"].map((q) => (
              <button
                type="button"
                key={q}
                onClick={() => setSelectedQuarter(q)}
                className={`px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer ${
                  selectedQuarter === q
                    ? "bg-blue-500/20 text-blue-700 border border-blue-500/40 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-mono text-blue-700">
            <Activity className="w-2.5 h-2.5 text-blue-600" /> Telemetria Ativa
          </div>
        </div>
      </div>

      <div className="h-[380px] w-full">
        {!mounted ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs">
            <span className="w-2 h-2 rounded-full bg-blue-400 mr-2" />
            Carregando telemetria gráfica...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={filteredData}
              margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="marginGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f766e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0f766e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
              />
              <YAxis
                yAxisId="left"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
                tickFormatter={(val) => `R$ ${val.toLocaleString("pt-BR")}`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}%`}
                domain={[30, 60]}
              />

              {/* Tooltip Futurista de IA */}
              <Tooltip
                content={<AiFuturisticSalesTooltip />}
                cursor={{ stroke: "#3b82f6", strokeWidth: 1.5, strokeDasharray: "4 4" }}
              />

              <Legend
                wrapperStyle={{ paddingTop: 16 }}
                formatter={(val) => (
                  <span className="text-xs text-slate-700 font-medium mr-4">
                    {val === "revenue"
                      ? "Faturamento Realizado (R$)"
                      : val === "target"
                      ? "Meta Orçada (R$)"
                      : "Margem de Contribuição (%)"}
                  </span>
                )}
              />

              <Bar
                yAxisId="left"
                dataKey="revenue"
                fill="url(#revenueGrad)"
                radius={[6, 6, 0, 0]}
                barSize={28}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="target"
                stroke="#64748b"
                strokeWidth={2.5}
                dot={{ fill: "#f59e0b", r: 4 }}
                strokeDasharray="4 4"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="margin"
                stroke="#0f766e"
                strokeWidth={2}
                fill="url(#marginGrad)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
