"use client";

import React from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Target,
  ArrowUpRight,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { KpiData } from "@/lib/api";

interface KpiSummaryProps {
  data: KpiData;
  onOpenCopilot?: (prompt?: string) => void;
}

export function KpiSummary({ data }: KpiSummaryProps) {
  const cards = [
    {
      id: 0,
      title: "Faturamento Líquido",
      value: formatCurrency(data.faturamento_total),
      subtext: "+18.4% YoY vs período anterior",
      badge: "Realizado",
      icon: DollarSign,
      glow: "from-cyan-500/10 via-transparent to-transparent",
      borderHover: "hover:border-cyan-500/40 hover:shadow-cyan-500/10",
      accent: "text-cyan-300",
      iconBox: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
      badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    },
    {
      id: 1,
      title: "Margem de Contribuição",
      value: `${data.margem_contribuicao_pct.toFixed(1)}%`,
      subtext: `${formatCurrency(data.margem_total_reais)} em margem bruta`,
      badge: "Meta: 40.0%",
      icon: TrendingUp,
      glow: "from-emerald-500/10 via-transparent to-transparent",
      borderHover: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
      accent: "text-emerald-300",
      iconBox: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    },
    {
      id: 2,
      title: "Volume de Pedidos",
      value: formatNumber(data.total_pedidos),
      subtext: `${data.clientes_ativos} clientes corporativos ativos`,
      badge: "Faturados",
      icon: ShoppingCart,
      glow: "from-sky-500/10 via-transparent to-transparent",
      borderHover: "hover:border-sky-500/40 hover:shadow-sky-500/10",
      accent: "text-sky-300",
      iconBox: "bg-sky-500/10 border-sky-500/20 text-sky-400",
      badgeColor: "bg-sky-500/10 text-sky-300 border-sky-500/20",
    },
    {
      id: 3,
      title: "Ticket Médio",
      value: formatCurrency(data.ticket_medio),
      subtext: `Atingimento: ${data.atingimento_meta_pct.toFixed(0)}% da meta`,
      badge: "Por Pedido",
      icon: Target,
      glow: "from-amber-500/10 via-transparent to-transparent",
      borderHover: "hover:border-amber-500/40 hover:shadow-amber-500/10",
      accent: "text-amber-300",
      iconBox: "bg-amber-500/10 border-amber-500/20 text-amber-400",
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
      {cards.map((c) => {
        const Icon = c.icon;

        return (
          <div
            key={c.id}
            className={`group relative rounded-2xl p-5 bg-[#0b0f1a]/95 backdrop-blur-xl border border-white/10 shadow-lg ${c.borderHover} transition-all duration-300 overflow-hidden hover:-translate-y-0.5`}
          >
            {/* Ambient subtle glow gradient */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${c.glow} rounded-full blur-2xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`}
            />

            {/* Cabeçalho do Card */}
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  {c.title}
                </p>
                <h3 className={`text-2xl sm:text-3xl font-mono font-extrabold tracking-tight ${c.accent} mt-1.5`}>
                  {c.value}
                </h3>
              </div>
              <div
                className={`p-2.5 rounded-xl border ${c.iconBox} shadow-sm shrink-0 transition-transform group-hover:scale-105`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* Subtexto e Badge */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs relative z-10">
              <span className="flex items-center gap-1 text-slate-300 font-medium truncate max-w-[70%]">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{c.subtext}</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${c.badgeColor} shrink-0`}
              >
                {c.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}