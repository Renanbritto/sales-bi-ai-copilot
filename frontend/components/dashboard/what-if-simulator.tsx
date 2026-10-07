"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Sliders, RefreshCw, Sparkles, TrendingUp, DollarSign, Target, ShieldCheck } from "lucide-react";

interface WhatIfSimulatorProps {
  baseRevenue: number;
  baseMarginPct: number;
}

export function WhatIfSimulator({ baseRevenue, baseMarginPct }: WhatIfSimulatorProps) {
  const [volumeDelta, setVolumeDelta] = useState<number>(5);     // +5% volume
  const [priceDelta, setPriceDelta] = useState<number>(3);       // +3% preço
  const [discountDelta, setDiscountDelta] = useState<number>(-2); // -2% desconto

  // Cálculo projetado
  const volumeMultiplier = 1 + volumeDelta / 100;
  const priceMultiplier = 1 + priceDelta / 100;
  const discountEfficiency = 1 - discountDelta / 100;

  const projectedRevenue = Math.round(baseRevenue * volumeMultiplier * priceMultiplier);
  const revenueDeltaAmount = projectedRevenue - baseRevenue;

  // Ajuste de margem
  const marginDelta = (priceDelta * 0.75) + (-discountDelta * 0.4) + (volumeDelta * 0.1);
  const projectedMarginPct = Math.min(65, Math.max(20, baseMarginPct + marginDelta));
  const baseMarginAmount = (baseRevenue * baseMarginPct) / 100;
  const projectedMarginAmount = (projectedRevenue * projectedMarginPct) / 100;
  const marginDeltaAmount = projectedMarginAmount - baseMarginAmount;

  const resetValues = () => {
    setVolumeDelta(0);
    setPriceDelta(0);
    setDiscountDelta(0);
  };

  return (
    <div className="glass-panel rounded-xl p-6 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Simulador Comercial What-If (Projeção em Tempo Real)
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
              Cenários Dinâmicos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simule variações de volume, tabela de preços e teto de descontos para projetar o impacto na receita e margem.
          </p>
        </div>

        <button
          type="button"
          onClick={resetValues}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-700/80 transition-colors cursor-pointer w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restaurar Cenário Base</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controles de Sliders */}
        <div className="space-y-6">
          {/* Slider 1: Volume */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">1. Crescimento no Volume de Vendas</span>
              <span className="font-mono font-bold text-cyan-400 text-sm">
                {volumeDelta > 0 ? `+${volumeDelta}%` : `${volumeDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              step="1"
              value={volumeDelta}
              onChange={(e) => setVolumeDelta(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-20% (Contração)</span>
              <span>0% (Atual)</span>
              <span>+30% (Expansão Agressiva)</span>
            </div>
          </div>

          {/* Slider 2: Preço Médio */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">2. Reajuste de Preço / Ticket Médio</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {priceDelta > 0 ? `+${priceDelta}%` : `${priceDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="20"
              step="1"
              value={priceDelta}
              onChange={(e) => setPriceDelta(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-10% (Desconto Geral)</span>
              <span>0% (Tabela Atual)</span>
              <span>+20% (Reprecificação Premium)</span>
            </div>
          </div>

          {/* Slider 3: Política de Descontos */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">3. Variação no Teto de Descontos Comerciais</span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {discountDelta > 0 ? `+${discountDelta}% (Mais desconto)` : `${discountDelta}% (Mais rigor)`}
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={discountDelta}
              onChange={(e) => setDiscountDelta(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-10% (Governança Forte)</span>
              <span>0% (Política Vigente)</span>
              <span>+10% (Flexibilização)</span>
            </div>
          </div>
        </div>

        {/* Painel de Resultados Projetados */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-slate-800">
              <span className="text-xs uppercase font-mono font-semibold tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Impacto Financeiro Projetado
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                PROJEÇÃO REAL
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400">Faturamento Líquido Projetado:</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <h3 className="text-2xl font-bold text-white font-mono">{formatCurrency(projectedRevenue)}</h3>
                  <span
                    className={`text-xs font-mono font-bold ${
                      revenueDeltaAmount >= 0 ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    ({revenueDeltaAmount >= 0 ? "+" : ""}{formatCurrency(revenueDeltaAmount)})
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400">Margem de Contribuição Projetada:</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <h3 className="text-2xl font-bold text-emerald-400 font-mono">
                    {projectedMarginPct.toFixed(1)}%
                  </h3>
                  <span className="text-xs text-slate-400">
                    ({formatCurrency(projectedMarginAmount)} em margem)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  💡 <strong>Diagnóstico da Simulação:</strong> Com esse ajuste de cenário, a empresa ganharia um adicional líquido de{" "}
                  <strong className="text-cyan-300 font-mono">{formatCurrency(marginDeltaAmount)}</strong> em margem de contribuição anual.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Base Atual: R$ 39.0M (43.0% margem)</span>
            <span className="text-emerald-400">Simulação Válida</span>
          </div>
        </div>
      </div>
    </div>
  );
}
