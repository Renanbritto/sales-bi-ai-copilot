"use client";

import React from "react";
import { Users, FileText, Handshake, CheckCircle2 } from "lucide-react";

const FUNNEL_STAGES = [
  { stage: "1. Leads Gerados (MQL)", count: 14200, value: "R$ 48.5M", convRate: "100.0%", dropOff: "0%", color: "bg-sky-500", icon: Users },
  { stage: "2. Oportunidades Qualificadas (SQL)", count: 5200, value: "R$ 26.2M", convRate: "36.6%", dropOff: "-63.4%", color: "bg-blue-600", icon: FileText },
  { stage: "3. Propostas Comerciais Apresentadas", count: 2450, value: "R$ 16.4M", convRate: "47.1%", dropOff: "-52.9%", color: "bg-indigo-600", icon: FileText },
  { stage: "4. Negociação & Jurídico", count: 1480, value: "R$ 11.8M", convRate: "60.4%", dropOff: "-39.6%", color: "bg-purple-600", icon: Handshake },
  { stage: "5. Contratos Fechados & Faturados", count: 890, value: "R$ 8.95M", convRate: "60.1%", dropOff: "-39.9%", color: "bg-emerald-500", icon: CheckCircle2 },
];

export function FunnelChart() {
  return (
    <div className="glass-panel rounded-xl p-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Funil de Vendas Corporativo (B2B Pipeline)</h2>
          <p className="text-xs text-slate-400 mt-1">Taxas de conversão e perda por estágio do ciclo comercial.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 font-medium">
          Conversão Global MQL → Venda: 6.27%
        </span>
      </div>

      <div className="space-y-4">
        {FUNNEL_STAGES.map((stg, idx) => {
          const widthPct = Math.max(28, 100 - idx * 16);
          return (
            <div key={idx} className="relative">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 px-1">
                <span className="font-medium flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${stg.color}`} />
                  {stg.stage}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-slate-400">{stg.count.toLocaleString("pt-BR")} deals</span>
                  <span className="font-semibold text-white">{stg.value}</span>
                  <span className="text-cyan-400 font-mono text-[11px] bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    Conv: {stg.convRate}
                  </span>
                </div>
              </div>

              <div className="w-full bg-slate-900/80 rounded-lg h-9 p-1 border border-slate-800">
                <div
                  className={`h-full rounded-md ${stg.color} opacity-90 transition-all duration-500 flex items-center justify-end px-3 shadow-inner`}
                  style={{ width: `${widthPct}%` }}
                >
                  <span className="text-[11px] font-bold text-white drop-shadow-sm">
                    {stg.count.toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
