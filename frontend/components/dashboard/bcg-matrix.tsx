"use client";

import React from "react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ParetoProduct } from "@/lib/api";
import { Star, Sparkles, AlertCircle, HelpCircle, ArrowUpRight, TrendingUp } from "lucide-react";

interface BcgMatrixProps {
  products: ParetoProduct[];
}

export function BcgMatrix({ products }: BcgMatrixProps) {
  const quadrants = [
    {
      title: "⭐ Estrelas (Stars)",
      tag: "Alto Volume & Alta Margem",
      color: "border-cyan-500/40 bg-cyan-950/20",
      desc: "Produtos líderes de mercado com forte crescimento e alta rentabilidade. Exigem investimento contínuo para manter dominância.",
      action: "Investir para manter liderança e acelerar go-to-market.",
      items: products.filter((p) => p.margin >= 44 && p.volume >= 2500),
    },
    {
      title: "🐄 Vacas Leiteiras (Cash Cows)",
      tag: "Volume Massivo & Margem Excelente",
      color: "border-emerald-500/40 bg-emerald-950/20",
      desc: "Produtos maduros que geram fluxo de caixa abundante com baixo custo de aquisição adicional.",
      action: "Maximizar fluxo de caixa livre e financiar inovação.",
      items: products.filter((p) => p.margin >= 60 && p.volume >= 8000),
    },
    {
      title: "🚀 Oportunidades (Question Marks)",
      tag: "Margem Moderada & Potencial de Escala",
      color: "border-blue-500/40 bg-blue-950/20",
      desc: "Serviços consultivos e conectores com demanda crescente. Podem virar Estrelas com o impulso comercial correto.",
      action: "Avaliar tração e direcionar esforços de cross-sell.",
      items: products.filter((p) => p.margin >= 35 && p.margin < 44),
    },
    {
      title: "⚠️ Margem Crítica (Abacaxis / Dogs)",
      tag: "Baixa Margem (<20%) & Custo Elevado",
      color: "border-amber-500/40 bg-amber-950/20",
      desc: "Hardware com margem bruta reduzida que consome capital de giro e logística sem retorno proporcional.",
      action: "Renegociar fornecedores ou migrar clientes para soluções Cloud.",
      items: products.filter((p) => p.margin < 20),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" /> Matriz BCG de Portfólio Comercial
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Classificação estratégica baseada no cruzamento de Volume Transacionado vs. Margem de Contribuição %.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quadrants.map((q, idx) => (
            <div key={idx} className={`p-5 rounded-xl border ${q.color} glass-panel flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/5">
                  <h3 className="font-bold text-white text-sm">{q.title}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                    {q.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{q.desc}</p>

                {/* SKUs Listados */}
                <div className="space-y-2">
                  {q.items.map((it) => (
                    <div
                      key={it.code}
                      className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-200">{it.name}</span>
                        <span className="text-[11px] font-mono text-slate-500 ml-2">({it.code})</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-cyan-300">{formatCurrency(it.revenue)}</span>
                        <span className="text-emerald-400 font-mono text-[11px] ml-2 font-bold">
                          {it.margin.toFixed(1)}% margem
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-cyan-400 flex items-center gap-1.5 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Recomendação: {q.action}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
