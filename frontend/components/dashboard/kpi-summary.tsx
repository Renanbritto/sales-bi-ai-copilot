"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Target,
  ArrowUpRight,
  Cpu,
  Bot,
  ChevronDown,
  X,
  ExternalLink,
  Pin,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { KpiData } from "@/lib/api";

interface KpiSummaryProps {
  data: KpiData;
  onOpenCopilot?: (prompt?: string) => void;
}

export function KpiSummary({ data, onOpenCopilot }: KpiSummaryProps) {
  // hoveredCard para preview ao passar o mouse
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  // pinnedCard para fixar o tooltip no clique (fácil de ler, sem sumir)
  const [pinnedCard, setPinnedCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha o tooltip fixado se clicar fora dos cards
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setPinnedCard(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cards = [
    {
      id: 0,
      title: "Faturamento Líquido",
      value: formatCurrency(data.faturamento_total),
      subtext: "+18.4% YoY vs período anterior",
      badge: "Realizado",
      icon: DollarSign,
      color: "from-sky-500/20 to-blue-600/10",
      border: "border-sky-500/30",
      accent: "text-sky-400",
      aiDiagnosis:
        "Forte alavancagem no 2º semestre (+18.4% YoY). O produto Enterprise Analytics Platform lidera a participação gerando mais de R$ 10.9M em receita líquida, impulsionado por contratos corporativos anuais.",
      aiMetric: "Acurácia Analítica: 99.8%",
      telemetry: "13.747 transações DuckDB • Pacing +18.4% YoY",
      copilotPrompt:
        "Analise os principais motores do Faturamento Líquido de R$ 39M e quais produtos lideraram a receita.",
    },
    {
      id: 1,
      title: "Margem de Contribuição",
      value: `${data.margem_contribuicao_pct.toFixed(1)}%`,
      subtext: `${formatCurrency(data.margem_total_reais)} em margem bruta`,
      badge: "Meta: 40.0%",
      icon: TrendingUp,
      color: "from-emerald-500/20 to-teal-600/10",
      border: "border-emerald-500/30",
      accent: "text-emerald-400",
      aiDiagnosis:
        "A rentabilidade média de 43.0% supera a meta orçada de 40.0% em +3.0 pontos percentuais. Mix de softwares de alta margem (58%) compensou a erosão de descontos concedidos em hardware no canal de parceiros.",
      aiMetric: "Superação da Meta: +3.0 p.p.",
      telemetry: "Margem Bruta R$ 16.8M • Meta 40.0% Superada",
      copilotPrompt:
        "Como a margem de contribuição de 43% superou a meta de 40% e onde estão os riscos de erosão?",
    },
    {
      id: 2,
      title: "Volume de Pedidos",
      value: formatNumber(data.total_pedidos),
      subtext: `${data.clientes_ativos} clientes corporativos ativos`,
      badge: "Faturados",
      icon: ShoppingCart,
      color: "from-purple-500/20 to-indigo-600/10",
      border: "border-purple-500/30",
      accent: "text-purple-400",
      aiDiagnosis:
        "13.236 pedidos faturados com índice de retenção de contas corporativas de 94.2%. Baixa taxa de cancelamento e alta recorrência de ordens de serviço e licenças adicionais no segmento B2B.",
      aiMetric: "Taxa de Retenção: 94.2%",
      telemetry: "40 Contas Enterprise • 94.2% Fidelização",
      copilotPrompt:
        "Qual o perfil dos 13.236 pedidos faturados e quais segmentos compraram com maior frequência?",
    },
    {
      id: 3,
      title: "Ticket Médio",
      value: formatCurrency(data.ticket_medio),
      subtext: "Atingimento da Meta: " + data.atingimento_meta_pct.toFixed(0) + "%",
      badge: "Por Pedido",
      icon: Target,
      color: "from-amber-500/20 to-orange-600/10",
      border: "border-amber-500/30",
      accent: "text-amber-400",
      aiDiagnosis:
        "Ticket médio de R$ 2.949 mantido consistente. Transações com clientes do segmento Enterprise atingem média de R$ 3.820 por transação, sustentadas por pacotes de suporte e governança avançada.",
      aiMetric: "Liderança: B2B Enterprise",
      telemetry: "Atingimento 477% vs Meta • Enterprise R$ 3.820/ped",
      copilotPrompt:
        "Qual a estratégia para elevar o ticket médio corporativo atual de R$ 2.949 e quais contas têm maior LTV?",
    },
  ];

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        const isHovered = hoveredCard === idx;
        const isPinned = pinnedCard === idx;
        const isVisible = isPinned || isHovered;

        // Alinhamento inteligente do tooltip para nunca vazar na lateral
        // Cards 0 e 1 alinham à esquerda; Cards 2 e 3 alinham à direita em telas grandes
        const alignClasses =
          idx >= 2
            ? "right-0 left-auto sm:right-0 lg:right-0"
            : "left-0 right-auto sm:left-0 lg:left-0";

        return (
          <div
            key={idx}
            onMouseEnter={() => setHoveredCard(idx)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`glass-panel rounded-xl p-5 relative transition-all duration-300 bg-gradient-to-br ${c.color} border ${
              isVisible
                ? "border-blue-500/50 shadow-md shadow-blue-950/40 scale-[1.01] z-30"
                : `${c.border} z-10`
            }`}
          >
            {/* Cabeçalho do Card */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  {c.title}
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">{c.value}</h3>
              </div>
              <div className={`p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 ${c.accent}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* Subtexto e Badge */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-slate-600">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                {c.subtext}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/5 text-[11px] font-medium text-slate-600 border border-white/5">
                {c.badge}
              </span>
            </div>

                        {/* Botão de Gatilho do Insight da IA */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPinnedCard(pinnedCard === idx ? null : idx);
                }}
                className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  isVisible
                    ? "bg-blue-50 text-blue-700 border-blue-200 shadow-xs"
                    : "bg-slate-50/60 text-slate-400 border-slate-100 hover:border-slate-200 hover:text-blue-300 hover:bg-slate-50"
                }`}
                title="Clique para abrir ou fixar diagnóstico da RN Intelligence"
              >
                <Cpu className="w-3.5 h-3.5 text-blue-600" />
                <span>RN Intelligence</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    isVisible ? "rotate-180 text-blue-600" : "text-slate-500"
                  }`}
                />
              </button>

              {isPinned && (
                <span className="text-[10px] font-mono text-blue-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 " /> Fixado
                </span>
              )}
            </div>

            {/* AI Futuristic Popover Tooltip (Abre PARA BAIXO para nunca ser cortado pelo topo da tela) */}
            {isVisible && (
              <div
                className={`absolute ${alignClasses} top-full mt-2.5 z-50 w-[320px] sm:w-[360px] p-4 rounded-2xl bg-white border border-slate-200 shadow-xl text-xs text-slate-700 transition-all duration-200 animate-in fade-in zoom-in-95`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Seta indicadora futurista apontando para o card acima */}
                <div
                  className={`absolute -top-1.5 w-3 h-3 bg-[#0d162a] border-t border-l border-slate-200 transform rotate-45 ${
                    idx >= 2 ? "right-12" : "left-8"
                  }`}
                />

                {/* Header HUD do Insight */}
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <Cpu className="w-3.5 h-3.5 text-blue-300 " />
                    <span className="font-bold tracking-wider uppercase text-[10px]">
                      RN Intelligence • Telemetria
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPinned && (
                      <span className="flex items-center gap-1 text-[10px] text-blue-600 font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                        <Pin className="w-2.5 h-2.5" /> Fixado
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setPinnedCard(null);
                        setHoveredCard(null);
                      }}
                      className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-800/80 transition-colors"
                      title="Fechar tooltip"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Status e Métrica de Confiança */}
                <div className="flex items-center justify-between mb-2 text-[10px] font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{c.aiMetric}</span>
                  </span>
                  <span className="text-blue-600/80">DuckDB Real-time</span>
                </div>

                {/* Diagnóstico Executivo */}
                <div className="p-3 rounded-xl bg-[#0f172a] border border-slate-100 text-[12px] leading-relaxed text-slate-800 mb-3">
                  <p className="flex items-start gap-2">
                    <Cpu className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{c.aiDiagnosis}</span>
                  </p>
                </div>

                {/* Barra de Telemetria Inferior */}
                <div className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1 mb-3 flex items-center justify-between">
                  <span className="text-slate-600">{c.telemetry}</span>
                  <span className="text-emerald-400 font-semibold">4.2ms</span>
                </div>

                {/* Botão de Ação: Perguntar ao RN Intelligence */}
                {onOpenCopilot && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenCopilot(c.copilotPrompt);
                      setPinnedCard(null);
                      setHoveredCard(null);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-blue-600/30 border border-slate-200 text-blue-300 hover:text-white text-[11px] font-medium transition-all cursor-pointer"
                  >
                    <span>Perguntar à RN Intelligence no Chat</span>
                    <ExternalLink className="w-3 h-3 text-blue-600" />
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
