import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";
import React from "react";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-comfortaa",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sales-bi-ai-copilot.vercel.app"),
  title: "Sales BI | AI Executive Copilot • RN Intelligence",
  description:
    "Plataforma analítica executiva de BI Comercial integrada com DuckDB OLAP, decomposição de margem e RN Intelligence (Google Gemini).",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Sales BI | AI Executive Copilot • RN Intelligence",
    description:
      "Plataforma analítica executiva de BI Comercial integrada com DuckDB OLAP e RN Intelligence. 13.7k transações analisadas, R$ 39M em faturamento monitorado.",
    url: "https://sales-bi-ai-copilot.vercel.app",
    siteName: "Sales BI • RN Intelligence",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sales BI AI Executive Copilot • RN Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sales BI | AI Executive Copilot • RN Intelligence",
    description:
      "Plataforma analítica executiva de BI Comercial integrada com DuckDB OLAP e RN Intelligence. Powered by RN Intelligence.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`dark ${comfortaa.variable}`}>
      <body
        className={`${comfortaa.className} font-sans min-h-screen antialiased bg-[#090d16] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-200`}
      >
        {children}
      </body>
    </html>
  );
}
