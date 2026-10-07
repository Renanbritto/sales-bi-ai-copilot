"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { SalesRep } from "@/lib/api";
import { Trophy, Sparkles, Cpu } from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface RepsLeaderboardProps {
  reps: SalesRep[];
}

const RADAR_DATA = [
  { subject: "Atingimento Quota", Sudeste: 135, Sul: 143, Nordeste: 115, CentroOeste: 90 },
  { subject: "Margem Lucro %", Sudeste: 44, Sul: 44, Nordeste: 43, CentroOeste: 43 },
  { subject: "Ticket Médio", Sudeste: 105, Sul: 103, Nordeste: 98, CentroOeste: 92 },
  { subject: "Volume Pedidos", Sudeste: 120, Sul: 115, Nordeste: 85, CentroOeste: 70 },
  { subject: "Retenção Contas", Sudeste: 95, Sul: 92, Nordeste: 88, CentroOeste: 84 },
];

function AiFuturisticRadarTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;

  return (
    <div className="rounded-2xl p-3.5 bg-[#070e1b]/98 backdrop-blur-2xl border border-cyan-500/50 shadow-[0_12px_40px_rgba(6,182,212,0.3)] text-xs text-slate-100 min-w-[220px]">
      <div className="flex items-center gap-1.5 pb-1.5 mb-1.5 border-b border-cyan-500/20 text-[10px] font-mono text-cyan-400">
        <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
        <span>Radar Benchmark (IA)</span>
      </div>
      <p className="font-bold text-white mb-2">{d.subject}</p>
      <div className="space-y-1 text-xs">
        <div className="flex items-center justify-between text-cyan-300">
          <span>Sudeste:</span>
          <span className="font-mono font-bold">{d.Sudeste} pts</span>
        </div>
        <div className="flex items-center justify-between text-emerald-300">
          <span>Sul:</span>
          <span className="font-mono font-bold">{d.Sul} pts</span>
        </div>
      </div>
      <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-1">
        <Cpu className="w-3 h-3 text-cyan-400 shrink-0" />
        <span>Sul supera Sudeste em quota por +8 pts.</span>
      </div>
    </div>
  );
}

export function RepsLeaderboard({ reps }: RepsLeaderboardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Tabela Leaderboard (2 colunas) */}
      <div className="lg:col-span-2 glass-panel rounded-xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> Leaderboard da Equipe Comercial
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Performance de vendas individuais com cálculo de atingimento de quota e margem.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            Top Performer: Marina Santos (148%)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="pb-3 pl-2">Pos</th>
                <th className="pb-3">Vendedor</th>
                <th className="pb-3">Região</th>
                <th className="pb-3 text-right">Faturamento</th>
                <th className="pb-3 text-right">Meta</th>
                <th className="pb-3 text-right">Atingimento</th>
                <th className="pb-3 text-right">Margem %</th>
                <th className="pb-3 text-right pr-2">Pedidos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {reps.map((rep, idx) => {
                const rank = idx + 1;
                const isTop3 = rank <= 3;
                const medalColors = [
                  "text-amber-400 bg-amber-500/10 border-amber-500/30",
                  "text-slate-300 bg-slate-500/10 border-slate-400/30",
                  "text-amber-600 bg-amber-700/10 border-amber-700/30",
                ];

                return (
                  <tr key={rep.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 pl-2 font-mono">
                      {isTop3 ? (
                        <span
                          className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs border ${
                            medalColors[rank - 1]
                          }`}
                        >
                          {rank}
                        </span>
                      ) : (
                        <span className="text-slate-500 ml-2 font-mono">{rank}</span>
                      )}
                    </td>
                    <td className="py-3 font-semibold text-white">
                      {rep.name}
                      {rank === 1 && (
                        <span className="ml-2 text-[10px] text-amber-400 font-mono">MVP</span>
                      )}
                    </td>
                    <td className="py-3 text-slate-400">{rep.region}</td>
                    <td className="py-3 text-right font-mono text-cyan-300 font-semibold">
                      {formatCurrency(rep.achieved)}
                    </td>
                    <td className="py-3 text-right font-mono text-slate-400">
                      {formatCurrency(rep.quota)}
                    </td>
                    <td className="py-3 text-right font-mono">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          rep.pct >= 130
                            ? "bg-emerald-500/20 text-emerald-400"
                            : rep.pct >= 100
                            ? "bg-cyan-500/20 text-cyan-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {rep.pct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-slate-300">{rep.margin}%</td>
                    <td className="py-3 text-right pr-2 font-mono text-slate-400">
                      {formatNumber(rep.deals)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Radar de Competências / Performance */}
      <div className="glass-panel rounded-xl p-6 border border-slate-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Radar Regional
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400">
              Benchmark IA
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Comparativo multidimensional entre as duas maiores regionais: Sudeste vs Sul.
          </p>
        </div>

        <div className="h-[280px] w-full flex items-center justify-center">
          {!mounted ? (
            <div className="text-slate-500 text-xs">Carregando radar...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={RADAR_DATA}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis stroke="#475569" fontSize={9} />
                <Radar
                  name="Sudeste"
                  dataKey="Sudeste"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.35}
                />
                <Radar
                  name="Sul"
                  dataKey="Sul"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.35}
                />
                <Tooltip content={<AiFuturisticRadarTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-around text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-500" />
            <span className="text-slate-300">Sudeste (50.4%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Sul (24.8%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
