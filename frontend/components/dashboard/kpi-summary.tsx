import React from "react";
import { TrendingUp, DollarSign, ShoppingCart, Users, Target, ArrowUpRight } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { KpiData } from "@/lib/api";

interface KpiSummaryProps {
  data: KpiData;
}

export function KpiSummary({ data }: KpiSummaryProps) {
  const cards = [
    {
      title: "Faturamento Líquido",
      value: formatCurrency(data.faturamento_total),
      subtext: "+18.4% YoY vs período anterior",
      badge: "Realizado",
      icon: DollarSign,
      color: "from-sky-500/20 to-blue-600/10",
      border: "border-sky-500/30",
      accent: "text-sky-400",
    },
    {
      title: "Margem de Contribuição",
      value: `${data.margem_contribuicao_pct.toFixed(1)}%`,
      subtext: `${formatCurrency(data.margem_total_reais)} em margem bruta`,
      badge: "Meta: 40.0%",
      icon: TrendingUp,
      color: "from-emerald-500/20 to-teal-600/10",
      border: "border-emerald-500/30",
      accent: "text-emerald-400",
    },
    {
      title: "Volume de Pedidos",
      value: formatNumber(data.total_pedidos),
      subtext: `${data.clientes_ativos} clientes corporativos ativos`,
      badge: "Faturados",
      icon: ShoppingCart,
      color: "from-purple-500/20 to-indigo-600/10",
      border: "border-purple-500/30",
      accent: "text-purple-400",
    },
    {
      title: "Ticket Médio",
      value: formatCurrency(data.ticket_medio),
      subtext: "Atingimento da Meta: " + data.atingimento_meta_pct.toFixed(0) + "%",
      badge: "Por Pedido",
      icon: Target,
      color: "from-amber-500/20 to-orange-600/10",
      border: "border-amber-500/30",
      accent: "text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className={`glass-panel glass-panel-hover rounded-xl p-5 relative overflow-hidden bg-gradient-to-br ${c.color} border ${c.border}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{c.title}</p>
                <h3 className="text-2xl font-bold tracking-tight text-white mt-1">{c.value}</h3>
              </div>
              <div className={`p-2.5 rounded-lg bg-slate-900/60 border border-white/5 ${c.accent}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                {c.subtext}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/5 text-[11px] font-medium text-slate-300 border border-white/5">
                {c.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
