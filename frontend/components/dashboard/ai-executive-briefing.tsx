"use client";

import React from "react";
import { Brain, TrendingUp, AlertTriangle, ArrowRight, Target, ExternalLink } from "lucide-react";

interface AiExecutiveBriefingProps {
  onOpenCopilot?: (prompt?: string) => void;
}

export function AiExecutiveBriefing({ onOpenCopilot }: AiExecutiveBriefingProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-xs relative overflow-hidden">
      {/* Decorative cyber ambient glow */}
      
      

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800/50 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 px-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-sm shadow-blue-900/20 shrink-0">
            <img src="/logo_transparent.png" alt="RN Intelligence" className="h-4.5 w-auto object-contain" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-700 dark:text-slate-200 tracking-tight flex items-center gap-2">
              Briefing Executivo Diário • RN Intelligence
              
            </h2>
            
          </div>
        </div>

        
      </div>

      {/* 3 Pilares do Diagnóstico Executivo com Gatilhos de Ação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pilar 1: Destaque Positivo */}
        <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <TrendingUp className="w-3.5 h-3.5" /> 1. Alavanca de Receita
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Superou Meta
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">Tração do B2B Enterprise & Sudeste</h3>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
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
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[11px] font-mono font-medium transition-colors cursor-pointer"
            >
              <span>Aprofundar Alavanca na RN Intelligence</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Pilar 2: Ponto de Atenção */}
        <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 hover:border-amber-300 dark:hover:border-amber-700/50 transition-all flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-700 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <AlertTriangle className="w-3.5 h-3.5" /> 2. Risco de Margem
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                Erosão em Hardware
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">Descontos no Canal Parceiros</h3>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
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
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 hover:bg-amber-100 dark:hover:bg-amber-900 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-[11px] font-mono font-medium transition-colors cursor-pointer"
            >
              <span>Investigar Risco na RN Intelligence</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Pilar 3: Ação Tática */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/50 hover:border-slate-200 dark:border-slate-700/50 transition-all flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-blue-700 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <Target className="w-3.5 h-3.5" /> 3. Ação Recomendada
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                Próximo Quarter
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">Foco em Suíte Governança & Churn Zero</h3>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
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
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 border border-slate-200 dark:border-slate-700/50 text-blue-600 text-[11px] font-mono font-medium transition-colors cursor-pointer"
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
 