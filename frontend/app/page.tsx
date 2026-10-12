"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  BarChart3,
  Filter,
  Users,
  PieChart as PieIcon,
  Globe,
  Sliders,
  Building2,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  Sparkles,
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
import { CopilotSidebar } from "@/components/chat/copilot-sidebar";

// Carregamento dinâmico sem SSR para gráficos Recharts
const SalesChart = dynamic(
  () => import("@/components/dashboard/sales-chart").then((mod) => mod.SalesChart),
  {
    ssr: false,
    loading: () => (
      <div className="glass-panel rounded-2xl p-6 h-[420px] flex items-center justify-center text-slate-400 text-xs">
        <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-ping" />
        Carregando série histórica de faturamento...
      </div>
    ),
  }
);

const RepsLeaderboard = dynamic(
  () => import("@/components/dashboard/reps-leaderboard").then((mod) => mod.RepsLeaderboard),
  {
    ssr: false,
    loading: () => (
      <div className="glass-panel rounded-2xl p-6 h-[420px] flex items-center justify-center text-slate-400 text-xs">
        <span className="w-2 h-2 rounded-full bg-purple-400 mr-2 animate-ping" />
        Carregando performance da equipe comercial...
      </div>
    ),
  }
);

const ProductDecisionMatrix = dynamic(
  () =>
    import("@/components/dashboard/product-decision-matrix").then(
      (mod) => mod.ProductDecisionMatrix
    ),
  {
    ssr: false,
    loading: () => (
      <div className="glass-panel rounded-2xl p-6 h-[420px] flex items-center justify-center text-slate-400 text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping" />
        Carregando matriz de decisão de portfólio...
      </div>
    ),
  }
);

type TabType = "executivo" | "produtos" | "clientes" | "geografia" | "simulador" | "equipe";

