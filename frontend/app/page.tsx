"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  BarChart3,
  Filter,
  Sparkles,
  Database,
  Users,
  PieChart as PieIcon,
  Globe,
  Sliders,
  Layers,
  Building2,
  Network,
} from "lucide-react";
import {
  fetchKpis,
  fetchMonthly,
  fetchPareto,
  fetchReps,
  fetchRegions,
  fetchSegments,
  fetchChannels,
  fetchTopClients,
  KpiData,
  MonthlyItem,
  ParetoProduct,
  SalesRep,
  RegionBreakdown,
  SegmentBreakdown,
  ChannelItem,
  TopClient,
  FALLBACK_KPIS,
  FALLBACK_MONTHLY,
  FALLBACK_PARETO,
  FALLBACK_REPS,
  FALLBACK_REGIONS,
  FALLBACK_SEGMENTS,
  FALLBACK_CHANNELS,
  FALLBACK_TOP_CLIENTS,
} from "@/lib/api";
import { KpiSummary } from "@/components/dashboard/kpi-summary";
import { AiExecutiveBriefing } from "@/components/dashboard/ai-executive-briefing";
import { FunnelChart } from "@/components/dashboard/funnel-chart";
import { ParetoSection } from "@/components/dashboard/pareto-section";
import { BcgMatrix } from "@/components/dashboard/bcg-matrix";
import { RegionalAnalysis } from "@/components/dashboard/regional-analysis";
import { CustomerSegments } from "@/components/dashboard/customer-segments";
import { WhatIfSimulator } from "@/components/dashboard/what-if-simulator";
import { ChannelPerformance } from "@/components/dashboard/channel-performance";
import { ModelSchema } from "@/components/dashboard/model-schema";
import { CopilotSidebar } from "@/components/chat/copilot-sidebar";

// Carregamento dinâmico sem SSR para gráficos Recharts
const SalesChart = dynamic(
  () => import("@/components/dashboard/sales-chart").then((mod) => mod.SalesChart),
  {
    ssr: false,
    loading: () => (
      <div className="glass-panel rounded-xl p-6 h-[420px] flex items-center justify-center text-slate-500 text-xs">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping mr-2" />
        Carregando gráfico mensal...
      </div>
    ),
  }
);

const RepsLeaderboard = dynamic(
  () => import("@/components/dashboard/reps-leaderboard").then((mod) => mod.RepsLeaderboard),
  {
    ssr: false,
    loading: () => (
      <div className="glass-panel rounded-xl p-6 h-[400px] flex items-center justify-center text-slate-500 text-xs">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping mr-2" />
        Carregando equipe comercial...
      </div>
    ),
  }
);

