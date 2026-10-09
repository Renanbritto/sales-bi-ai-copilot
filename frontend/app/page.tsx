"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  BarChart3,
  Filter,
  Bot,
  Users,
  PieChart as PieIcon,
  Globe,
  Sliders,
  Building2,
  PanelLeftClose,
  PanelLeftOpen,
  Moon,
  Sun,
  ChevronRight,
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
      <div className="glass-panel rounded-xl p-6 h-[420px] flex items-center justify-center text-slate-500 dark:text-slate-400 dark:text-slate-500 text-xs">
        <span className="w-2 h-2 rounded-full bg-blue-400 mr-2" />
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
      <div className="glass-panel rounded-xl p-6 h-[420px] flex items-center justify-center text-slate-500 dark:text-slate-400 dark:text-slate-500 text-xs">
        <span className="w-2 h-2 rounded-full bg-purple-400 mr-2" />
        Carregando performance de equipe...
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
      <div className="glass-panel rounded-xl p-6 h-[420px] flex items-center justify-center text-slate-500 dark:text-slate-400 dark:text-slate-500 text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2" />
        Carregando matriz de decisão de portfólio...
      </div>
    ),
  }
);

type TabType = "executivo" | "produtos" | "clientes" | "geografia" | "simulador" | "equipe";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial preference
    if (typeof window !== 'undefined') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && isSystemDark)) {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };


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

  const handleOpenCopilot = () => {
    setIsCopilotOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-sans selection:bg-blue-600/20 selection:text-blue-900 overflow-hidden">
      
            {/* Backdrop para fechar menu no mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Retrátil / Drawer Mobile */}
      <aside
        className={`flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-50 shrink-0 ${
          isSidebarOpen
            ? 'fixed inset-y-0 left-0 w-72 shadow-2xl md:relative md:shadow-none'
            : 'hidden md:flex md:w-20'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700/50 shrink-0">
          <div className={`flex items-center gap-3 overflow-hidden whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-sm shadow-blue-900/10">
              <BarChart3 className="w-4 h-4 text-white font-bold" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-tight">Sales BI</h1>
              <span className="text-[10px] text-slate-400 font-medium">Analytics & Performance</span>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1.5">
          {[
            { id: "executivo", label: "Visão Executiva", icon: BarChart3 },
            { id: "produtos", label: "Portfólio & Matriz de Decisão", icon: PieIcon },
            { id: "clientes", label: "Clientes & Segmentos", icon: Building2 },
            { id: "geografia", label: "Regionais & Canais", icon: Globe },
            { id: "simulador", label: "Simulador What-If", icon: Sliders },
            { id: "equipe", label: "Equipe & Quotas", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    setIsSidebarOpen(false);
                  }
                }}
                title={!isSidebarOpen ? tab.label : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer group ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400 font-semibold shadow-xs border border-blue-200/80 dark:border-blue-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                <span className={`whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
                  {tab.label}
                </span>
                {isActive && isSidebarOpen && (
                  <div className="ml-auto w-1 h-4 bg-blue-600 dark:bg-blue-400 rounded-full shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* User / Settings / Status na base da sidebar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 shrink-0">
          <div className={`flex items-center gap-3 transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
               <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
             </div>
             <div className="flex flex-col text-left">
               <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Diretoria</span>
               <span className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-500">Visão Consolidada</span>
             </div>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal (Direita) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        
        {/* Top Header Navegação (Agora só tem título da aba e botão IA) */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 backdrop-blur-xl shrink-0">
          <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
            
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
               <button
                 type="button"
                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                 className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                 title="Abrir menu"
               >
                 <PanelLeftOpen className="w-5 h-5" />
               </button>
               <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight truncate">
                  {[
                    { id: "executivo", label: "Visão Executiva" },
                    { id: "produtos", label: "Portfólio & Matriz de Decisão" },
                    { id: "clientes", label: "Clientes & Segmentos" },
                    { id: "geografia", label: "Regionais & Canais" },
                    { id: "simulador", label: "Simulador What-If" },
                    { id: "equipe", label: "Equipe & Quotas" },
                  ].find(t => t.id === activeTab)?.label}
               </h2>
            </div>

            {/* Botão de Abrir Copilot */}
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                title="Alternar Tema"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={() => handleOpenCopilot()}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white pl-2 pr-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm shadow-blue-900/10 transition-all cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-lg bg-slate-950 border border-blue-400/40 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform p-0.5">
                  <img src="/logo_badge_sm.png" alt="RN Intelligence" className="w-5 h-5 rounded object-contain" />
                </div>
                <span className="hidden sm:inline">Abrir RN Intelligence</span>
                <span className="sm:hidden font-medium">Copilot</span>
                <div className="w-2 h-2 rounded-full bg-emerald-400 border border-blue-600 animate-pulse ml-0.5 shrink-0" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 pb-20">
          
          {/* Filtros Globais */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 shadow-xs rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 dark:text-slate-500">
              <Filter className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Filtros Globais:</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Filtro Região */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">Região:</span>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 outline-none cursor-pointer focus:border-blue-600 focus:bg-white dark:bg-slate-900 text-xs font-medium shadow-sm transition-all"
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
                <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">Canal:</span>
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 outline-none cursor-pointer focus:border-blue-600 focus:bg-white dark:bg-slate-900 text-xs font-medium shadow-sm transition-all"
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
                  className="text-[11px] text-blue-600 hover:underline cursor-pointer font-medium"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>

          {/* 4 Cards de KPI Executivos */}
          <KpiSummary data={filteredKpis} onOpenCopilot={handleOpenCopilot} />

          <div className="mt-6">
            {/* Conteúdo da Aba Ativa */}
            {activeTab === "executivo" && (
              <div className="space-y-6">
                <AiExecutiveBriefing onOpenCopilot={handleOpenCopilot} />
                <div className="flex flex-col gap-6">
                  <SalesChart data={monthly} />
                  <FunnelChart onOpenCopilot={handleOpenCopilot} />
                </div>
              </div>
            )}

            {activeTab === "produtos" && (
              <div className="space-y-6">
                <ProductDecisionMatrix onOpenCopilot={handleOpenCopilot} />
                <ParetoSection products={pareto} onOpenCopilot={handleOpenCopilot} />
                <BcgMatrix products={pareto} onOpenCopilot={handleOpenCopilot} />
              </div>
            )}

            {activeTab === "clientes" && (
              <div className="space-y-6">
                <CustomerSegments segments={segments} topClients={topClients} onOpenCopilot={handleOpenCopilot} />
              </div>
            )}

            {activeTab === "geografia" && (
              <div className="space-y-6">
                <RegionalAnalysis regions={regions} onOpenCopilot={handleOpenCopilot} />
                <ChannelPerformance channels={channels} onOpenCopilot={handleOpenCopilot} />
              </div>
            )}

            {activeTab === "simulador" && (
              <div className="space-y-6">
                <WhatIfSimulator baseRevenue={filteredKpis.faturamento_total} baseMarginPct={filteredKpis.margem_contribuicao_pct} currentRevenue={filteredKpis.faturamento_total} currentMarginPct={filteredKpis.margem_contribuicao_pct} onOpenCopilot={handleOpenCopilot} />
              </div>
            )}

            {activeTab === "equipe" && (
              <div className="space-y-6">
                <RepsLeaderboard reps={reps} onOpenCopilot={handleOpenCopilot} />
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-700/50 py-6 text-center text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-auto shrink-0 bg-white dark:bg-slate-900">
          Análise Comercial &bull; RN Intelligence &bull; Desenvolvido por <span className="text-blue-500">Renan Nocelli</span> &bull; Arquitetura com DuckDB OLAP, FastAPI, Google Gemini e Next.js
        </footer>
      </div>

      {/* Copilot Chat (Slide-over) */}
      <CopilotSidebar
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        
      />
    </div>
  );
}
 