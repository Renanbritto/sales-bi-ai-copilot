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
  title: "Análise Comercial | RN Intelligence",
  description: "Plataforma analítica executiva de BI Comercial integrada com DuckDB OLAP e RN Intelligence (Google Gemini).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`dark ${comfortaa.variable}`}>
      <body className={`${comfortaa.className} min-h-screen bg-[#f8fafc] text-slate-900 antialiased selection:bg-blue-600/20 selection:text-blue-900 font-sans`}>
        {children}
      </body>
    </html>
  );
}
