"use client";

import React, { useState } from "react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { RegionBreakdown } from "@/lib/api";
import {
  MapPin,
  Globe,
  TrendingUp,
  Users,
  ArrowUpRight,
  DollarSign,
  Cpu,
  Bot,
  ChevronDown,
  X,
  ExternalLink,
} from "lucide-react";

interface RegionalAnalysisProps {
  regions: RegionBreakdown[];
  onOpenCopilot?: (prompt?: string) => void;
}

const REGION_AI_INSIGHTS: Record<string, { diagnosis: string; prompt: string; strategy: string }> = {
  Sudeste: {
    diagnosis:
      "Concentra 50.4% da receita corporativa (R$ 19.6M) com a maior margem bruta (44.3%). Polo com mais de 20 contas corporativas maduras. Ação: Foco em expansão de licenças (upsell) e retenção.",
    prompt: "Quais são os principais fatores que sustentam a liderança da regional Sudeste em receita e margem?",
    strategy: "Polo Consolidado & Upsell",
  },
  Sul: {
    diagnosis:
      "Segunda maior praça com 24.8% de participação (R$ 9.6M) e margem de 43.8%. Crescimento de +22% YoY, puxado por indústrias e cooperativas agrícolas de tecnologia. Ação: Alocar mais 2 SDRs dedicados.",
    prompt: "Qual é o potencial de crescimento da regional Sul e quais setores estão comprando mais?",
    strategy: "Alta Tração (+22% YoY)",
  },
  Nordeste: {
    diagnosis:
      "Representa 15.2% da receita (R$ 5.9M) com margem de 42.5%. Forte demanda por soluções de automação e BI em redes de varejo locais. Ação: Estruturar programa de parceiros integradores locais.",
    prompt: "Como acelerar as vendas no Nordeste através de canais e parceiros locais?",
    strategy: "Expansão de Parceiros",
  },
  "Centro-Oeste": {
    diagnosis:
      "9.6% do faturamento (R$ 3.7M) e ticket médio elevado (R$ 3.120). Grande oportunidade em empresas de agronegócio e trading. Ação: Desenvolver pacote vertical Agro-Analytics.",
    prompt: "Quais oportunidades existem para soluções de analytics no agronegócio do Centro-Oeste?",
    strategy: "Nicho Agro & Alto Ticket",
  },
};

export function RegionalAnalysis({ regions, onOpenCopilot }: RegionalAnalysisProps) {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Cards de Macro-regiões */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {regions.map((reg) => {
          const isSelected = activeRegion === reg.region;
          const insight = REGION_AI_INSIGHTS[reg.region] || {
            diagnosis: `Região ${reg.region} com ${reg.share_pct}% de share e margem de ${reg.margin_pct}%.`,
            prompt: `Analise o desempenho da região ${reg.region}.`,
            strategy: "Estratégico",
          };

          return (
            <div
              key={reg.region}
              className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 shadow-xs rounded-xl p-5 border transition-all duration-300 relative ${
                isSelected
                  ? "border-blue-400/70 shadow-md shadow-blue-900/10 bg-slate-50 dark:bg-slate-800/50"
                  : "border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50/50 hover:bg-slate-50 dark:bg-slate-800/50 hover:border-slate-200 dark:border-slate-700/50"
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 dark:border-slate-700/50">
                <span className="font-bold text-slate-700 dark:text-slate-200 text-base flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Região {reg.region}
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-700 border border-slate-200 dark:border-slate-700/50">
                  {reg.share_pct}% do Total
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Faturamento:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200 font-mono">{formatCurrency(reg.revenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Margem Bruta:</span>
                  <span className="font-bold text-emerald-400 font-mono">{reg.margin_pct}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Ticket Médio:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200 font-mono">{formatCurrency(reg.avg_ticket)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Clientes Ativos:</span>
                  <span className="font-medium text-slate-600 dark:text-slate-300">{reg.clients_count} contas B2B</span>
                </div>
              </div>

              {/* Botão de Gatilho IA */}
              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveRegion(isSelected ? null : reg.region)}
                  className={`flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-500/15 text-blue-700 border-blue-400"
                      : "bg-slate-50 dark:bg-slate-800/50 text-blue-600/80 border-slate-200 dark:border-slate-700/50 hover:border-blue-400"
                  }`}
                >
                  <Cpu className="w-3 h-3 text-blue-700" />
                  <span>RN Intelligence</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${isSelected ? "rotate-180" : ""}`}
                  />
                </button>

                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 dark:text-slate-500">
                  {insight.strategy}
                </span>
              </div>

              {/* Popover de Diagnóstico Regional */}
              {isSelected && (
                <div
                  className="absolute left-0 right-0 top-full mt-2 z-50 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 shadow-xl text-xs text-slate-700 dark:text-slate-200 animate-in fade-in space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-700/50 text-[10px] font-mono">
                    <span className="text-blue-600 flex items-center gap-1 font-semibold uppercase">
                      <Cpu className="w-3 h-3 text-blue-700" />
                      Diagnóstico Regional RN Intelligence
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveRegion(null)}
                      className="text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11.5px] leading-relaxed text-slate-600 dark:text-slate-300">
                    {insight.diagnosis}
                  </p>

                  {onOpenCopilot && (
                    <button
                      type="button"
                      onClick={() => onOpenCopilot(insight.prompt)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-600/30 hover:to-blue-600/30 border border-slate-200 dark:border-slate-700/50 text-blue-700 hover:text-slate-700 dark:text-slate-200 text-[11px] font-medium transition-all cursor-pointer"
                    >
                      <span>Perguntar à RN Intelligence sobre {reg.region}</span>
                      <ExternalLink className="w-3 h-3 text-blue-600" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
 