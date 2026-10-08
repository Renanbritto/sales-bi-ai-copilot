"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { RegionBreakdown } from "@/lib/api";
import {
  MapPin,
  Cpu,
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
      "Concentra 50.4% do faturamento total (R$ 19.68M) com margem saudável de 44.3%. Mercado maduro e altamente competitivo. Recomendação: Focar em cross-selling de IA e módulos de analytics para clientes existentes.",
    prompt: "Quais são as melhores oportunidades de cross-sell para os clientes da Região Sudeste?",
    strategy: "Polo Consolidado & Upsell",
  },
  Sul: {
    diagnosis:
      "Segunda maior regional: 24.8% da receita (R$ 9.68M) com a maior margem líquida da empresa (45.1%). Alta adesão a contratos de Cloud dedicada. Ação recomendada: Aumentar quota de novos SDRs em Curitiba e Porto Alegre.",
    prompt: "Como expandir a equipe comercial na Região Sul mantendo a margem de 45.1%?",
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
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs transition-all duration-300 relative flex flex-col justify-between h-full ${
                isSelected
                  ? "border-blue-500 dark:border-blue-500 shadow-md ring-1 ring-blue-500/20"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div>
                {/* Header do Card Regional */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 block leading-none">
                        Região
                      </span>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight mt-0.5 truncate">
                        {reg.region}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/80 shrink-0">
                    {reg.share_pct}%
                  </span>
                </div>

                {/* Métricas Regionais */}
                <div className="space-y-2 text-xs py-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">Faturamento:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 font-mono">
                      {formatCurrency(reg.revenue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">Margem Bruta:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {reg.margin_pct}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">Ticket Médio:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200 font-mono">
                      {formatCurrency(reg.avg_ticket)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">Clientes Ativos:</span>
                    <span className="font-medium text-slate-600 dark:text-slate-300 font-mono">
                      {reg.clients_count} contas B2B
                    </span>
                  </div>
                </div>
              </div>

              {/* Seção Inferior: Foco Estratégico + Botão Copilot */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-slate-500">
                    Foco Estratégico
                  </span>
                  <span
                    className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-[10px] truncate max-w-[130px]"
                    title={insight.strategy}
                  >
                    {insight.strategy}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveRegion(isSelected ? null : reg.region)}
                  className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-[11px] font-mono transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Análise RN Intelligence</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${isSelected ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {/* Popover de Diagnóstico Regional */}
              {isSelected && (
                <div
                  className="absolute left-0 right-0 top-full mt-2 z-50 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl text-xs text-slate-800 dark:text-slate-200 animate-in fade-in space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-mono">
                    <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1 font-semibold uppercase">
                      <Cpu className="w-3.5 h-3.5" />
                      Diagnóstico Regional RN Intelligence
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveRegion(null)}
                      className="text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-0.5 rounded transition-colors cursor-pointer"
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
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium transition-all cursor-pointer shadow-sm"
                    >
                      <span>Perguntar à RN Intelligence sobre {reg.region}</span>
                      <ExternalLink className="w-3 h-3" />
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
