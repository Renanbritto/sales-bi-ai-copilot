"use client";

import React, { useState } from "react";
import {
  Users,
  FileText,
  Handshake,
  CheckCircle2,
  Cpu,
  ChevronDown,
  X,
  Clock,
} from "lucide-react";

interface FunnelChartProps {
  onOpenCopilot?: (prompt?: string) => void;
}

const FUNNEL_STAGES = [
  {
    id: 0,
    stage: "1. Leads Gerados (MQL)",
    count: 14200,
    value: "R$ 48.5M",
    convRate: "100.0%",
    dropOff: "0%",
    color: "bg-gradient-to-r from-emerald-700 via-teal-700 to-teal-800",
    icon: Users,
    avgCycleDays: "2 dias",
    aiDiagnosis:
      "Volume robusto de 14.200 leads inbound/outbound gerados. Alta concentração de interesse em soluções de BI e Cloud nos segmentos Varejo e Serviços. Apenas 36.6% avançam para qualificação formal.",
    copilotPrompt: "Qual o custo de aquisição e a qualidade dos 14.200 leads MQL gerados?",
  },
  {
    id: 1,
    stage: "2. Oportunidades Qualificadas (SQL)",
    count: 5200,
    value: "R$ 26.2M",
    convRate: "36.6%",
    dropOff: "-63.4%",
    color: "bg-gradient-to-r from-teal-700 via-cyan-800 to-sky-800",
    icon: FileText,
    avgCycleDays: "5 dias",
    aiDiagnosis:
      "Filtro rigoroso de BANT aplicado pela equipe de pré-vendas (SDRs). Queda de 63.4% dos leads decorre de descarte de empresas fora do perfil de cliente ideal (ICP) de médio/grande porte.",
    copilotPrompt: "Como melhorar a taxa de qualificação MQL para SQL de 36.6% para acima de 45%?",
  },
  {
    id: 2,
    stage: "3. Propostas Comerciais Apresentadas",
    count: 2450,
    value: "R$ 16.4M",
    convRate: "47.1%",
    dropOff: "-52.9%",
    color: "bg-gradient-to-r from-cyan-800 via-blue-800 to-indigo-800",
    icon: FileText,
    avgCycleDays: "12 dias",
    aiDiagnosis:
      "2.450 propostas emitidas com ticket médio de R$ 6.690. O principal motivo de perda nesta fase é concorrência de preços com fornecedores de hardware de baixo custo.",
    copilotPrompt: "Quais são os principais concorrentes que vencem propostas comerciais contra a nossa empresa?",
  },
  {
    id: 3,
    stage: "4. Negociação & Jurídico",
    count: 1480,
    value: "R$ 11.8M",
    convRate: "60.4%",
    dropOff: "-39.6%",
    color: "bg-gradient-to-r from-blue-800 via-indigo-800 to-violet-800",
    icon: Handshake,
    avgCycleDays: "22 dias",
    aiDiagnosis:
      "Gargalo crítico de velocidade de vendas: ciclo médio de 22 dias aguardando revisão de minutas contratuais e adequações de compliance. Padronizar contratos pode destravar até R$ 3.2M represados.",
    copilotPrompt: "Qual é a estratégia jurídica para reduzir o tempo médio de 22 dias na fase de Negociação & Jurídico?",
  },
  {
    id: 4,
    stage: "5. Contratos Fechados & Faturados",
    count: 890,
    value: "R$ 8.95M",
    convRate: "60.1%",
    dropOff: "-39.9%",
    color: "bg-gradient-to-r from-indigo-800 via-violet-800 to-purple-900",
    icon: CheckCircle2,
    avgCycleDays: "Faturado",
    aiDiagnosis:
      "890 negócios concluídos com sucesso e taxa de conversão final global de 6.27% sobre MQL. A taxa de ganho sobre propostas atinge 36.3%, superando benchmarks B2B de tecnologia (28%).",
    copilotPrompt: "Qual foi o perfil dos 890 contratos fechados e quais canais geraram maior receita líquida?",
  },
];

export function FunnelChart({ onOpenCopilot }: FunnelChartProps) {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/50">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Funil de Vendas Corporativo (B2B Pipeline)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Taxas de conversão, dispersão e diagnósticos da IA por estágio do ciclo comercial.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs border border-emerald-200 dark:border-emerald-800/80 font-mono font-bold">
            Conversão Global MQL → Venda: 6.27%
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden md:inline font-mono">
            Clique no estágio para ver RN Intelligence
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {FUNNEL_STAGES.map((stg) => {
          const widthPct = Math.max(38, 100 - stg.id * 14);
          const isSelected = activeStage === stg.id;

          return (
            <div
              key={stg.id}
              className={`p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-slate-50 dark:bg-slate-800/80 border border-blue-500/50 shadow-md ring-1 ring-blue-500/20"
                  : "bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
              onClick={() => setActiveStage(isSelected ? null : stg.id)}
            >
              {/* Top Row: Estágio e Métricas */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${stg.color} shadow-xs`} />
                  {stg.stage}
                </span>

                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-100 font-mono">{stg.value}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono text-[11px] bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/80 font-medium">
                    Conv: {stg.convRate}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveStage(isSelected ? null : stg.id);
                    }}
                    className={`flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    <Cpu className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    <span>RN Intelligence</span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${isSelected ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* Barra do Funil */}
              <div className="w-full py-1 mt-1">
                <div
                  className={`mx-auto h-11 rounded-xl ${stg.color} transition-all duration-700 flex items-center justify-center shadow-md relative overflow-hidden group border border-white/10`}
                  style={{ width: `${widthPct}%` }}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-xs sm:text-sm font-bold text-white tracking-wider sm:tracking-widest font-mono z-10 drop-shadow-md">
                    {stg.count.toLocaleString("pt-BR")} DEALS
                  </span>
                </div>
              </div>

              {/* Painel de Diagnóstico IA Expansível */}
              {isSelected && (
                <div
                  className="mt-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-xl text-xs text-slate-800 dark:text-slate-200 animate-in fade-in zoom-in-95 space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                      <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span className="font-bold tracking-wider uppercase">
                        RN Intelligence • Diagnóstico de Pipeline
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Ciclo Médio: {stg.avgCycleDays}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveStage(null)}
                        className="text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Fechar insight"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[12px] leading-relaxed text-slate-700 dark:text-slate-300">
                    <p className="flex items-start gap-2">
                      <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <span>{stg.aiDiagnosis}</span>
                    </p>
                  </div>

                  {onOpenCopilot && (
                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => onOpenCopilot(stg.copilotPrompt)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-mono transition-colors cursor-pointer shadow-sm"
                      >
                        <span>Aprofundar Análise no Copilot</span>
                      </button>
                    </div>
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
