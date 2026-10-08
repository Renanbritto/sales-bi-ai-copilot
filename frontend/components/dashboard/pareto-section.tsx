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
        <div className="bg-blue-50/40 dark:bg-slate-900 border border-blue-200 dark:border-blue-500/30 p-5 rounded-xl shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5 font-mono">
                <Award className="w-4 h-4" /> Classe A (Críticos)
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800/80 font-mono">
                82.0% Receita
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">4 SKUs Estratégicos</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Enterprise Analytics, Cloud Server, RN Intelligence Enterprise Add-on e Governance Suite concentram 82% da receita total.
            </p>
          </div>

          {onOpenCopilot && (
            <button
              type="button"
              onClick={() => onOpenCopilot("Qual a concentração de receita nos produtos Classe A e quais clientes mais compram?")}
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-blue-100/80 dark:bg-blue-950/50 hover:bg-blue-200/80 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[11px] font-mono transition-colors border border-blue-200 dark:border-blue-800 cursor-pointer"
            >
              <span>Analisar Classe A na RN Intelligence</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Classe B */}
        <div className="bg-indigo-50/40 dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500/30 p-5 rounded-xl shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 font-mono">
                <Layers className="w-4 h-4" /> Classe B (Intermediários)
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800/80 font-mono">
                13.0% Receita
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">6 SKUs em Crescimento</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Soluções preditivas e consultoria de dados mantêm tração saudável e alto potencial de migração para Classe A.
            </p>
          </div>

          {onOpenCopilot && (
            <button
              type="button"
              onClick={() => onOpenCopilot("Como acelerar os produtos da Classe B para que se tornem Classe A?")}
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-indigo-100/80 dark:bg-indigo-950/50 hover:bg-indigo-200/80 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-mono transition-colors border border-indigo-200 dark:border-indigo-800 cursor-pointer"
            >
              <span>Estratégia de Expansão na RN Intelligence</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Classe C */}
        <div className="bg-amber-50/40 dark:bg-slate-900 border border-amber-200 dark:border-amber-500/30 p-5 rounded-xl shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-mono">
                <AlertTriangle className="w-4 h-4" /> Classe C (Cauda Longa)
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-800/80 font-mono">
                5.0% Receita
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">10 SKUs Dispersos</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Produtos e cabos legados com alto custo de estocagem e baixo retorno. Recomendação: Racionalizar catálogo.
            </p>
          </div>

          {onOpenCopilot && (
            <button
              type="button"
              onClick={() => onOpenCopilot("Quais produtos Classe C podem ser descontinuados para liberar capital de giro?")}
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-amber-100/80 dark:bg-amber-950/50 hover:bg-amber-200/80 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-[11px] font-mono transition-colors border border-amber-200 dark:border-amber-800 cursor-pointer"
            >
              <span>Avaliar Descontinuação na RN Intelligence</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Tabela da Curva ABC */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Curva ABC de Faturamento e Margem</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Classificação cumulativa dos produtos do portfólio de acordo com a regra de Pareto (80/20).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 font-medium">
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
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {products.map((p) => {
                const badgeColor =
                  p.class === "A"
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/80"
                    : p.class === "B"
                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/80"
                    : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/80";

                return (
                  <tr key={p.code} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded border text-[11px] ${badgeColor}`}>
                        Classe {p.class}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-200">{p.name}</td>
                    <td className="py-3 px-3 text-right font-mono text-blue-600 dark:text-blue-400 font-bold">
                      {formatCurrency(p.revenue)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-300">{p.pct}%</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-500 dark:text-slate-400">{p.cumPct}%</td>
                    <td className="py-3 px-3 text-right font-mono">
                      <span
                        className={`font-semibold ${
                          p.margin >= 40 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
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
                          className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
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
