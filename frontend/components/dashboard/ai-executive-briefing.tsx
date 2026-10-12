"use client";

import React from "react";
import { Brain, TrendingUp, AlertTriangle, Target, ExternalLink } from "lucide-react";

interface AiExecutiveBriefingProps {
  onOpenCopilot?: (prompt?: string) => void;
}

export function AiExecutiveBriefing({ onOpenCopilot }: AiExecutiveBriefingProps) {
  return (
    <div className="rounded-2xl p-6 bg-[#0b0f1a]/95 backdrop-blur-xl border border-white/10 shadow-xl relative overflow-hidden">
      {/* Decorative cyber ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-b from-blue-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header do Briefing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-white/10 gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0c101d] border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10 shrink-0">
            <Brain className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Briefing Executivo Diário • RN Intelligence
            </h2>
            <p className="text-xs text-slate-400">
              Diagnóstico autônomo gerado a partir de 13.7k transações colunares no DuckDB
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            Engine v2.4 • Gemini OLAP
          </span>
        </div>
      </div>

      {/* 3 Pilares do Diagnóstico Executivo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {/* Pilar 1: Destaque Positivo */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <TrendingUp className="w-3.5 h-3.5" /> 1. Alavanca de Receita
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Superou Meta
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              Tração do B2B Enterprise & Sudeste
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              O canal <strong className="text-white">B2B Enterprise</strong> gerou R$ 16.4M (+18.4% YoY) com ticket médio de R$ 3.353. A regional Sudeste concentrou 50.4% do faturamento total com margem de 44.3%.
            </p>
          </div>

          {onOpenCopilot && (
            <button
              type="button"
              onClick={() =>
                onOpenCopilot(
                  "Detalhe como o canal B2B Enterprise e a regional Sudeste lideraram o faturamento no período."
                )
              }
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-medium transition-all cursor-pointer"
            >
              <span>Aprofundar Alavanca no Chat</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Pilar 2: Ponto de Atenção */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <AlertTriangle className="w-3.5 h-3.5" /> 2. Risco de Margem
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Erosão em Hardware
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              Descontos no Canal Parceiros
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              O canal <strong className="text-white">Canais & Parceiros</strong> concedeu 12.4% em descontos médios, comprimindo a margem para 38.6%. SKUs de Hardware operam com margem de 15-18%.
            </p>
          </div>

          {onOpenCopilot && (
            <button
              type="button"
              onClick={() =>
                onOpenCopilot(
                  "Quais produtos e representantes mais concederam descontos no canal Canais & Parceiros?"
                )
              }
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-amber-300 text-[11px] font-mono font-medium transition-all cursor-pointer"
            >
              <span>Investigar Risco no Chat</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Pilar 3: Ação Tática */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <Target className="w-3.5 h-3.5" /> 3. Ação Recomendada
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Próximo Quarter
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              Foco em Suíte Governança & Teto de Desconto
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Expandir contratos do módulo de governança nos 40 clientes corporativos ativos, limitando a alçada de desconto em parceiros a 7.5% para preservar margem orçada.
            </p>
          </div>

          {onOpenCopilot && (
            <button
              type="button"
              onClick={() =>
                onOpenCopilot(
                  "Como implementar o teto de 7.5% de desconto em parceiros sem reduzir o volume de vendas?"
                )
              }
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-medium transition-all cursor-pointer"
            >
              <span>Simular Ação no Chat</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}