const MODULES_TABS = [
  { id: "executivo", label: "Visão Geral", icon: BarChart3 },
  { id: "produtos", label: "Portfólio & Matriz de Decisão", icon: PieIcon },
  { id: "clientes", label: "Clientes & Segmentos", icon: Building2 },
  { id: "geografia", label: "Regionais & Canais", icon: Globe },
  { id: "simulador", label: "Simulador What-If", icon: Sliders },
  { id: "equipe", label: "Equipe & Quotas", icon: Users },
];

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KpiData>(FALLBACK_KPIS);
  const [monthly, setMonthly] = useState<MonthlyItem[]>(FALLBACK_MONTHLY);
  const [pareto, setPareto] = useState<ParetoProduct[]>(FALLBACK_PARETO);
  const [reps, setReps] = useState<SalesRep[]>(FALLBACK_REPS);
  const [regions, setRegions] = useState<RegionBreakdown[]>(FALLBACK_REGIONS);
  const [segments, setSegments] = useState<SegmentBreakdown[]>(FALLBACK_SEGMENTS);
  const [channels, setChannels] = useState<ChannelItem[]>(FALLBACK_CHANNELS);
  const [topClients, setTopClients] = useState<TopClient[]>(FALLBACK_TOP_CLIENTS);

  const [activeTab, setActiveTab] = useState<TabType>("executivo");
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState<string | undefined>(undefined);

  // Sidebar RETRÁTIL: começa FECHADA por padrão
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filtros Globais
  const [selectedRegion, setSelectedRegion] = useState<string>("Todas");
  const [selectedChannel, setSelectedChannel] = useState<string>("Todos");

  useEffect(() => {
    async function loadData() {
      const [k, m, p, r, reg, seg, chan, tc] = await Promise.all([
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
      setTopClients(tc);
    }
    loadData();
  }, []);

  // Recalcula KPIs conforme filtros locais interativos
  const filteredKpis = useMemo(() => {
    let multiplier = 1.0;
    if (selectedRegion === "Sudeste") multiplier *= 0.504;
    else if (selectedRegion === "Sul") multiplier *= 0.248;
    else if (selectedRegion === "Nordeste") multiplier *= 0.152;
    else if (selectedRegion === "Centro-Oeste") multiplier *= 0.096;

    if (selectedChannel === "B2B Enterprise") multiplier *= 0.42;
    else if (selectedChannel === "E-commerce Direto") multiplier *= 0.28;
    else if (selectedChannel === "Grandes Contas") multiplier *= 0.18;
    else if (selectedChannel === "Canais & Parceiros") multiplier *= 0.12;

    if (multiplier === 1.0) return kpis;

    return {
      faturamento_total: kpis.faturamento_total * multiplier,
      meta_total: kpis.meta_total * multiplier,
      margem_contribuicao_pct: kpis.margem_contribuicao_pct,
      margem_total_reais: kpis.margem_total_reais * multiplier,
      total_pedidos: Math.round(kpis.total_pedidos * multiplier),
      ticket_medio: kpis.ticket_medio,
      clientes_ativos: Math.round(kpis.clientes_ativos * Math.sqrt(multiplier)),
      atingimento_meta_pct: kpis.atingimento_meta_pct,
    };
  }, [kpis, selectedRegion, selectedChannel]);

  const handleOpenCopilot = (prompt?: string) => {
    setCopilotInitialPrompt(prompt);
    setIsCopilotOpen(true);
  };

  // Atalho global de teclado Ctrl+K para abrir/fechar o RN Intelligence Copilot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCopilotOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-200 overflow-hidden">
      {/* Backdrop para fechar menu no mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* 1. SIDEBAR (MENU LATERAL RETRÁTIL - COMEÇA FECHADO POR PADRÃO) */}
      <aside
        className={`flex flex-col bg-[#0b0f1a] border-r border-white/10 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-50 shrink-0 ${
          isSidebarOpen
            ? "fixed inset-y-0 left-0 w-72 shadow-2xl md:relative md:shadow-none"
            : "hidden md:flex md:w-20"
        }`}
      >
        {/* Topo da Sidebar: Emblema Oficial de Alta Resolução RN Intelligence */}
        <div
          className={`h-20 flex items-center px-4 border-b border-white/10 shrink-0 ${
            isSidebarOpen ? "justify-between" : "justify-center"
          }`}
        >
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap animate-in fade-in duration-200">
              <div className="w-10 h-10 rounded-2xl bg-[#0c101d] border border-cyan-500/30 overflow-hidden flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/10">
                <img
                  src="/rn_logo_emblem.jpg"
                  alt="RN Intelligence"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-bold text-white tracking-tight leading-tight">
                  Sales BI
                </h1>
                <span className="text-[11px] text-slate-400 font-medium">
                  RN Intelligence
                </span>
              </div>
            </div>
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-[#0c101d] border border-cyan-500/30 overflow-hidden flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/10 group cursor-pointer hover:border-cyan-400 transition-colors"
                 onClick={() => setIsSidebarOpen(true)}
                 title="Expandir Menu Lateral">
              <img
                src="/rn_logo_emblem.jpg"
                alt="RN Intelligence"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Botão de Toggle da Sidebar */}
          {isSidebarOpen && (
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors shrink-0 cursor-pointer border border-transparent hover:border-white/5"
              title="Recolher Menu (PanelLeftClose)"
              aria-label="Recolher Menu Lateral"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Toggle quando fechada (abaixo do emblema) */}
        {!isSidebarOpen && (
          <div className="py-2.5 flex justify-center border-b border-white/5 shrink-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-white/[0.06] transition-all cursor-pointer border border-transparent hover:border-cyan-500/20"
              title="Expandir Menu (PanelLeftOpen)"
              aria-label="Expandir Menu Lateral"
            >
              <PanelLeftOpen className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Seção de Navegação: Renomeada de forma limpa para "Módulos" */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1.5">
          {isSidebarOpen ? (
            <div className="px-3 pt-1 pb-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Módulos
            </div>
          ) : (
            <div className="w-6 h-px bg-white/10 mx-auto my-2" />
          )}

          {MODULES_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  if (typeof window !== "undefined" && window.innerWidth < 768) {
                    setIsSidebarOpen(false);
                  }
                }}
                title={!isSidebarOpen ? tab.label : undefined}
                className={`w-full flex items-center rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer group ${
                  isSidebarOpen
                    ? "gap-3 px-3.5 py-2.5"
                    : "justify-center p-3"
                } ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 font-semibold shadow-xs border border-cyan-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent hover:border-white/5"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? "text-cyan-400"
                      : "text-slate-400 group-hover:text-cyan-300"
                  }`}
                />
                {isSidebarOpen && (
                  <span className="whitespace-nowrap transition-all duration-300">
                    {tab.label}
                  </span>
                )}
                {isActive && isSidebarOpen && (
                  <div className="ml-auto w-1.5 h-4 bg-cyan-400 rounded-full shrink-0 shadow-sm shadow-cyan-400/50" />
                )}
              </button>
            );
          })}
        </div>

        {/* Base da Sidebar: Informação do Usuário / Diretoria */}
        <div className="p-4 border-t border-white/10 shrink-0">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 animate-in fade-in duration-200">
              <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white">Diretoria</span>
                <span className="text-[10px] text-slate-400">Visão Consolidada</span>
              </div>
            </div>
          ) : (
            <div
              className="flex justify-center cursor-pointer text-slate-400 hover:text-cyan-300 transition-colors"
              title="Diretoria • Visão Consolidada"
            >
              <div className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL (DIREITA) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-[#090d16]">
        {/* 2. TOP HEADER DECLUTTERED: Botão longo de abrir chat REMOVIDO */}
        <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0b0f1a]/95 backdrop-blur-xl shrink-0">
          <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {/* Botão para abrir menu no mobile */}
              <button
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors shrink-0 cursor-pointer md:hidden border border-white/5"
                title="Abrir menu lateral"
                aria-label="Abrir menu lateral"
              >
                <PanelLeftOpen className="w-5 h-5" />
              </button>

              <div>
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                  {MODULES_TABS.find((t) => t.id === activeTab)?.label}
                </h2>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Sales Intelligence & DuckDB OLAP
                </p>
              </div>
            </div>


          </div>
        </header>

        {/* ÁREA PRINCIPAL DO DASHBOARD */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 pb-28">
          {/* Filtros Globais */}
          <div className="bg-[#0b0f1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-2 text-slate-400">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Filtros Globais:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Filtro Região */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-xs font-medium">Região:</span>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-[#090d16] border border-white/10 rounded-xl px-3 py-1.5 text-slate-200 outline-none cursor-pointer focus:border-cyan-500 text-xs font-medium shadow-sm transition-all"
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
                <span className="text-slate-400 text-xs font-medium">Canal:</span>
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="bg-[#090d16] border border-white/10 rounded-xl px-3 py-1.5 text-slate-200 outline-none cursor-pointer focus:border-cyan-500 text-xs font-medium shadow-sm transition-all"
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
                  className="text-[11px] text-cyan-400 hover:underline cursor-pointer font-medium"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>

          {/* 3. 4 CARDS DE KPI EXECUTIVOS (ESTILO SENTINEL NEON CONTRASTE) */}
          <KpiSummary data={filteredKpis} onOpenCopilot={handleOpenCopilot} />

          {/* CONTEÚDO DA ABA ATIVA */}
          <div className="mt-6">
            {activeTab === "executivo" && (
              <div className="space-y-6 animate-in fade-in-50 duration-300 ease-out">
                {/* BRIEFING EXECUTIVO DIÁRIO */}
                <AiExecutiveBriefing onOpenCopilot={handleOpenCopilot} />
                <div className="flex flex-col gap-6">
                  <SalesChart data={monthly} />
                  <FunnelChart onOpenCopilot={handleOpenCopilot} />
                </div>
              </div>
            )}

            {activeTab === "produtos" && (
              <div className="space-y-6 animate-in fade-in-50 duration-300 ease-out">
                <ProductDecisionMatrix onOpenCopilot={handleOpenCopilot} />
                <ParetoSection products={pareto} onOpenCopilot={handleOpenCopilot} />
                <BcgMatrix products={pareto} onOpenCopilot={handleOpenCopilot} />
              </div>
            )}

            {activeTab === "clientes" && (
              <div className="space-y-6 animate-in fade-in-50 duration-300 ease-out">
                <CustomerSegments
                  segments={segments}
                  topClients={topClients}
                  onOpenCopilot={handleOpenCopilot}
                />
              </div>
            )}

            {activeTab === "geografia" && (
              <div className="space-y-6 animate-in fade-in-50 duration-300 ease-out">
                <RegionalAnalysis regions={regions} onOpenCopilot={handleOpenCopilot} />
                <ChannelPerformance channels={channels} onOpenCopilot={handleOpenCopilot} />
              </div>
            )}

            {activeTab === "simulador" && (
              <div className="space-y-6 animate-in fade-in-50 duration-300 ease-out">
                <WhatIfSimulator
                  baseRevenue={filteredKpis.faturamento_total}
                  baseMarginPct={filteredKpis.margem_contribuicao_pct}
                  currentRevenue={filteredKpis.faturamento_total}
                  currentMarginPct={filteredKpis.margem_contribuicao_pct}
                  onOpenCopilot={handleOpenCopilot}
                />
              </div>
            )}

            {activeTab === "equipe" && (
              <div className="space-y-6 animate-in fade-in-50 duration-300 ease-out">
                <RepsLeaderboard reps={reps} onOpenCopilot={handleOpenCopilot} />
              </div>
            )}
          </div>
        </main>

        {/* FOOTER */}
        <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-400 mt-auto shrink-0 bg-[#0b0f1a]">
          Sales BI &bull; RN Intelligence &bull; Desenvolvido por{" "}
          <span className="text-cyan-400 font-semibold">Renan Nocelli</span> &bull;
          Arquitetura com DuckDB OLAP, FastAPI, Google Gemini e Next.js
        </footer>
      </div>

      {/* 2. FLOATING ACTION BUTTON (FAB) ELEGANTE NO CANTO INFERIOR DIREITO */}
      <button
        type="button"
        onClick={() => handleOpenCopilot()}
        className="fixed bottom-5 right-5 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-2xl shadow-cyan-500/25 border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        title="Abrir RN Intelligence Copilot"
        aria-label="Abrir RN Intelligence Copilot"
      >
        <MessageSquare className="w-4 h-4 text-white group-hover:rotate-6 transition-transform" />
        <span className="font-bold tracking-tight">Copilot IA</span>
      </button>

      {/* 5. COPILOT CHAT DRAWER (COM EMBLEMA OFICIAL E STREAMING SSE) */}
      <CopilotSidebar
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        initialPrompt={copilotInitialPrompt}
      />
    </div>
  );
}