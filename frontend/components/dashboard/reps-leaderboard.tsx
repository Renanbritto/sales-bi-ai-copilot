import React from "react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { SalesRep } from "@/lib/api";
import { Trophy, TrendingUp, CheckCircle2, AlertTriangle, ArrowUpRight } from "lucide-react";
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

export function RepsLeaderboard({ reps }: RepsLeaderboardProps) {
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
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/40">
                <th className="py-3 px-3 font-medium">Posição</th>
                <th className="py-3 px-3 font-medium">Vendedor</th>
                <th className="py-3 px-3 font-medium">Regional</th>
                <th className="py-3 px-3 font-medium text-right">Faturado</th>
                <th className="py-3 px-3 font-medium text-right">Atingimento</th>
                <th className="py-3 px-3 font-medium text-right">Ticket Médio</th>
                <th className="py-3 px-3 font-medium text-right">Margem %</th>
                <th className="py-3 px-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {reps.map((r, idx) => {
                const statusColor =
                  r.status === "Superou"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : r.status === "Atingiu"
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/30";

                return (
                  <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-300">
                      {idx === 0 ? "🥇 1º" : idx === 1 ? "🥈 2º" : idx === 2 ? "🥉 3º" : `#${idx + 1}`}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{r.name}</div>
                      <div className="text-[11px] text-slate-500">{r.deals} negócios fechados</div>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{r.region}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      {formatCurrency(r.achieved)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-cyan-400">
                      {r.pct.toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">
                      {formatCurrency(r.avgTicket)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-400">
                      {r.margin.toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusColor}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Radar Multidimensional Regional (1 coluna) */}
      <div className="glass-panel rounded-xl p-6 border border-slate-800 flex flex-col justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Equilíbrio Multidimensional Regional</h2>
          <p className="text-xs text-slate-400 mt-1">Comparativo de forças entre Sudeste e Sul.</p>
        </div>

        <div className="h-[280px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={RADAR_DATA}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{ fill: "#64748b", fontSize: 9 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-2.5 rounded shadow text-xs">
                        <p className="font-bold text-white mb-1">{d.subject}</p>
                        <p className="text-cyan-400">Sudeste: {d.Sudeste}</p>
                        <p className="text-emerald-400">Sul: {d.Sul}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Radar name="Sudeste" dataKey="Sudeste" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.35} />
              <Radar name="Sul" dataKey="Sul" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>Sudeste</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Sul</span>
          </div>
        </div>
      </div>
    </div>
  );
}