type TabType = "executivo" | "produtos" | "clientes" | "geografia" | "simulador" | "equipe" | "modelagem";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("executivo");
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Filtros Globais
  const [selectedRegion, setSelectedRegion] = useState("Todas");
  const [selectedChannel, setSelectedChannel] = useState("Todos");

  // Dados com Fallback Inicial
  const [kpis, setKpis] = useState<KpiData>(FALLBACK_KPIS);
  const [monthly, setMonthly] = useState<MonthlyItem[]>(FALLBACK_MONTHLY);
  const [pareto, setPareto] = useState<ParetoProduct[]>(FALLBACK_PARETO);
  const [reps, setReps] = useState<SalesRep[]>(FALLBACK_REPS);
  const [regions, setRegions] = useState<RegionBreakdown[]>(FALLBACK_REGIONS);
  const [segments, setSegments] = useState<SegmentBreakdown[]>(FALLBACK_SEGMENTS);
  const [channels, setChannels] = useState<ChannelItem[]>(FALLBACK_CHANNELS);
  const [topClients, setTopClients] = useState<TopClient[]>(FALLBACK_TOP_CLIENTS);

  useEffect(() => {
    async function loadData() {
      try {
        const [k, m, p, r, reg, seg, chan, top] = await Promise.all([
          fetchKpis(),
          fetchMonthly(),
          fetchPareto(),
          fetchReps(),
          fetchRegions(),
          fetchSegments(),
          fetchChannels(),
          fetchTopClients(),
        ]);
        setKpis(k);
        setMonthly(m);
        setPareto(p);
        setReps(r);
        setRegions(reg);
        setSegments(seg);
        setChannels(chan);
        setTopClients(top);
      } catch (err) {
        console.error("Erro ao carregar dados, usando fallback:", err);
      }
    }
    loadData();
  }, []);

  // Multiplicador reativo para os filtros
  const filteredKpis = useMemo(() => {
    let mult = 1.0;
    if (selectedRegion !== "Todas") {
      const match = regions.find((r) => r.region === selectedRegion);
      mult *= match ? match.share_pct / 25 : 1.0;
    }
    if (selectedChannel !== "Todos") {
      mult *= selectedChannel === "B2B Enterprise" ? 0.42 : selectedChannel === "E-commerce Direto" ? 0.30 : 0.15;
    }
    return {
      ...kpis,
      faturamento_total: Math.round(kpis.faturamento_total * mult),
      margem_total_reais: Math.round(kpis.margem_total_reais * mult),
      total_pedidos: Math.round(kpis.total_pedidos * mult),
    };
  }, [kpis, selectedRegion, selectedChannel, regions]);

  return (
    <div className="min-h-screen flex flex-col bg-[#070b13]">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <BarChart3 className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">Sales BI & AI Copilot</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400">
                  Modern Data Stack
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Plataforma Analítica Executiva • DuckDB OLAP • Google Gemini
              </p>
            </div>
          </div>

          {/* Botão de Abrir Copilot */}
          <button
            type="button"
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Abrir AI Copilot</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Barra de Filtros Globais */}
        <div className="glass-panel rounded-xl p-3 px-4 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>Filtros Globais:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filtro Região */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Região:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1 text-slate-200 outline-none cursor-pointer focus:border-cyan-500"
              >
                <option value="Todas">Todas as Regiões</option>
                <option value="Sudeste">Sudeste</option>
                <option value="Sul">Sul</option>
                <option value="Nordeste">Nordeste</option>
                <option value="Centro-Oeste">Centro-Oeste</option>
              </select>
            </div>

            {/* Filtro Canal */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Canal:</span>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1 text-slate-200 outline-none cursor-pointer focus:border-cyan-500"
              >
                <option value="Todos">Todos os Canais</option>
                <option value="B2B Enterprise">B2B Enterprise</option>
                <option value="E-commerce Direto">E-commerce Direto</option>
                <option value="Grandes Contas">Grandes Contas</option>
                <option value="Canais & Parceiros">Canais & Parceiros</option>
              </select>
            </div>

            {(selectedRegion !== "Todas" || selectedChannel !== "Todos") && (
              <button
                type="button"
                onClick={() => {
                  setSelectedRegion("Todas");
                  setSelectedChannel("Todos");
                }}
                className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>

        {/* 4 Cards de KPI Executivos */}
        <KpiSummary data={filteredKpis} />

        {/* Menu de Abas (7 Níveis de Análise) */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 overflow-x-auto">
          <div className="flex gap-1.5">
            {[
              { id: "executivo", label: "Visão Executiva", icon: BarChart3 },
              { id: "produtos", label: "Produtos & Matriz BCG", icon: PieIcon },
              { id: "clientes", label: "Clientes & Segmentos", icon: Building2 },
              { id: "geografia", label: "Regionais & Canais", icon: Globe },
              { id: "simulador", label: "Simulador What-If", icon: Sliders },
              { id: "equipe", label: "Equipe & Quotas", icon: Users },
              { id: "modelagem", label: "Modelagem DuckDB", icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px]">13.747 transações faturadas</span>
          </div>
        </div>

        {/* Conteúdo da Aba Ativa */}
        {activeTab === "executivo" && (
          <div className="space-y-6">
            <AiExecutiveBriefing />
            <SalesChart data={monthly} />
            <FunnelChart />
          </div>
        )}

        {activeTab === "produtos" && (
          <div className="space-y-6">
            <ParetoSection products={pareto} />
            <BcgMatrix products={pareto} />
          </div>
        )}

        {activeTab === "clientes" && (
          <div className="space-y-6">
            <CustomerSegments segments={segments} topClients={topClients} />
          </div>
        )}

        {activeTab === "geografia" && (
          <div className="space-y-6">
            <RegionalAnalysis regions={regions} />
            <ChannelPerformance channels={channels} />
          </div>
        )}

        {activeTab === "simulador" && (
          <div className="space-y-6">
            <WhatIfSimulator
              baseRevenue={kpis.faturamento_total}
              baseMarginPct={kpis.margem_contribuicao_pct}
            />
          </div>
        )}

        {activeTab === "equipe" && (
          <div className="space-y-6">
            <RepsLeaderboard reps={reps} />
          </div>
        )}

        {activeTab === "modelagem" && (
          <div className="space-y-6">
            <ModelSchema />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>
          Sales BI & AI Copilot • Desenvolvido por{" "}
          <a
            href="https://renan-nocelli.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline font-semibold"
          >
            Renan Nocelli
          </a>{" "}
          • Arquitetura com DuckDB OLAP, FastAPI, Google Gemini e Next.js
        </p>
      </footer>

      {/* Drawer do AI Copilot */}
      <CopilotSidebar isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />
    </div>
  );
}
