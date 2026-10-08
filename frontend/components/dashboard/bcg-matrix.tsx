"use client";

import React from "react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ParetoProduct } from "@/lib/api";
import { Award, AlertCircle, HelpCircle, ArrowUpRight, TrendingUp, ExternalLink } from "lucide-react";

interface BcgMatrixProps {
  products: ParetoProduct[];
  onOpenCopilot?: (prompt?: string) => void;
}

export function BcgMatrix({ products, onOpenCopilot }: BcgMatrixProps) {
  const quadrants = [
    {
      title: "Líderes de Mercado (Estrelas)",
      tag: "Alto Volume & Alta Margem",
      color: "border-slate-700 bg-slate-900/20",
      desc: "Produtos líderes de mercado com forte crescimento e alta rentabilidade. Exigem investimento contínuo para manter dominância.",
      action: "Investir para manter liderança e acelerar go-to-market.",
      prompt: "Quais produtos da categoria Estrelas têm o maior potencial de escala para o próximo trimestre?",
      items: products.filter((p) => p.margin >= 44 && p.volume >= 2500),
    },
    {
      title: "Alta Geração de Caixa (Cash Cows)",
      tag: "Volume Massivo & Margem Excelente",
      color: "border-emerald-500/40 bg-emerald-950/20",
      desc: "Produtos maduros que geram fluxo de caixa abundante com baixo custo de aquisição adicional.",
      action: "Maximizar fluxo de caixa livre e financiar inovação.",
      prompt: "Como proteger o fluxo de caixa gerado pelos produtos Vacas Leiteiras sem perder market share?",
      items: products.filter((p) => p.margin >= 60 && p.volume >= 8000),
    },
    {
      title: "Oportunidades em Escala (Question Marks)",
      tag: "Margem Moderada & Potencial de Escala",
      color: "border-blue-500/40 bg-blue-950/20",
      desc: "Serviços consultivos e conectores com demanda crescente. Podem virar Estrelas com o impulso comercial correto.",
      action: "Avaliar tração e direcionar esforços de cross-sell.",
      prompt: "Qual estratégia de cross-sell pode transformar nossos Question Marks em produtos Estrela?",
      items: products.filter((p) => p.margin >= 35 && p.margin < 44),
    },
    {
      title: "Margem Crítica (Revisão)",
      tag: "Baixa Margem (<20%) & Custo Elevado",
      color: "border-amber-500/40 bg-amber-950/20",
      desc: "Hardware com margem bruta reduzida que consome capital de giro e logística sem retorno proporcional.",
      action: "Renegociar fornecedores ou migrar clientes para soluções Cloud.",
      prompt: "Quais são as alternativas viáveis para descontinuar ou reprecificar os produtos de Margem Crítica?",
      items: products.filter((p) => p.margin < 20),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Classificação BCG de Portfólio (Rentabilidade × Demanda)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-blue-400">
                Matriz Tática
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Alocação dos SKUs nos quadrantes estratégicos de decisão para diretoria executiva.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quadrants.map((q, idx) => (
            <div key={idx} className={`p-5 rounded-xl border ${q.color} flex flex-col justify-between space-y-4`}>
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                  <h3 className="font-bold text-white text-base">{q.title}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-semibold">
                    {q.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-3">{q.desc}</p>

                {/* Lista de Produtos do Quadrante */}
                <div className="space-y-2 mb-3">
                  {q.items.slice(0, 3).map((item) => (
                    <div
                      key={item.code}
                      className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-slate-200">{item.name}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-blue-300 font-semibold">{formatCurrency(item.revenue)}</span>
                        <span className="text-emerald-400">({item.margin}%)</span>
                      </div>
                    </div>
                  ))}
                  {q.items.length === 0 && (
                    <div className="p-2 text-xs text-slate-500 font-mono">Nenhum SKU no critério restrito.</div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  <strong className="text-blue-400">Diretriz:</strong> {q.action}
                </span>

                {onOpenCopilot && (
                  <button
                    type="button"
                    onClick={() => onOpenCopilot(q.prompt)}
                    className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-blue-500/15 text-blue-300 text-[11px] font-mono transition-colors cursor-pointer border border-slate-700"
                  >
                    <span>Consultar RN Intelligence</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
