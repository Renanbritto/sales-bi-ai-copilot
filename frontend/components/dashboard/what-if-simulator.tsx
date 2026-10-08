"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  Sliders,
  RefreshCw,
  Zap,
  TrendingUp,
  DollarSign,
  Target,
  ShieldCheck,
  Cpu,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";

interface WhatIfSimulatorProps {
  baseRevenue: number;
  baseMarginPct: number;
  onOpenCopilot?: (prompt?: string) => void;
}

export function WhatIfSimulator({ baseRevenue, baseMarginPct, onOpenCopilot }: WhatIfSimulatorProps) {
  const [volumeDelta, setVolumeDelta] = useState<number>(5);     // +5% volume
  const [priceDelta, setPriceDelta] = useState<number>(3);       // +3% preço
  const [discountDelta, setDiscountDelta] = useState<number>(-2); // -2% desconto
  const [showAiDiagnosis, setShowAiDiagnosis] = useState<boolean>(true);

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

  // Diagnóstico dinâmico da IA baseado nos parâmetros
  const isLucrativo = marginDeltaAmount > 0 && revenueDeltaAmount > 0;
  let aiSummary = "";
  if (priceDelta > 0 && discountDelta <= 0) {
    aiSummary = `Cenário Otimista: Aumento de preço de +${priceDelta}% combinado à contenção de descontos (${discountDelta}%) gera um ganho expressivo de +${formatCurrency(marginDeltaAmount)} em margem líquida, blindando a rentabilidade corporativa.`;
  } else if (volumeDelta > 10 && priceDelta < 0) {
    aiSummary = `Estratégia de Penetração de Mercado: Volume acelerado (+${volumeDelta}%) compensa a redução de preços, porém a margem sofre compressão de ${(marginDelta).toFixed(1)} p.p. Risco de canibalização nos canais parceiros.`;
  } else if (discountDelta > 5) {
    aiSummary = `Atenção Executiva: Concessão de descontos elevados (+${discountDelta}%) destrói valor de margem bruta. Recomendamos vincular descontos exclusivamente a contratos plurianuais com pagamento antecipado.`;
  } else {
    aiSummary = `Cenário Equilibrado: O delta projetado de receita é de +${formatCurrency(revenueDeltaAmount)} com margem ajustada de ${projectedMarginPct.toFixed(1)}%. Sensibilidade estável dentro da tolerância orçamentária.`;
  }

  const copilotSimPrompt = `Analise a viabilidade tática do cenário simulado com +${volumeDelta}% em volume, +${priceDelta}% em preço e ${discountDelta}% em descontos, gerando projeção de ${formatCurrency(projectedRevenue)}.`;

  return (
    <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-6 border border-slate-200 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Simulador Comercial What-If (Projeção Tática para Diretoria)
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-50 text-blue-700 border border-slate-200">
              Cenários Dinâmicos
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sensibilidade de faturamento e margem bruta variando elasticidade de volume, repasse de preços e teto de descontos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetValues}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-800 text-slate-600 text-xs border border-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Resetar Sliders</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controles de Sliders (2 colunas) */}
        <div className="lg:col-span-2 space-y-6 bg-slate-50/40 p-5 rounded-xl border border-slate-200">
          {/* Slider 1: Volume */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-600" /> Variação de Volume de Pedidos
              </label>
              <span
                className={`font-mono font-bold text-xs px-2 py-0.5 rounded border ${
                  volumeDelta > 0
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    : volumeDelta < 0
                    ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                    : "bg-slate-800 text-slate-500 border-slate-200"
                }`}
              >
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
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>-20% (Crise)</span>
              <span>0% (Baseline)</span>
              <span>+30% (Expansão Agressiva)</span>
            </div>
          </div>

          {/* Slider 2: Preço */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Repasse de Tabela de Preço
              </label>
              <span
                className={`font-mono font-bold text-xs px-2 py-0.5 rounded border ${
                  priceDelta > 0
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    : priceDelta < 0
                    ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                    : "bg-slate-800 text-slate-500 border-slate-200"
                }`}
              >
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
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>-10% (Desconto Geral)</span>
              <span>0% (Tabela Atual)</span>
              <span>+20% (Repasse de Inflação)</span>
            </div>
          </div>

          {/* Slider 3: Desconto */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Política de Descontos Concedidos
              </label>
              <span
                className={`font-mono font-bold text-xs px-2 py-0.5 rounded border ${
                  discountDelta < 0
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    : discountDelta > 0
                    ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                    : "bg-slate-800 text-slate-500 border-slate-200"
                }`}
              >
                {discountDelta > 0 ? `+${discountDelta}% (Mais Desconto)` : `${discountDelta}% (Contenção)`}
              </span>
            </div>
            <input
              type="range"
              min="-5"
              max="10"
              step="1"
              value={discountDelta}
              onChange={(e) => setDiscountDelta(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>-5% (Rigor de Margem)</span>
              <span>0% (Políticas Vigentes)</span>
              <span>+10% (Alçada Livre)</span>
            </div>
          </div>
        </div>

        {/* Resultados Projetados (1 coluna) */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-blue-950/40 border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-mono text-blue-700 tracking-wider">
              Faturamento Líquido Projetado
            </span>
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {formatCurrency(projectedRevenue)}
            </div>
            <div
              className={`text-xs font-mono font-semibold flex items-center gap-1 ${
                revenueDeltaAmount >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                {revenueDeltaAmount >= 0 ? "+" : ""}
                {formatCurrency(revenueDeltaAmount)} vs Baseline
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-900/80 border border-emerald-500/30 space-y-1">
            <span className="text-[10px] uppercase font-mono text-emerald-300 tracking-wider">
              Margem de Contribuição Projetada
            </span>
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {projectedMarginPct.toFixed(1)}%
            </div>
            <div
              className={`text-xs font-mono font-semibold flex items-center gap-1 ${
                marginDeltaAmount >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                {marginDeltaAmount >= 0 ? "+" : ""}
                {formatCurrency(marginDeltaAmount)} em lucro bruto
              </span>
            </div>
          </div>

          {/* Botão de Chamar Copilot */}
          {onOpenCopilot && (
            <button
              type="button"
              onClick={() => onOpenCopilot(copilotSimPrompt)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-600 text-slate-900 font-bold text-xs shadow-lg shadow-blue-950/30 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-slate-950" />
              <span>Consultar Viabilidade na RN Intelligence</span>
            </button>
          )}
        </div>
      </div>

      {/* Diagnóstico Executivo Autônomo da IA */}
      <div className="p-4 rounded-xl bg-[#0a1122] border border-blue-400/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold">
            <Zap className="w-3.5 h-3.5 text-blue-700" />
            <span>PARECER DA RN INTELLIGENCE SOBRE O CENÁRIO SIMULADO</span>
          </div>
          <p className="text-xs text-slate-700 max-w-4xl leading-relaxed">
            {aiSummary}
          </p>
        </div>
      </div>
    </div>
  );
}
