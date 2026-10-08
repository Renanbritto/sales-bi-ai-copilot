"use client";

import React from "react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ParetoProduct } from "@/lib/api";
import { Award, AlertTriangle, Layers, ExternalLink, Cpu } from "lucide-react";

interface ParetoSectionProps {
  products: ParetoProduct[];
  onOpenCopilot?: (prompt?: string) => void;
}

export function ParetoSection({ products, onOpenCopilot }: ParetoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Classe A */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/50 shadow-xs p-5 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 flex items-center gap-1.5 font-mono">
                <Award className="w-4 h-4" /> Classe A (Críticos)
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-700 font-bold border border-slate-200 dark:border-slate-700/50 font-mono">
                82.0% Receita
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-200 mt-2">4 SKUs Estratégicos</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Enterprise Analytics, Cloud Server, RN Intelligence Enterprise Add-on e Governance Suite concentram 82% da receita total.
            </p>
          </div>

          {onOpenCopilot && (
            <button
              type="button"
              onClick={() => onOpenCopilot("Qual a concentração de receita nos produtos Classe A e quais clientes mais compram?")}
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-500/15 text-blue-700 text-[11px] font-mono transition-colors border border-slate-200 dark:border-slate-700/50 cursor-pointer"
            >
              <span>Analisar Classe A na RN Intelligence</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Classe B */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/50 shadow-xs p-5 rounded-xl border border-blue-500/30 bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 flex items-center gap-1.5 font-mono">
                <Layers className="w-4 h-4" /> Classe B (Intermediários)
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-700 font-bold border border-blue-500/30 font-mono">
                13.0% Receita
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-200 mt-2">6 SKUs em Crescimento</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Soluções preditivas e consultoria de dados mantêm tração saudável e alto potencial de migração para Classe A.
            </p>
          </div>

          {onOpenCopilot && (
            <button
              type="button"
              onClick={() => onOpenCopilot("Como acelerar os produtos da Classe B para que se tornem Classe A?")}
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 text-[11px] font-mono transition-colors border border-blue-500/30 cursor-pointer"
            >
              <span>Estratégia de Expansão na RN Intelligence</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Classe C */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/50 shadow-xs p-5 rounded-xl border border-amber-500/30 bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-mono">
                <AlertTriangle className="w-4 h-4" /> Classe C (Cauda Longa)
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 font-mono">
                5.0% Receita
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-200 mt-2">10 SKUs Dispersos</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Produtos e cabos legados com alto custo de estocagem e baixo retorno. Recomendação: Racionalizar catálogo.
            </p>
          </div>

          {onOpenCopilot && (
            <button
              type="button"
              onClick={() => onOpenCopilot("Quais produtos Classe C podem ser descontinuados para liberar capital de giro?")}
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-mono transition-colors border border-amber-500/30 cursor-pointer"
            >
              <span>Avaliar Descontinuação na RN Intelligence</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Tabela da Curva ABC */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/50 shadow-xs rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 tracking-tight">Curva ABC de Faturamento e Margem</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">
              Classificação cumulativa dos produtos do portfólio de acordo com a regra de Pareto (80/20).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 font-medium">
                <th className="py-3 px-3">Classe</th>
                <th className="py-3 px-3">Produto</th>
                <th className="py-3 px-3 text-right">Faturamento Total</th>
                <th className="py-3 px-3 text-right">Part. %</th>
                <th className="py-3 px-3 text-right">Acumulado %</th>
                <th className="py-3 px-3 text-right">Margem %</th>
                <th className="py-3 px-3 text-right">Volume</th>
                <th className="py-3 px-3 text-center">RN Intelligence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {products.map((p) => {
                const badgeColor =
                  p.class === "A"
                    ? "bg-blue-500/15 text-blue-700 border-slate-200 dark:border-slate-700/50"
                    : p.class === "B"
                    ? "bg-blue-500/20 text-blue-700 border-blue-500/40"
                    : "bg-slate-100 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50";

                return (
                  <tr key={p.code} className="hover:bg-slate-100/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded border text-[11px] ${badgeColor}`}>
                        Classe {p.class}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-200">{p.name}</td>
                    <td className="py-3 px-3 text-right font-mono text-blue-700 font-bold">
                      {formatCurrency(p.revenue)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-300">{p.pct}%</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-500 dark:text-slate-400 dark:text-slate-500">{p.cumPct}%</td>
                    <td className="py-3 px-3 text-right font-mono">
                      <span
                        className={`font-semibold ${
                          p.margin >= 40 ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {p.margin}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-300">{formatNumber(p.volume)}</td>
                    <td className="py-3 px-3 text-center">
                      {onOpenCopilot && (
                        <button
                          type="button"
                          onClick={() => onOpenCopilot(`Analise a performance de vendas, volume e margem do produto ${p.name}.`)}
                          className="p-1 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-blue-600 hover:text-slate-700 dark:text-slate-200 hover:border-blue-400 transition-colors"
                          title="Analisar na RN Intelligence"
                        >
                          <Cpu className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
