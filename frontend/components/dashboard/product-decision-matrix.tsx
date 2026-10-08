"use client";

import React, { useState, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  Cpu,
  TrendingUp,
  AlertTriangle,
  Target,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Filter,
  CheckCircle2,
  Info
} from "lucide-react";

export interface BubbleProduct {
  id: number;
  name: string;
  category: "Software / SaaS" | "IA & Automação" | "Consultoria & Dados" | "Hardware & Infra";
  volume: number; // Eixo X: Unidades vendidas no ano
  margin: number; // Eixo Y: Margem de Contribuição %
  revenue: number; // ZAxis (Tamanho da bolha): Faturamento Total R$
  quadrant: "Core Lucrativo (Líderes de Mercado)" | "Oportunidades de Alto Retorno" | "Volume sem Margem" | "Revisão / Baixo Retorno";
  aiDiagnosis: string;
  copilotPrompt: string;
}

export const PORTFOLIO_PRODUCTS: BubbleProduct[] = [
  // 1. Core Lucrativo (Alta Margem, Alto Volume)
  {
    id: 1,
    name: "Enterprise Analytics Platform",
    category: "Software / SaaS",
    volume: 3240,
    margin: 58.2,
    revenue: 10920000,
    quadrant: "Core Lucrativo (Líderes de Mercado)",
    aiDiagnosis: "Carro-chefe absoluto com 58.2% de margem e R$ 10.9M faturados. Ação recomendada: Proteger contas enterprise com SLA prioritário e vender módulos de IA acoplados.",
    copilotPrompt: "Qual a estratégia para expandir a Enterprise Analytics Platform nos contratos de 2026?",
  },
  {
    id: 2,
    name: "BI Cloud Server Pro",
    category: "Software / SaaS",
    volume: 2850,
    margin: 62.0,
    revenue: 6840000,
    quadrant: "Core Lucrativo (Líderes de Mercado)",
    aiDiagnosis: "Margem excepcional de 62.0% com receita recorrente de R$ 6.8M. Ação: Aumentar o limite de usuários simultâneos nos pacotes corporativos.",
    copilotPrompt: "Analise a retenção de clientes do produto BI Cloud Server Pro e o churn anual.",
  },
  {
    id: 3,
    name: "RN Intelligence Enterprise Add-on",
    category: "IA & Automação",
    volume: 1950,
    margin: 67.5,
    revenue: 4875000,
    quadrant: "Core Lucrativo (Líderes de Mercado)",
    aiDiagnosis: "Produto com a maior margem da empresa (67.5%) e crescimento vertiginoso (+42% YoY). Ação: Oferecer teste guiado de 30 dias para toda a base instalada.",
    copilotPrompt: "Como o RN Intelligence Enterprise Add-on pode ser utilizado como alavanca de expansão de receita?",
  },
  {
    id: 4,
    name: "Data Governance & Security Suite",
    category: "Software / SaaS",
    volume: 1620,
    margin: 54.0,
    revenue: 3880000,
    quadrant: "Core Lucrativo (Líderes de Mercado)",
    aiDiagnosis: "Alta aderência em clientes dos segmentos Financeiro e Saúde pela exigência de conformidade LGPD. Margem estável em 54%.",
    copilotPrompt: "Quais verticais têm maior potencial de adesão ao módulo Data Governance?",
  },

  // 2. Oportunidades de Alto Retorno (Alta Margem, Baixo Volume / Nicho)
  {
    id: 5,
    name: "Predictive ML Sales Engine",
    category: "IA & Automação",
    volume: 980,
    margin: 64.8,
    revenue: 2940000,
    quadrant: "Oportunidades de Alto Retorno",
    aiDiagnosis: "Margem de 64.8% porém com volume restrito a 980 unidades. Ação tática: Treinar o time comercial para demonstrar ROI preditivo nos clientes de Varejo.",
    copilotPrompt: "O que impede o Predictive ML Sales Engine de atingir escala no segmento Varejo?",
  },
  {
    id: 6,
    name: "Real-time Stream Analytics",
    category: "IA & Automação",
    volume: 820,
    margin: 59.1,
    revenue: 2460000,
    quadrant: "Oportunidades de Alto Retorno",
    aiDiagnosis: "Nicho de telemetria em tempo real com excelente margem (59.1%). Ação: Empacotar como add-on pré-configurado para clientes de Indústria 4.0.",
    copilotPrompt: "Qual o perfil de cliente que mais contrata Real-time Stream Analytics?",
  },
  {
    id: 7,
    name: "NLP Data Ingestion Bot",
    category: "IA & Automação",
    volume: 640,
    margin: 63.4,
    revenue: 1920000,
    quadrant: "Oportunidades de Alto Retorno",
    aiDiagnosis: "Automação de extração de relatórios não estruturados com 63.4% de margem. Produto com forte apelo em escritórios jurídicos e seguradoras.",
    copilotPrompt: "Quais integrações podem acelerar a venda do NLP Data Ingestion Bot?",
  },
  {
    id: 8,
    name: "Arquitetura de Dados Enterprise",
    category: "Consultoria & Dados",
    volume: 420,
    margin: 51.0,
    revenue: 1680000,
    quadrant: "Oportunidades de Alto Retorno",
    aiDiagnosis: "Serviço de alto ticket e margem de 51%. Atua como porta de entrada estratégica para vendas de longo prazo de software.",
    copilotPrompt: "Qual a taxa de conversão de clientes de consultoria para a plataforma SaaS?",
  },
  {
    id: 9,
    name: "Migração Modern Data Stack",
    category: "Consultoria & Dados",
    volume: 310,
    margin: 48.5,
    revenue: 1550000,
    quadrant: "Oportunidades de Alto Retorno",
    aiDiagnosis: "Migração de bancos legados para DuckDB/Cloud. Margem saudável de 48.5%, gargalo está na capacidade de horas técnicas da equipe.",
    copilotPrompt: "Como aumentar a escala de projetos de Migração Data Stack sem inflar custos fixos?",
  },
  {
    id: 10,
    name: "Treinamento Executivo & Data Literacy",
    category: "Consultoria & Dados",
    volume: 520,
    margin: 55.0,
    revenue: 1040000,
    quadrant: "Oportunidades de Alto Retorno",
    aiDiagnosis: "Capacitação de lideranças com 55% de margem e baixíssimo custo marginal. Excelente para reforçar relacionamento com C-Levels.",
    copilotPrompt: "Qual o impacto dos treinamentos de data literacy na retenção de contas?",
  },

  // 3. Volume sem Margem (Baixa Margem, Alto Volume - Hardware)
  {
    id: 11,
    name: "Servidor Rack Appliance 2U",
    category: "Hardware & Infra",
    volume: 2950,
    margin: 18.2,
    revenue: 5900000,
    quadrant: "Volume sem Margem",
    aiDiagnosis: "Gera R$ 5.9M de faturamento bruto mas consome capital de giro com margem de apenas 18.2%. Ação: Vincular a venda a pelo menos 24 meses de software.",
    copilotPrompt: "Qual o impacto de exigir contrato de software na venda de Servidores Rack?",
  },
  {
    id: 12,
    name: "Switch Óptico Core 10Gbps",
    category: "Hardware & Infra",
    volume: 2400,
    margin: 16.5,
    revenue: 3600000,
    quadrant: "Volume sem Margem",
    aiDiagnosis: "Margem comprimida por fretes e taxas de importação (16.5%). Ação: Negociar compras em lote direto do fabricante para ganhar +3 p.p. de margem.",
    copilotPrompt: "Como renegociar fornecedores de hardware para proteger a margem mínima?",
  },
  {
    id: 13,
    name: "Storage All-Flash NVMe 48TB",
    category: "Hardware & Infra",
    volume: 1850,
    margin: 15.0,
    revenue: 3700000,
    quadrant: "Volume sem Margem",
    aiDiagnosis: "Menor margem do catálogo (15.0%). SKUs com alto índice de desconto concedido por representantes comerciais. Limitar alçada de desconto a 5%.",
    copilotPrompt: "Quais canais mais concederam desconto no Storage All-Flash NVMe?",
  },
  {
    id: 14,
    name: "Firewall Appliance Enterprise",
    category: "Hardware & Infra",
    volume: 1700,
    margin: 22.0,
    revenue: 2550000,
    quadrant: "Volume sem Margem",
    aiDiagnosis: "Margem de 22.0% abaixo da meta de 40%. Ação: Migrar clientes para modelo de Firewall Virtualizado em Nuvem com 60% de margem.",
    copilotPrompt: "Qual o plano de migração de clientes de Firewall Físico para Cloud?",
  },

  // 4. Revisão / Baixo Retorno (Baixa Margem, Baixo Volume)
  {
    id: 15,
    name: "Conectores ERP Legados",
    category: "Software / SaaS",
    volume: 1100,
    margin: 36.0,
    revenue: 1320000,
    quadrant: "Revisão / Baixo Retorno",
    aiDiagnosis: "Custo de manutenção alto para sistemas antigos. Margem de 36% abaixo da média de software. Ação: Reajustar taxa anual de suporte em +15%.",
    copilotPrompt: "Vale a pena descontinuar suporte a conectores de ERPs legados?",
  },
  {
    id: 16,
    name: "Licença Backup Tape Archive",
    category: "Software / SaaS",
    volume: 750,
    margin: 28.0,
    revenue: 750000,
    quadrant: "Revisão / Baixo Retorno",
    aiDiagnosis: "Tecnologia em desuso com margem de 28% e demanda decrescente. Ação: Conduzir programa de migração para armazenamento em nuvem.",
    copilotPrompt: "Como acelerar o sunset da Licença Tape Archive?",
  },
  {
    id: 17,
    name: "Manutenção de Infraestrutura On-Prem",
    category: "Consultoria & Dados",
    volume: 620,
    margin: 32.5,
    revenue: 930000,
    quadrant: "Revisão / Baixo Retorno",
    aiDiagnosis: "Horas de suporte presencial não escaláveis com margem de 32.5%. Ação: Terceirizar atendimento nível 1 para focar equipe sênior em projetos de IA.",
    copilotPrompt: "Qual o custo operacional da equipe de suporte presencial On-Prem?",
  },
  {
    id: 18,
    name: "Cabo Óptico & Transceiver Kit",
    category: "Hardware & Infra",
    volume: 950,
    margin: 14.0,
    revenue: 475000,
    quadrant: "Revisão / Baixo Retorno",
    aiDiagnosis: "Item de cauda longa com margem ínfima de 14.0% e baixa receita. Ação: Retirar de catálogo ativo e vender apenas sob encomenda especial.",
    copilotPrompt: "Qual o impacto de retirar Cabos Ópticos do catálogo padrão?",
  },
  {
    id: 19,
    name: "Módulo Relatórios Legados PDF",
    category: "Software / SaaS",
    volume: 480,
    margin: 25.0,
    revenue: 380000,
    quadrant: "Revisão / Baixo Retorno",
    aiDiagnosis: "Módulo substituído pelo novo painel interativo. Mantido apenas para clientes legados. Ação: Notificar encerramento de suporte no final do ano.",
    copilotPrompt: "Quantos clientes ainda utilizam o módulo de relatórios PDF legados?",
  },
  {
    id: 20,
    name: "Gateway VPN Básico",
    category: "Hardware & Infra",
    volume: 580,
    margin: 19.5,
    revenue: 460000,
    quadrant: "Revisão / Baixo Retorno",
    aiDiagnosis: "Hardware genérico com forte concorrência e margem de 19.5%. Ação: Descontinuar e promover solução Zero-Trust em nuvem.",
    copilotPrompt: "Quais alternativas Zero-Trust substituem o Gateway VPN Básico com maior margem?",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Software / SaaS": "#1e3a8a",       // Ciano Neon
  "IA & Automação": "#2563eb",        // Esmeralda Neon
  "Consultoria & Dados": "#60a5fa",    // Roxo Neon
  "Hardware & Infra": "#94a3b8",       // Âmbar / Laranja
};

interface ProductDecisionMatrixProps {
  onOpenCopilot?: (prompt?: string) => void;
}

export function ProductDecisionMatrix({ onOpenCopilot }: ProductDecisionMatrixProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [selectedProduct, setSelectedProduct] = useState<BubbleProduct | null>(PORTFOLIO_PRODUCTS[0]);
  const [isTooltipPinned, setIsTooltipPinned] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredProducts = PORTFOLIO_PRODUCTS.filter((p) => {
    if (selectedCategory === "Todas") return true;
    return p.category === selectedCategory;
  });

  // Tooltip Futurista da Bolha
  const CustomBubbleTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const p = payload[0].payload as BubbleProduct;

    return (
      <div className="z-50 min-w-[310px] max-w-[360px] p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/50 shadow-xl text-xs text-slate-700 dark:text-slate-200 font-sans pointer-events-auto">
        {/* Header HUD */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-700/50 text-[10px] font-mono">
          <span className="text-blue-600 flex items-center gap-1 font-semibold uppercase tracking-wider">
            <Cpu className="w-3 h-3 text-blue-700" />
            Decisão de Portfólio RN Intelligence
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300">
            {p.category}
          </span>
        </div>

        {/* Nome do Produto & Quadrante */}
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">{p.name}</h4>
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold mb-3 border ${
            p.margin >= 40 && p.volume >= 1500
              ? "bg-blue-500/15 text-blue-700 border-slate-200 dark:border-slate-700/50"
              : p.margin >= 40
              ? "bg-emerald-500/20 text-emerald-700 border-emerald-500/40"
              : p.volume >= 1500
              ? "bg-amber-500/20 text-amber-700 border-amber-500/40"
              : "bg-rose-500/20 text-rose-700 border-rose-500/40"
          }`}
        >
          {p.quadrant}
        </span>

        {/* Grid de 3 Métricas */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-500 font-mono block">Faturamento</span>
            <span className="font-bold text-blue-700 font-mono text-xs">{formatCurrency(p.revenue)}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-500 font-mono block">Margem %</span>
            <span
              className={`font-bold font-mono text-xs ${
                p.margin >= 40 ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {p.margin.toFixed(1)}%
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-500 font-mono block">Volume</span>
            <span className="font-bold text-slate-700 dark:text-slate-200 font-mono text-xs">{p.volume.toLocaleString("pt-BR")} un</span>
          </div>
        </div>

        {/* Diagnóstico Executivo da IA */}
        <div className="p-2.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/50 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 mb-3">
          <p className="flex items-start gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>{p.aiDiagnosis}</span>
          </p>
        </div>

        {/* Botão de Chamar Copilot */}
        {onOpenCopilot && (
          <button
            type="button"
            onClick={() => onOpenCopilot(p.copilotPrompt)}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-600/30 hover:to-blue-600/30 border border-slate-200 dark:border-slate-700/50 text-blue-700 hover:text-slate-700 dark:text-slate-200 text-[11px] font-medium transition-all cursor-pointer"
          >
            <span>Perguntar à RN Intelligence no Chat</span>
            <ExternalLink className="w-3 h-3 text-blue-600" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/50 shadow-xs rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 space-y-6">
      {/* Top Header com Título e Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700/50">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-blue-900/10">
              <Layers className="w-4 h-4 text-slate-700 dark:text-slate-200 font-bold" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 tracking-tight flex items-center gap-2">
                Matriz Estratégica de Decisão de Portfólio (Gráfico de Bolhas)
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-blue-600">
                  Volume × Margem × Receita
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">
                Mapeamento tático de 20 produtos por volume de vendas (X), rentabilidade (Y) e tamanho da receita (Raio).
              </p>
            </div>
          </div>
        </div>

        {/* Filtros por Categoria de Produto */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-blue-600" /> Categoria:
          </span>
          <div className="flex flex-wrap p-1 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 gap-1 text-xs">
            {["Todas", "Software / SaaS", "IA & Automação", "Consultoria & Dados", "Hardware & Infra"].map(
              (cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg transition-colors font-medium cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-blue-500/15 text-blue-700 border border-slate-200 dark:border-slate-700/50 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* 4 Cards de Síntese Tática dos Quadrantes (Decisão Executiva) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-700 mb-1">
            <span>💎 Core Lucrativo (Líderes de Mercado)</span>
            <span className="font-mono text-[10px]">4 SKUs</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">R$ 26.5M • Margem 59.8%</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">
            <strong className="text-blue-600">Decisão:</strong> Blindar contas chave e incentivar vendas de pacotes plurianuais.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 mb-1">
            <span>🚀 Oportunidades de Alto Retorno</span>
            <span className="font-mono text-[10px]">6 SKUs</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">R$ 11.6M • Margem 56.8%</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">
            <strong className="text-emerald-600">Decisão:</strong> Aumentar comissão e incentivar cross-sell na base corporativa.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-700 mb-1">
            <span>⚠️ Volume sem Margem (Hardware)</span>
            <span className="font-mono text-[10px]">4 SKUs</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">R$ 15.8M • Margem 17.8%</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">
            <strong className="text-amber-600">Decisão:</strong> Limitar descontos a 5% e atrelar a contratos obrigatórios de SaaS.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-700 mb-1">
            <span>🛑 Revisão / Baixo Retorno</span>
            <span className="font-mono text-[10px]">6 SKUs</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">R$ 4.3M • Margem 24.5%</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">
            <strong className="text-rose-600">Decisão:</strong> Reajustar preços de manutenção ou programar descontinuação.
          </p>
        </div>
      </div>

      {/* Gráfico de Bolhas Recharts */}
      <div className="h-[430px] w-full relative">
        {!mounted ? (
          <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400 dark:text-slate-500 text-xs">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
            Carregando matriz de decisão de portfólio...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 25, right: 30, bottom: 25, left: 15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                type="number"
                dataKey="volume"
                name="Volume de Vendas"
                unit=" un"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
                domain={[0, 3600]}
              />
              <YAxis
                type="number"
                dataKey="margin"
                name="Margem de Contribuição"
                unit="%"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
                domain={[10, 75]}
              />
              <ZAxis
                type="number"
                dataKey="revenue"
                range={[80, 850]}
                name="Faturamento"
              />

              {/* Linhas de Referência de Decisão Tática */}
              <ReferenceLine
                y={40}
                stroke="#94a3b8"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: "Meta Margem: 40.0%",
                  fill: "#94a3b8",
                  fontSize: 10,
                  position: "insideTopRight",
                }}
              />
              <ReferenceLine
                x={1500}
                stroke="#1e3a8a"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: "Corte de Volume: 1.500 un",
                  fill: "#1e3a8a",
                  fontSize: 10,
                  position: "insideTopLeft",
                }}
              />

              {/* Tooltip Holográfico Interativo */}
              <Tooltip content={<CustomBubbleTooltip />} />

              <Scatter
                name="Produtos"
                data={filteredProducts}
                onClick={(node: any) => {
                  if (node && node.payload) {
                    setSelectedProduct(node.payload as BubbleProduct);
                    setIsTooltipPinned(true);
                  }
                }}
                className="cursor-pointer"
              >
                {filteredProducts.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[entry.category] || "#1e3a8a"}
                    fillOpacity={0.75}
                    stroke="#ffffff"
                    strokeWidth={1.5}
                    className="hover:scale-125 transition-transform"
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legenda de Categorias com Contagem */}
      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/50 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-4">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: color }} />
              <span className="text-slate-600 dark:text-slate-300">{cat}</span>
            </div>
          ))}
        </div>

        <div className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-[11px] flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          <span>Tamanho da bolha = Faturamento Total (R$). Passe o mouse para inspecionar.</span>
        </div>
      </div>

      {/* Ficha Tática do Produto Selecionado (Quando clicado) */}
      {selectedProduct && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-slate-200 dark:border-slate-700/50">
                {selectedProduct.category}
              </span>
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">{selectedProduct.name}</h3>
              <span className="text-xs font-mono text-emerald-600 font-bold">
                {selectedProduct.margin.toFixed(1)}% margem
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl">
              <strong className="text-blue-600">Diagnóstico RN Intelligence:</strong> {selectedProduct.aiDiagnosis}
            </p>
          </div>

          {onOpenCopilot && (
            <button
              type="button"
              onClick={() => onOpenCopilot(selectedProduct.copilotPrompt)}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-600 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-md shadow-blue-900/10 transition-all cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Explorar na RN Intelligence</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
