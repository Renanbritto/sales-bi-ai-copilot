"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  BarChart3,
  Filter,
  Sparkles,
  Database,
  Users,
  PieChart as PieIcon,
} from "lucide-react";
import {
  fetchKpis,
  fetchMonthly,
  fetchPareto,
  fetchReps,
  KpiData,
  MonthlyItem,
  ParetoProduct,
  SalesRep,
  FALLBACK_KPIS,
  FALLBACK_MONTHLY,
  FALLBACK_PARETO,
  FALLBACK_REPS,
} from "@/lib/api";
import { KpiSummary } from "@/components/dashboard/kpi-summary";
import { FunnelChart } from "@/components/dashboard/funnel-chart";
import { ParetoSection } from "@/components/dashboard/pareto-section";
import { ModelSchema } from "@/components/dashboard/model-schema";
import { CopilotSidebar } from "@/components/chat/copilot-sidebar";

// Dynamic imports with ssr: false to prevent Recharts SSR hydration issues
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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"executivo" | "funil" | "pareto" | "equipe" | "modelagem">("executivo");
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const [kpis, setKpis] = useState<KpiData>(FALLBACK_KPIS);
  const [monthly, setMonthly] = useState<MonthlyItem[]>(FALLBACK_MONTHLY);
  const [pareto, setPareto] = useState<ParetoProduct[]>(FALLBACK_PARETO);
  const [reps, setReps] = useState<SalesRep[]>(FALLBACK_REPS);

  useEffect(() => {
    async function loadData() {
      try {
        const [k, m, p, r] = await Promise.all([
          fetchKpis(),
          fetchMonthly(),
          fetchPareto(),
          fetchReps(),
        ]);
        setKpis(k);
        setMonthly(m);
        setPareto(p);
        setReps(r);
      } catch (err) {
        console.error("Erro ao carregar dados da API, mantendo fallback:", err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#070b13]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">Sales BI & AI Copilot</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400">
                  Modern Data Stack
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Painel Executivo Comercial • DuckDB OLAP • Google Gemini
              </p>
            </div>
          </div>

          {/* Botão de Abrir Copilot */}
          <button
            type="button"
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Abrir AI Copilot</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Summary Cards */}
        <KpiSummary data={kpis} />

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 overflow-x-auto">
          <div className="flex gap-2">
            {[
              { id: "executivo", label: "Visão Executiva", icon: BarChart3 },
              { id: "funil", label: "Funil de Vendas B2B", icon: Filter },
              { id: "pareto", label: "Curva ABC (Pareto)", icon: PieIcon },
              { id: "equipe", label: "Equipe & Quotas", icon: Users },
              { id: "modelagem", label: "Modelagem DuckDB", icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px]">13.747 transações faturadas</span>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === "executivo" && (
          <div className="space-y-6">
            <SalesChart data={monthly} />
            <FunnelChart />
          </div>
        )}

        {activeTab === "funil" && (
          <div className="space-y-6">
            <FunnelChart />
          </div>
        )}

        {activeTab === "pareto" && (
          <div className="space-y-6">
            <ParetoSection products={pareto} />
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
            className="text-cyan-400 hover:underline"
          >
            Renan Nocelli
          </a>{" "}
          • Arquitetura com DuckDB, FastAPI, Google Gemini e Next.js
        </p>
      </footer>

      {/* AI Copilot Drawer */}
      <CopilotSidebar isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />
    </div>
  );
}
