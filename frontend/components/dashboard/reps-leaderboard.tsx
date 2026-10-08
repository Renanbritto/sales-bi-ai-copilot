"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { SalesRep } from "@/lib/api";
import { Trophy, Cpu, ExternalLink } from "lucide-react";
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
  onOpenCopilot?: (prompt?: string) => void;
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
    <div className="rounded-2xl p-3.5 bg-white/98 backdrop-blur-2xl border border-slate-200 shadow-lg text-xs text-slate-700 min-w-[220px]">
      <div className="flex items-center gap-1.5 pb-1.5 mb-1.5 border-b border-slate-200 text-[10px] font-mono text-blue-600">
        <Cpu className="w-3 h-3 text-blue-700" />
        <span>Radar Benchmark (RN Intelligence)</span>
      </div>
      <p className="font-bold text-slate-700 mb-2">{d.subject}</p>
      <div className="space-y-1 text-xs">
        <div className="flex items-center justify-between text-blue-700">
          <span>Sudeste:</span>
          <span className="font-mono font-bold">{d.Sudeste} pts</span>
        </div>
        <div className="flex items-center justify-between text-emerald-300">
          <span>Sul:</span>
          <span className="font-mono font-bold">{d.Sul} pts</span>
        </div>
      </div>
      <div className="mt-2 pt-1.5 border-t border-slate-200 text-[10px] text-slate-500 flex items-center gap-1">
        <Cpu className="w-3 h-3 text-blue-600 shrink-0" />
        <span>Sul supera Sudeste em quota por +8 pts.</span>
      </div>
    </div>
  );
}

export function RepsLeaderboard({ reps, onOpenCopilot }: RepsLeaderboardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Tabela Leaderboard (2 colunas) */}
      <div className="lg:col-span-2 bg-white border border-slate-200 shadow-xs rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> Leaderboard da Equipe Comercial
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Performance de vendas individuais com cálculo de atingimento de quota, margem e diagnósticos IA.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            Top Performer: Marina Santos (148%)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-medium bg-slate-50">
                <th className="py-3 pl-2">Pos</th>
                <th className="py-3">Vendedor</th>
                <th className="py-3">Região</th>
                <th className="py-3 text-right">Faturamento</th>
                <th className="py-3 text-right">Meta</th>
                <th className="py-3 text-right">Atingimento</th>
                <th className="py-3 text-right">Margem %</th>
                <th className="py-3 text-right">Pedidos</th>
                <th className="py-3 text-center pr-2">RN Intelligence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {reps.map((rep, idx) => {
                const rank = idx + 1;
                const isTop3 = rank <= 3;
                const medalColors = [
                  "text-amber-400 bg-amber-500/10 border-amber-500/30",
                  "text-slate-600 bg-slate-500/10 border-slate-400/30",
                  "text-amber-600 bg-amber-700/10 border-amber-700/30",
                ];

                return (
                  <tr key={rep.id} className="hover:bg-slate-100/40 transition-colors">
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
                    <td className="py-3 font-semibold text-slate-700">
                      {rep.name}
                      {rank === 1 && (
                        <span className="ml-2 text-[10px] text-amber-400 font-mono">MVP</span>
                      )}
                    </td>
                    <td className="py-3 text-slate-500">{rep.region}</td>
                    <td className="py-3 text-right font-mono text-blue-700 font-semibold">
                      {formatCurrency(rep.achieved)}
                    </td>
                    <td className="py-3 text-right font-mono text-slate-500">
                      {formatCurrency(rep.quota)}
                    </td>
                    <td className="py-3 text-right font-mono">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          rep.pct >= 130
                            ? "bg-emerald-500/20 text-emerald-400"
                            : rep.pct >= 100
                            ? "bg-blue-500/15 text-blue-600"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {rep.pct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-slate-600">{rep.margin}%</td>
                    <td className="py-3 text-right font-mono text-slate-500">
                      {formatNumber(rep.deals)}
                    </td>
                    <td className="py-3 text-center pr-2">
                      {onOpenCopilot && (
                        <button
                          type="button"
                          onClick={() =>
                            onOpenCopilot(
                              `Analise a performance individual do vendedor ${rep.name} (${rep.region}), atingimento de ${rep.pct.toFixed(1)}% da quota e margem de ${rep.margin}%.`
                            )
                          }
                          className="p-1 rounded-lg bg-slate-50 border border-slate-200 text-blue-600 hover:text-slate-700 hover:border-blue-400 transition-colors"
                          title="Analisar performance na RN Intelligence"
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

      {/* Radar de Competências / Performance */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-700 tracking-tight flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" /> Radar Regional
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-blue-600">
              RN Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Comparativo multidimensional entre as duas maiores regionais: Sudeste vs Sul.
          </p>
        </div>

        <div className="h-[280px] w-full flex items-center justify-center">
          {!mounted ? (
            <div className="text-slate-500 text-xs">Carregando radar...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={RADAR_DATA}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis stroke="#475569" fontSize={9} />
                <Radar
                  name="Sudeste"
                  dataKey="Sudeste"
                  stroke="#3b82f6"
                  fill="#3b82f6"
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

        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-around text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-slate-600">Sudeste (50.4%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Sul (24.8%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
