"use client";

import React from "react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { SegmentBreakdown, TopClient } from "@/lib/api";
import { Building2, Users, Star, ArrowUpRight, ShieldCheck } from "lucide-react";

interface CustomerSegmentsProps {
  segments: SegmentBreakdown[];
  topClients: TopClient[];
}

export function CustomerSegments({ segments, topClients }: CustomerSegmentsProps) {
  return (
    <div className="space-y-6">
      {/* Grid de Segmentos de Mercado */}
      <div className="glass-panel rounded-xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" /> Faturamento por Segmento de Mercado (B2B)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Análise de receita, margem de contribuição e ticket por vertical de atuação.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {segments.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="font-bold text-white text-sm">{s.segment}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {s.size}
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Receita Total:</span>
                  <span className="font-bold text-white font-mono">{formatCurrency(s.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Margem Média:</span>
                  <span className="font-bold text-emerald-400 font-mono">{s.margin_pct.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ticket Médio:</span>
                  <span className="font-medium text-slate-300 font-mono">{formatCurrency(s.avg_ticket)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contas:</span>
                  <span className="text-slate-300">{s.clients} clientes ({formatNumber(s.orders)} pedidos)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 10 Clientes Corporativos */}
      <div className="glass-panel rounded-xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" /> Top 10 Clientes Estratégicos (Maior LTV)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Contas de maior valor agregado (Key Accounts) com acompanhamento de margem e região.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/40">
                <th className="py-3 px-4 font-medium">Cliente / Razão Social</th>
                <th className="py-3 px-4 font-medium">Segmento</th>
                <th className="py-3 px-4 font-medium">Porte</th>
                <th className="py-3 px-4 font-medium">UF / Região</th>
                <th className="py-3 px-4 font-medium text-right">Total Faturado</th>
                <th className="py-3 px-4 font-medium text-right">Margem %</th>
                <th className="py-3 px-4 font-medium text-right">Pedidos</th>
                <th className="py-3 px-4 font-medium text-right">Ticket Médio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {topClients.map((c, i) => (
                <tr key={c.client_name} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-mono text-[10px] flex items-center justify-center">
                      {i + 1}
                    </span>
                    {c.client_name}
                  </td>
                  <td className="py-3 px-4 text-slate-300">{c.segment}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      {c.size}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono">{c.uf} - {c.region}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-cyan-300">
                    {formatCurrency(c.total_spent)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                    {c.margin_pct.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300">
                    {c.orders_count}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-200">
                    {formatCurrency(c.avg_ticket)}
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
