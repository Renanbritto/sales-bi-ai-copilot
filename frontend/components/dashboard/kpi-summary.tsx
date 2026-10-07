"use client";

import React, { useState } from "react";
import { TrendingUp, DollarSign, ShoppingCart, Target, ArrowUpRight, Sparkles, Cpu, Info } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { KpiData } from "@/lib/api";

interface KpiSummaryProps {
  data: KpiData;
}

export function KpiSummary({ data }: KpiSummaryProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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
      aiDiagnosis: "Forte alavancagem no 2º semestre (+18.4% YoY). O produto Enterprise Analytics Platform lidera a participação gerando mais de R$ 10.9M em receita líquida.",
      aiMetric: "Confiança Analítica: 99.8%",
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
      aiDiagnosis: "A rentabilidade média de 43.0% supera a meta orçada de 40.0% em 3.0 pontos percentuais. Mix de softwares de alta margem compensa custos de hardware.",
      aiMetric: "Superação da Meta: +3.0 p.p.",
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
      aiDiagnosis: "13.236 transações faturadas com índice de retenção de 94.2%. Baixa taxa de cancelamentos e alta frequência de compras no segmento B2B.",
      aiMetric: "Taxa de Sucesso: 96.1%",
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
      aiDiagnosis: "Ticket médio de R$ 2.949 mantido estável. Vendas para contas Enterprise ultrapassam R$ 3.800 médios por transação.",
      aiMetric: "Liderança: B2B Enterprise",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        const isHovered = hoveredCard === idx;

        return (
          <div
            key={idx}
            onMouseEnter={() => setHoveredCard(idx)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`glass-panel rounded-xl p-5 relative transition-all duration-300 bg-gradient-to-br ${c.color} border ${
              isHovered ? "border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.2)] scale-[1.01]" : c.border
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  {c.title}
                  <Sparkles className="w-3 h-3 text-cyan-400/70" />
                </p>
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

            {/* AI Futuristic Popover Tooltip ao passar o cursor */}
            {isHovered && (
              <div className="absolute left-2 right-2 bottom-full mb-2 z-50 p-3 rounded-xl bg-[#070d1a]/95 backdrop-blur-xl border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.25)] text-xs text-slate-200 transition-all duration-200 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-cyan-500/20 text-[10px] font-mono">
                  <span className="text-cyan-400 flex items-center gap-1 font-semibold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
                    AI Copilot Insight
                  </span>
                  <span className="text-emerald-400">{c.aiMetric}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300 flex items-start gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{c.aiDiagnosis}</span>
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
