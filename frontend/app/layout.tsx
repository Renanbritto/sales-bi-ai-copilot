import "./globals.css";
import React from "react";

export const metadata = {
  title: "Sales BI & AI Copilot | Painel Comercial Executivo",
  description: "Plataforma analítica executiva de BI Comercial integrada com DuckDB OLAP e Agente de IA Conversacional (Google Gemini).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-[#070b13] text-slate-100 antialiased selection:bg-cyan-500/20 selection:text-cyan-300">
        {children}
      </body>
    </html>
  );
}
