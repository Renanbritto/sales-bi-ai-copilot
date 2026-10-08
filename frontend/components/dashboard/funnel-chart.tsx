"use client";

import React, { useState } from "react";
import {
  Users,
  FileText,
  Handshake,
  CheckCircle2,
  Cpu,
  Bot,
  ChevronDown,
  X,
  ExternalLink,
  Pin,
  Clock,
  AlertTriangle,
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
    color: "bg-gradient-to-r from-emerald-200 to-teal-200",
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
    color: "bg-gradient-to-r from-teal-200 to-cyan-200",
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
    color: "bg-gradient-to-r from-cyan-200 to-sky-200",
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
    color: "bg-gradient-to-r from-sky-200 to-blue-200",
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
    color: "bg-gradient-to-r from-blue-200 to-indigo-200",
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
    <div className="bg-white rounded-2xl p-6 border-0 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-700 tracking-tight">
              Funil de Vendas Corporativo (B2B Pipeline)
            </h2>
            
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Taxas de conversão, dispersão e diagnósticos da IA por estágio do ciclo comercial.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 font-mono font-bold">
            Conversão Global MQL → Venda: 6.27%
          </span>
          <span className="hidden md:inline-block text-[11px] font-mono text-slate-500">
            Clique no estágio para ver RN Intelligence
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {FUNNEL_STAGES.map((stg) => {
          const widthPct = Math.max(28, 100 - stg.id * 16);
          const isSelected = activeStage === stg.id;

          return (
            <div
              key={stg.id}
              className={`p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10 shadow-blue-900/10"
                  : "bg-transparent hover:bg-slate-50/80"
              }`}
              onClick={() => setActiveStage(isSelected ? null : stg.id)}
            >
              {/* Top Row: Estágio e Métricas */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <span className="font-semibold text-xs text-slate-700 flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${stg.color}`} />
                  {stg.stage}
                </span>

                <div className="flex items-center gap-3 text-xs">
                  
                  <span className="font-bold text-slate-700 font-mono">{stg.value}</span>
                  <span className="text-blue-600 font-mono text-[11px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    Conv: {stg.convRate}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveStage(isSelected ? null : stg.id);
                    }}
                    className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-500/15 text-blue-600 border-blue-500/40"
                        : "bg-slate-50 text-slate-700 border border-slate-200 hover:border-blue-400 hover:text-blue-600"
                    }`}
                  >
                    <Cpu className="w-3 h-3 text-blue-600" />
                    <span>RN Intelligence</span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${isSelected ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* Barra do Funil (Novo Design Centralizado) */}
              <div className="w-full py-1 mt-2">
                <div
                  className={`mx-auto h-10 rounded-lg ${stg.color} transition-all duration-700 flex items-center justify-center shadow-md relative overflow-hidden group`}
                  style={{ width: `${widthPct}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-sm font-bold text-slate-700 tracking-widest font-mono z-10 drop-shadow-sm">
                    {stg.count.toLocaleString("pt-BR")} DEALS
                  </span>
                </div>
              </div>

              {/* Painel de Diagnóstico IA Expansível */}
              {isSelected && (
                <div
                  className="mt-3 p-4 rounded-xl bg-white border border-slate-200 shadow-xl text-xs text-slate-700 animate-in fade-in zoom-in-95 space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <Cpu className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-bold tracking-wider uppercase">
                        RN Intelligence • Diagnóstico de Pipeline
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3 text-blue-600" /> Ciclo Médio: {stg.avgCycleDays}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveStage(null)}
                        className="text-slate-500 hover:text-slate-700 p-0.5 rounded hover:bg-slate-100 transition-colors"
                        title="Fechar insight"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-[12px] leading-relaxed text-slate-700">
                    <p className="flex items-start gap-2">
                      <Cpu className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{stg.aiDiagnosis}</span>
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                    <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
                      <span className="text-emerald-400">● DuckDB Pipeline Stream</span>
                      <span>• Taxa de Perda: {stg.dropOff}</span>
                    </div>

                    {onOpenCopilot && (
                      <button
                        type="button"
                        onClick={() => onOpenCopilot(stg.copilotPrompt)}
                        className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm border border-blue-700/20 text-[11px] font-medium transition-all cursor-pointer"
                      >
                        <span>Perguntar à RN Intelligence no Chat</span>
                        <ExternalLink className="w-3 h-3 text-white" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
