"use client";

import React, { useState } from "react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { SegmentBreakdown, TopClient } from "@/lib/api";
import {
  Building2,
  Users,
  Star,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Cpu,
  ChevronDown,
  X,
  ExternalLink,
  Target,
  AlertTriangle,
} from "lucide-react";

interface CustomerSegmentsProps {
  segments: SegmentBreakdown[];
  topClients: TopClient[];
  onOpenCopilot?: (prompt?: string) => void;
}

const SEGMENT_AI_INSIGHTS: Record<string, { diagnosis: string; prompt: string; priority: string }> = {
  "Tecnologia & SaaS": {
    diagnosis:
      "Vertical com maior margem (48.5%) e menor ciclo de vendas. Apresenta 96% de adesão a contratos anuais de software em nuvem. Ação: Desenvolver planos multi-tenant enterprise.",
    prompt: "Qual a taxa de expansão (Net Revenue Retention) dos clientes do segmento Tecnologia & SaaS?",
    priority: "Alta Margem & Escala",
  },
  "Varejo & E-commerce": {
    diagnosis:
      "Maior volume de transações e sensibilidade a preço. Margem de 39.2% pressionada por pedidos pontuais de hardware. Ação: Oferecer desconto condicionado à adesão do módulo de IA preditiva.",
    prompt: "Como aumentar a rentabilidade dos clientes de Varejo através de pacotes de IA de demanda?",
    priority: "Volume & Giro Rápido",
  },
  "Serviços Financeiros & Fintechs": {
    diagnosis:
      "Maior ticket médio da carteira (R$ 4.250) com margem sólida de 46.8%. Exigência máxima em segurança e conformidade LGPD. Ação: Vender add-on de Governança Avançada.",
    prompt: "Quais soluções de segurança e governança mais vendem para o setor Financeiro?",
    priority: "Maior Ticket Médio",
  },
  "Indústria & Manufatura": {
    diagnosis:
      "Contratos de longo prazo com implantação gradual. Margem de 41.5% e demanda por conectores de dados industriais (IoT/MES). Ação: Desenvolver pacotes para chão de fábrica.",
    prompt: "Qual o potencial de expansão dos contratos de Indústria para o próximo trimestre?",
    priority: "Contratos Plurianuais",
  },
  "Saúde & Farma": {
    diagnosis:
      "Vertical em rápida ascensão com margem de 44.0%. Baixíssimo índice de cancelamento (churn < 2%). Ação: Focar em prontuários e analytics hospitalar.",
    prompt: "Como estruturar um plano de vendas focado em redes hospitalares e operadoras de saúde?",
    priority: "Baixo Churn (<2%)",
  },
};

