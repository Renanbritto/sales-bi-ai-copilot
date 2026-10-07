"use client";

import React from "react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { RegionBreakdown } from "@/lib/api";
import { MapPin, Globe, TrendingUp, Users, ArrowUpRight, DollarSign } from "lucide-react";

interface RegionalAnalysisProps {
  regions: RegionBreakdown[];
}

export function RegionalAnalysis({ regions }: RegionalAnalysisProps) {
  return (
    <div className="space-y-6">
      {/* Cards de Macro-regiões */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {regions.map((reg) => (
          <div
            key={reg.region}
            className="glass-panel glass-panel-hover rounded-xl p-5 border border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-950"
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <span className="font-bold text-white text-base flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Região {reg.region}
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {reg.share_pct}% do Total
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Faturamento:</span>
                <span className="font-bold text-white font-mono">{formatCurrency(reg.revenue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Margem Bruta:</span>
                <span className="font-bold text-emerald-400 font-mono">{reg.margin_pct}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Ticket Médio:</span>
                <span className="font-medium text-slate-200 font-mono">{formatCurrency(reg.avg_ticket)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Clientes Ativos:</span>
                <span className="font-medium text-slate-300">{reg.clients_count} contas B2B</span>
              </div>
            </div>

            {/* Barra de progresso visual do share */}
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${reg.share_pct}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabela Detalhada Geográfica */}
      <div className="glass-panel rounded-xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" /> Distribuição Geográfica & Estados Atendidos
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Performance comercial cruzada com dimensões de clientes e representantes.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/40">
                <th className="py-3 px-4 font-medium">Macrorregião</th>
                <th className="py-3 px-4 font-medium">Estados (UFs)</th>
                <th className="py-3 px-4 font-medium text-right">Faturamento Líquido</th>
                <th className="py-3 px-4 font-medium text-right">Participação %</th>
                <th className="py-3 px-4 font-medium text-right">Margem %</th>
                <th className="py-3 px-4 font-medium text-right">Volume Pedidos</th>
                <th className="py-3 px-4 font-medium text-right">Ticket Médio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {regions.map((r) => (
                <tr key={r.region} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{r.region}</td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono">{r.total_states} estados (SP, RJ, MG, etc.)</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-cyan-300">
                    {formatCurrency(r.revenue)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-white">
                    {r.share_pct.toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-400 font-bold">
                    {r.margin_pct.toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                    {formatNumber(r.orders)} pedidos
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-200">
                    {formatCurrency(r.avg_ticket)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
