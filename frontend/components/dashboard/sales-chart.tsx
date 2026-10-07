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
import { Sparkles, TrendingUp, TrendingDown, Cpu, Activity } from "lucide-react";

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
    aiInsight = `⚡ Pico de performance (+${delta.toFixed(1)}% vs meta). Tração expressiva impulsionada pelo canal B2B Enterprise e produtos Classe A.`;
  } else if (isSuperou) {
    aiInsight = `🎯 Meta superada com margem sólida de ${item.margin}%. O volume de ${item.orders} pedidos manteve o ticket médio alto.`;
  } else {
    aiInsight = `⚠️ Leve gap de ${Math.abs(delta).toFixed(1)}% contra a meta orçada. Margem de ${item.margin}% permaneceu equilibrada.`;
  }

  return (
    <div className="relative z-50 min-w-[290px] rounded-2xl p-4 bg-[#070d1a]/95 backdrop-blur-xl border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.25)] text-slate-100 font-sans">
      {/* Glow corner effects */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-600/10 rounded-full blur-xl pointer-events-none" />

      {/* Header do Agente IA */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-cyan-500/20 text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          <span className="font-semibold tracking-wider uppercase text-[10px]">AI Copilot • Telemetria</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>DuckDB Real-time</span>
        </div>
      </div>

      {/* Título do Período */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Competência</span>
          <h4 className="text-base font-bold text-white tracking-tight">{item.month} / 2025</h4>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border ${
            isSuperou
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              : "bg-amber-500/20 text-amber-300 border-amber-500/40"
          }`}
        >
          {isSuperou ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isSuperou ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`}
        </span>
      </div>

      {/* Grid de Métricas HUD */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
          <p className="text-[10px] text-slate-400 font-mono">Faturamento</p>
          <p className="font-bold text-cyan-300 text-sm mt-0.5">{formatCurrency(item.revenue)}</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
          <p className="text-[10px] text-slate-400 font-mono">Meta Orçada</p>
          <p className="font-bold text-amber-300 text-sm mt-0.5">{formatCurrency(item.target)}</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
          <p className="text-[10px] text-slate-400 font-mono">Margem Realizada</p>
          <p className="font-bold text-emerald-300 text-sm mt-0.5">{item.margin}%</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
          <p className="text-[10px] text-slate-400 font-mono">Pedidos Faturados</p>
          <p className="font-bold text-slate-200 text-sm mt-0.5">{item.orders.toLocaleString("pt-BR")}</p>
        </div>
      </div>

      {/* Micro-insight do Agente de IA */}
      <div className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-blue-950/40 border border-cyan-500/30 text-[11px] leading-relaxed text-slate-200">
        <p className="flex items-start gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
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
    <div className="glass-panel rounded-xl p-6 border border-slate-800 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
            <h2 className="text-lg font-semibold text-white tracking-tight">
              Evolução Mensal: Faturamento x Meta x Margem
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300">
              <Sparkles className="w-2.5 h-2.5" /> AI Tooltips Ativos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Passe o cursor sobre os meses para visualizar a telemetria executiva e diagnósticos do Copilot.
          </p>
        </div>

        {/* Filtros de Trimestre */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-lg border border-slate-800 text-xs">
          {["Todos", "Q1", "Q2", "Q3", "Q4"].map((q) => (
            <button
              type="button"
              key={q}
              onClick={() => setSelectedQuarter(q)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                selectedQuarter === q
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[380px] w-full min-h-[380px] relative">
        {!mounted ? (
          <div className="h-full w-full flex items-center justify-center text-xs text-slate-500">
            Carregando gráfico...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={380}>
            <ComposedChart data={filteredData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.45} />
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
              <Tooltip content={<AiFuturisticSalesTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} iconType="circle" />
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
        )}
      </div>
    </div>
  );
}
