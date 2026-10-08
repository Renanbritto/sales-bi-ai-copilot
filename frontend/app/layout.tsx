import "./globals.css";
import React from "react";
import { Comfortaa } from "next/font/google";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-comfortaa",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Sales BI & RN Intelligence | Painel Comercial Executivo",
  description: "Plataforma analítica executiva de BI Comercial integrada com DuckDB OLAP e RN Intelligence (Google Gemini).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`dark ${comfortaa.variable}`}>
      <body className={`${comfortaa.className} min-h-screen bg-[#070b13] text-slate-100 antialiased selection:bg-cyan-500/20 selection:text-cyan-300 font-sans`}>
        {children}
      </body>
    </html>
  );
}
