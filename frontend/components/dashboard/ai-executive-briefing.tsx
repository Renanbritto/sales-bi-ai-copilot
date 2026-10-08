"use client";

import React from "react";
import { Brain, TrendingUp, AlertTriangle, ArrowRight, Target, ExternalLink } from "lucide-react";

interface AiExecutiveBriefingProps {
  onOpenCopilot?: (prompt?: string) => void;
}

export function AiExecutiveBriefing({ onOpenCopilot }: AiExecutiveBriefingProps) {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-slate-900/80 to-blue-950/30 relative overflow-hidden">
      {/* Decorative cyber ambient glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-cyan-500/20 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Brain className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Briefing Executivo Diário • RN Intelligence
              
            </h2>
            <p className="text-[11px] text-slate-400">
              Diagnóstico executivo automatizado gerado pela RN Intelligence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Acurácia Analítica: 99.8%</span>
        </div>
      </div>

      {/* 3 Pilares do Diagnóstico Executivo com Gatilhos de Ação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pilar 1: Destaque Positivo */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/30 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <TrendingUp className="w-3.5 h-3.5" /> 1. Alavanca de Receita
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                Superou Meta
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Tração do B2B Enterprise & Sudeste</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              O canal <strong>B2B Enterprise</strong> gerou R$ 16.4M (+18.4% YoY) com ticket médio de R$ 3.353. A regional Sudeste concentrou 50.4% do faturamento total com margem de 44.3%.
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
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-medium transition-colors cursor-pointer"
            >
              <span>Aprofundar Alavanca na RN Intelligence</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Pilar 2: Ponto de Atenção */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-amber-500/30 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <AlertTriangle className="w-3.5 h-3.5" /> 2. Risco de Margem
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                Erosão em Hardware
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Descontos no Canal Parceiros</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              O canal <strong>Canais & Parceiros</strong> concedeu 12.4% em descontos médios, comprimindo a margem para 38.6%. SKUs de Hardware (Rack e Switches) operam com margem de apenas 15-18%.
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
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-medium transition-colors cursor-pointer"
            >
              <span>Investigar Risco na RN Intelligence</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Pilar 3: Ação Tática */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/30 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <Target className="w-3.5 h-3.5" /> 3. Ação Recomendada
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                Próximo Quarter
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Foco em Suíte Governança & Churn Zero</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Expandir contratos do módulo de governança nos 40 clientes corporativos ativos, limitando a alçada de desconto em parceiros a no máximo 7.5% para preservar margem orçada.
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
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-medium transition-colors cursor-pointer"
            >
              <span>Simular Ação na RN Intelligence</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
