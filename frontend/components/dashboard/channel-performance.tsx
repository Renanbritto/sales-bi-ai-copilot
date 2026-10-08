"use client";

import React, { useState } from "react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ChannelItem } from "@/lib/api";
import {
  Network,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  DollarSign,
  Cpu,
  Bot,
  ChevronDown,
  X,
  ExternalLink,
} from "lucide-react";

interface ChannelPerformanceProps {
  channels: ChannelItem[];
  onOpenCopilot?: (prompt?: string) => void;
}

const CHANNEL_AI_INSIGHTS: Record<string, { diagnosis: string; prompt: string; alert?: boolean }> = {
  "B2B Enterprise": {
    diagnosis:
      "Canal mais lucrativo: 42.0% da receita total (R$ 16.4M) com margem de 44.5% e baixo desconto médio (5.2%). Vendas consultivas com alta taxa de renovação anual.",
    prompt: "Como estruturar metas de crescimento para a equipe comercial do canal B2B Enterprise?",
    alert: false,
  },
  "E-commerce Direto": {
    diagnosis:
      "Gera R$ 10.9M com a menor taxa de desconto (3.1%) e margem líquida de 43.8%. Forte compra recorrente de licenças e add-ons de autoatendimento corporativo.",
    prompt: "Quais produtos de SaaS têm maior conversão através do canal E-commerce Direto?",
    alert: false,
  },
  "Grandes Contas": {
    diagnosis:
      "Volume expressivo de R$ 7.0M com ticket médio mais alto (R$ 4.520). Desconto de 8.4% negociado em pacotes de longa duração com margem de 42.1%.",
    prompt: "Qual o impacto dos descontos concedidos nas 5 maiores negociações de Grandes Contas?",
    alert: false,
  },
  "Canais & Parceiros": {
    diagnosis:
      "Ponto de atenção executivo: taxa de desconto excessiva de 12.4%, comprimindo a margem para 38.6% (abaixo da meta de 40.0%). Ação imediata: Limitar alçada de desconto de parceiros a 7.5%.",
    prompt: "Qual a recomendação da RN Intelligence para recuperar a margem de contribuição no canal de Parceiros?",
    alert: true,
  },
};

export function ChannelPerformance({ channels, onOpenCopilot }: ChannelPerformanceProps) {
  const [activeChannel, setActiveChannel] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 shadow-xs rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700/50">
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 tracking-tight">
                Matriz de Performance & Erosão de Descontos por Canal
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-blue-600">
                Canal Comercial
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">
              Avaliação de faturamento bruto vs. descontos concedidos vs. faturamento líquido e margem.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 dark:text-slate-500 hidden sm:inline">
            Clique na linha para ver diagnóstico do canal
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 font-medium">
                <th className="py-3 px-4">Canal Comercial</th>
                <th className="py-3 px-4 text-right">Faturamento Bruto</th>
                <th className="py-3 px-4 text-right">Descontos Concedidos</th>
                <th className="py-3 px-4 text-right">Taxa Desconto %</th>
                <th className="py-3 px-4 text-right">Faturamento Líquido</th>
                <th className="py-3 px-4 text-right">Margem %</th>
                <th className="py-3 px-4 text-right">Volume Pedidos</th>
                <th className="py-3 px-4 text-right">Ticket Médio</th>
                <th className="py-3 px-4 text-center">RN Intelligence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {channels.map((c) => {
                const isSelected = activeChannel === c.channel;
                const discountAlert = c.discount_pct > 10;
                const insight = CHANNEL_AI_INSIGHTS[c.channel] || {
                  diagnosis: `Canal ${c.channel} com margem de ${c.margin}%.`,
                  prompt: `Analise a performance do canal ${c.channel}.`,
                  alert: false,
                };

                return (
                  <React.Fragment key={c.channel}>
                    <tr
                      className={`hover:bg-slate-100/30 transition-colors cursor-pointer ${
                        isSelected ? "bg-blue-50/50" : ""
                      }`}
                      onClick={() => setActiveChannel(isSelected ? null : c.channel)}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${discountAlert ? "bg-amber-400" : "bg-blue-500"}`} />
                        {c.channel}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300">
                        {formatCurrency(c.gross_revenue)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-rose-400">
                        -{formatCurrency(c.total_discount)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            discountAlert
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : "text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          {c.discount_pct.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-blue-700 font-bold">
                        {formatCurrency(c.actual)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span
                          className={`font-semibold ${
                            c.margin >= 43 ? "text-emerald-400" : "text-amber-400"
                          }`}
                        >
                          {c.margin.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300">
                        {formatNumber(c.orders)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300">
                        {formatCurrency(c.ticket)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveChannel(isSelected ? null : c.channel);
                          }}
                          className={`p-1 rounded-lg border text-[11px] font-mono transition-colors ${
                            isSelected
                              ? "bg-blue-500/15 text-blue-700 border-blue-400"
                              : "bg-slate-50 dark:bg-slate-800/50 text-blue-600/80 border-slate-200 dark:border-slate-700/50 hover:border-blue-400"
                          }`}
                          title="Ver Diagnóstico do Canal"
                        >
                          <Cpu className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>

                    {/* Popover Expansível de Diagnóstico do Canal */}
                    {isSelected && (
                      <tr>
                        <td colSpan={9} className="p-0">
                          <div className="p-4 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold">
                                <Cpu className="w-3.5 h-3.5 text-blue-700" />
                                <span>DIAGNÓSTICO RN INTELLIGENCE: {c.channel.toUpperCase()}</span>
                                {discountAlert && (
                                  <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                                    <AlertTriangle className="w-3 h-3" /> Alerta de Erosão
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-300">
                                {insight.diagnosis}
                              </p>
                            </div>

                            {onOpenCopilot && (
                              <button
                                type="button"
                                onClick={() => onOpenCopilot(insight.prompt)}
                                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-600/30 hover:to-blue-600/30 border border-slate-200 dark:border-slate-700/50 text-blue-700 hover:text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                              >
                                <span>Analisar Canal na RN Intelligence</span>
                                <ExternalLink className="w-3 h-3 text-blue-600" />
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
 