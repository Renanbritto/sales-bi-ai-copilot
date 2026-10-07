import React from "react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ParetoProduct } from "@/lib/api";
import { Award, AlertTriangle, Sparkles, TrendingUp } from "lucide-react";

interface ParetoSectionProps {
  products: ParetoProduct[];
}

export function ParetoSection({ products }: ParetoSectionProps) {
  return (
    <div className="space-y-6">
      {/* Cards de Destaque ABC */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 to-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Classe A (Críticos)
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              82.0% do Faturamento
            </span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">4 SKUs Principais</p>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise Analytics, Cloud Migration, DW Node e Templates respondem pelo cerne do resultado.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-950/30 to-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Classe B (Intermediários)
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
              13.0% do Faturamento
            </span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">2 SKUs Complementares</p>
          <p className="text-xs text-slate-400 mt-1">
            ETL Connector Hub e Consultoria de Governança mantêm receita recorrente saudável.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 to-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Classe C (Baixo Impacto)
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              5.0% do Faturamento
            </span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">2 SKUs de Hardware</p>
          <p className="text-xs text-slate-400 mt-1">
            Servidores e Switches possuem baixa margem (15-18%) e exigem revisão de custos.
          </p>
        </div>
      </div>

      {/* Tabela Detalhada com Curva ABC */}
      <div className="glass-panel rounded-xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Matriz de Produtos & Curva ABC (Pareto)</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Classificação dinâmica baseada no percentual acumulado de receita gerado no DuckDB.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/40">
                <th className="py-3 px-4 font-medium">Rank</th>
                <th className="py-3 px-4 font-medium">SKU / Produto</th>
                <th className="py-3 px-4 font-medium">Categoria</th>
                <th className="py-3 px-4 font-medium text-right">Faturamento</th>
                <th className="py-3 px-4 font-medium text-right">Share %</th>
                <th className="py-3 px-4 font-medium text-right">Acumulado %</th>
                <th className="py-3 px-4 font-medium text-center">Classe</th>
                <th className="py-3 px-4 font-medium text-right">Margem %</th>
                <th className="py-3 px-4 font-medium text-right">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {products.map((p) => {
                const badgeColor =
                  p.class === "A"
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                    : p.class === "B"
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/40";

                return (
                  <tr key={p.code} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">#{p.rank}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{p.name}</div>
                      <div className="text-[11px] font-mono text-slate-500">{p.code}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{p.category}</td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-200">
                      {formatCurrency(p.revenue)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300">{p.pct.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-cyan-400">
                      {p.cumPct.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${badgeColor}`}>
                        {p.class}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-400 font-medium">
                      {p.margin.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">
                      {formatNumber(p.volume)} un
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
