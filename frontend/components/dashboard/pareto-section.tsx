"use client";

import React from "react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ParetoProduct } from "@/lib/api";
import { Award, AlertTriangle, Sparkles, ExternalLink } from "lucide-react";

interface ParetoSectionProps {
  products: ParetoProduct[];
  onOpenCopilot?: (prompt?: string) => void;
}

export function ParetoSection({ products, onOpenCopilot }: ParetoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Classe A */}
        <div className="glass-panel p-5 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 to-slate-900/60 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-mono">
                <Award className="w-4 h-4" /> Classe A (Críticos)
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 font-mono">
                82.0% Receita
              </span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">4 SKUs Estratégicos</p>
            <p className="text-xs text-slate-300 mt-1">
              Enterprise Analytics, Cloud Server, AI Copilot Add-on e Governance Suite concentram 82% da receita total.
            </p>
          </div>

          {onOpenCopilot && (
            <button
              type="button"
              onClick={() => onOpenCopilot("Qual a concentração de receita nos produtos Classe A e quais clientes mais compram?")}
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-mono transition-colors border border-cyan-500/30 cursor-pointer"
            >
              <span>Analisar Classe A no Copilot</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Classe B */}
        <div className="glass-panel p-5 rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-950/30 to-slate-900/60 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-4 h-4" /> Classe B (Intermediários)
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30 font-mono">
                13.0% Receita
              </span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">6 SKUs em Crescimento</p>
            <p className="text-xs text-slate-300 mt-1">
              Soluções preditivas e consultoria de dados mantêm tração saudável e alto potencial de migração para Classe A.
            </p>
          </div>

          {onOpenCopilot && (
            <button
              type="button"
              onClick={() => onOpenCopilot("Como acelerar os produtos da Classe B para que se tornem Classe A?")}
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-[11px] font-mono transition-colors border border-blue-500/30 cursor-pointer"
            >
              <span>Estratégia de Expansão no Copilot</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Classe C */}
        <div className="glass-panel p-5 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 to-slate-900/60 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-mono">
                <AlertTriangle className="w-4 h-4" /> Classe C (Cauda Longa)
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 font-mono">
                5.0% Receita
              </span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">10 SKUs Dispersos</p>
            <p className="text-xs text-slate-300 mt-1">
              Produtos e cabos legados com alto custo de estocagem e baixo retorno. Recomendação: Racionalizar catálogo.
            </p>
          </div>

          {onOpenCopilot && (
            <button
              type="button"
              onClick={() => onOpenCopilot("Quais produtos Classe C podem ser descontinuados para liberar capital de giro?")}
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-mono transition-colors border border-amber-500/30 cursor-pointer"
            >
              <span>Avaliar Descontinuação no Copilot</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Tabela da Curva ABC */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Curva ABC de Faturamento e Margem</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Classificação cumulativa dos produtos do portfólio de acordo com a regra de Pareto (80/20).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/40 font-medium">
                <th className="py-3 px-3">Classe</th>
                <th className="py-3 px-3">Produto</th>
                <th className="py-3 px-3 text-right">Faturamento Total</th>
                <th className="py-3 px-3 text-right">Part. %</th>
                <th className="py-3 px-3 text-right">Acumulado %</th>
                <th className="py-3 px-3 text-right">Margem %</th>
                <th className="py-3 px-3 text-right">Volume</th>
                <th className="py-3 px-3 text-center">Copilot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {products.map((p) => {
                const badgeColor =
                  p.class === "A"
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                    : p.class === "B"
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                    : "bg-slate-800 text-slate-400 border-slate-700";

                return (
                  <tr key={p.code} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded border text-[11px] ${badgeColor}`}>
                        Classe {p.class}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">{p.name}</td>
                    <td className="py-3 px-3 text-right font-mono text-cyan-300 font-bold">
                      {formatCurrency(p.revenue)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">{p.pct}%</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400">{p.cumPct}%</td>
                    <td className="py-3 px-3 text-right font-mono">
                      <span
                        className={`font-semibold ${
                          p.margin >= 40 ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {p.margin}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">{formatNumber(p.volume)}</td>
                    <td className="py-3 px-3 text-center">
                      {onOpenCopilot && (
                        <button
                          type="button"
                          onClick={() => onOpenCopilot(`Analise a performance de vendas, volume e margem do produto ${p.name}.`)}
                          className="p-1 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-400 transition-colors"
                          title="Analisar no Copilot"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
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
