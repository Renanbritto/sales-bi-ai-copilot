"use client";

import React from "react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ChannelItem } from "@/lib/api";
import { Network, TrendingUp, AlertTriangle, ArrowUpRight, DollarSign } from "lucide-react";

interface ChannelPerformanceProps {
  channels: ChannelItem[];
}

export function ChannelPerformance({ channels }: ChannelPerformanceProps) {
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-400" /> Matriz de Performance & Erosão de Descontos por Canal
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Avaliação de faturamento bruto vs. descontos concedidos vs. faturamento líquido e margem.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/40">
                <th className="py-3 px-4 font-medium">Canal Comercial</th>
                <th className="py-3 px-4 font-medium text-right">Faturamento Bruto</th>
                <th className="py-3 px-4 font-medium text-right">Descontos Concedidos</th>
                <th className="py-3 px-4 font-medium text-right">Taxa Desconto %</th>
                <th className="py-3 px-4 font-medium text-right">Faturamento Líquido</th>
                <th className="py-3 px-4 font-medium text-right">Margem %</th>
                <th className="py-3 px-4 font-medium text-right">Volume Pedidos</th>
                <th className="py-3 px-4 font-medium text-right">Ticket Médio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {channels.map((c) => {
                const discountAlert = c.discount_pct > 10;
                return (
                  <tr key={c.channel} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      {c.channel}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                      {formatCurrency(c.gross_revenue)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-amber-400">
                      -{formatCurrency(c.total_discount)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                          discountAlert
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {c.discount_pct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-cyan-300">
                      {formatCurrency(c.actual)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                      {c.margin.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                      {formatNumber(c.orders)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-200">
                      {formatCurrency(c.ticket)}
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