export function CustomerSegments({ segments, topClients, onOpenCopilot }: CustomerSegmentsProps) {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const [activeClient, setActiveClient] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Grid de Segmentos de Mercado */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Faturamento por Segmento de Mercado (B2B)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400">
                Segmentação Estratégica
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Análise de receita, margem de contribuição e ticket por vertical com diagnósticos da IA.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            Clique no card para abrir diagnóstico IA
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {segments.map((s, idx) => {
            const isSelected = activeSegment === s.segment;
            const insight = SEGMENT_AI_INSIGHTS[s.segment] || {
              diagnosis: `Vertical com ${s.clients} clientes ativos e ticket médio de ${formatCurrency(s.avg_ticket)}.`,
              prompt: `Analise a performance de vendas da vertical ${s.segment}.`,
              priority: "Estratégico",
            };

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
                onClick={() => setActiveSegment(isSelected ? null : s.segment)}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="font-bold text-white text-sm">{s.segment}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {insight.priority}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Receita Total:</span>
                    <span className="font-bold text-white font-mono">{formatCurrency(s.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Margem Média:</span>
                    <span className="font-bold text-emerald-400 font-mono">{s.margin_pct.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ticket Médio:</span>
                    <span className="font-medium text-slate-300 font-mono">{formatCurrency(s.avg_ticket)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contas Ativas:</span>
                    <span className="text-slate-300">{s.clients} clientes ({formatNumber(s.orders)} ped.)</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSegment(isSelected ? null : s.segment);
                    }}
                    className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/50"
                        : "bg-slate-900 text-cyan-400/80 border-cyan-500/30 hover:border-cyan-400"
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-cyan-300" />
                    <span>IA Insight</span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${isSelected ? "rotate-180" : ""}`}
                    />
                  </button>

                  <span className="text-[10px] font-mono text-slate-500">
                    {isSelected ? "Aberto" : "Ver Ação"}
                  </span>
                </div>

                {/* Popover Expansível de Diagnóstico IA da Vertical */}
                {isSelected && (
                  <div
                    className="mt-3 p-3.5 rounded-xl bg-[#0a1122] border border-cyan-400/60 text-xs text-slate-200 animate-in fade-in space-y-2.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-cyan-500/20 text-[10px] font-mono">
                      <span className="text-cyan-400 flex items-center gap-1 font-semibold uppercase">
                        <Sparkles className="w-3 h-3 text-cyan-300" />
                        Diagnóstico Vertical IA
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveSegment(null)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11.5px] leading-relaxed text-slate-300">
                      {insight.diagnosis}
                    </p>

                    {onOpenCopilot && (
                      <button
                        type="button"
                        onClick={() => onOpenCopilot(insight.prompt)}
                        className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-500/40 text-cyan-300 hover:text-white text-[11px] font-medium transition-all cursor-pointer"
                      >
                        <span>Perguntar ao Copilot sobre {s.segment}</span>
                        <ExternalLink className="w-3 h-3 text-cyan-400" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 10 Contas Corporativas com Ações Táticas */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Top 10 Contas Corporativas (Maior LTV Acumulado)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                Key Accounts
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Clientes com maior participação na receita, margem de contribuição e diagnósticos de fidelização.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/40 font-medium">
                <th className="py-3 px-3">Ranking</th>
                <th className="py-3 px-3">Cliente Corporativo</th>
                <th className="py-3 px-3">Segmento</th>
                <th className="py-3 px-3">Região</th>
                <th className="py-3 px-3 text-right">Receita Total</th>
                <th className="py-3 px-3 text-right">Margem %</th>
                <th className="py-3 px-3 text-right">Pedidos</th>
                <th className="py-3 px-3 text-right">Ticket Médio</th>
                <th className="py-3 px-3 text-center">Ação IA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {topClients.map((c, idx) => {
                const rank = idx + 1;
                const isSelected = activeClient === rank;
                const isTop3 = rank <= 3;

                return (
                  <React.Fragment key={c.client_name}>
                    <tr
                      className={`hover:bg-slate-800/30 transition-colors cursor-pointer ${
                        isSelected ? "bg-slate-800/40" : ""
                      }`}
                      onClick={() => setActiveClient(isSelected ? null : rank)}
                    >
                      <td className="py-3 px-3 font-mono">
                        <span
                          className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                            isTop3
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {rank}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                        {c.client_name}
                        {isTop3 && <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </td>
                      <td className="py-3 px-3 text-slate-400">{c.segment}</td>
                      <td className="py-3 px-3 text-slate-400">{c.region}</td>
                      <td className="py-3 px-3 text-right font-mono text-cyan-300 font-bold">
                        {formatCurrency(c.total_spent)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        <span
                          className={`font-semibold ${
                            c.margin_pct >= 45 ? "text-emerald-400" : "text-amber-400"
                          }`}
                        >
                          {c.margin_pct.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-300">{c.orders_count}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-300">
                        {formatCurrency(c.avg_ticket)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveClient(isSelected ? null : rank);
                          }}
                          className={`p-1 rounded-lg border text-[11px] font-mono transition-colors ${
                            isSelected
                              ? "bg-cyan-500/20 text-cyan-300 border-cyan-400"
                              : "bg-slate-900 text-cyan-400/80 border-cyan-500/30 hover:border-cyan-400"
                          }`}
                          title="Ver Diagnóstico do Cliente"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>

                    {/* Detalhe do Cliente com Gatilho Copilot */}
                    {isSelected && (
                      <tr>
                        <td colSpan={9} className="p-0">
                          <div className="p-4 bg-[#0a1122] border-y border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold">
                                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                                <span>DIAGNÓSTICO ESTRATÉGICO: {c.client_name.toUpperCase()}</span>
                              </div>
                              <p className="text-xs text-slate-300">
                                Conta classe A com faturamento acumulado de <strong>{formatCurrency(c.total_spent)}</strong> ({c.orders_count} pedidos). Margem de {c.margin_pct.toFixed(1)}%. Recomenda-se agendar reunião trimestral de alinhamento executivo (QBR) com o Diretor de TI.
                              </p>
                            </div>

                            {onOpenCopilot && (
                              <button
                                type="button"
                                onClick={() =>
                                  onOpenCopilot(
                                    `Analise o histórico completo de compras, faturamento e margem do cliente ${c.client_name}.`
                                  )
                                }
                                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                              >
                                <span>Analisar Conta no Copilot</span>
                                <ExternalLink className="w-3 h-3 text-cyan-400" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
