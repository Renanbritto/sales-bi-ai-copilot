"use client";

import React from "react";
import { Database } from "lucide-react";

export function ModelSchema() {
  const tables = [
    {
      name: "f_vendas",
      type: "Tabela Fato",
      color: "border-blue-500/50 bg-slate-900/20",
      badge: "13.7k+ Linhas",
      cols: [
        "venda_id (PK)",
        "numero_pedido",
        "data_id (FK → d_calendario)",
        "produto_id (FK → d_produtos)",
        "vendedor_id (FK → d_vendedores)",
        "cliente_id (FK → d_clientes)",
        "canal_id (FK → d_canais)",
        "quantidade",
        "preco_unitario_praticado",
        "valor_bruto",
        "valor_desconto",
        "valor_liquido",
        "custo_total",
        "margem_contribuicao_valor",
        "margem_contribuicao_pct",
        "status_pedido ('Faturado')",
      ],
    },
    {
      name: "d_calendario",
      type: "Dimensão",
      color: "border-blue-500/40 bg-blue-950/20",
      badge: "731 Dias",
      cols: ["data_id (PK)", "data", "ano", "mes", "nome_mes", "trimestre", "semestre", "dia_util"],
    },
    {
      name: "d_produtos",
      type: "Dimensão",
      color: "border-indigo-500/40 bg-indigo-950/20",
      badge: "8 SKUs",
      cols: ["produto_id (PK)", "sku", "nome_produto", "categoria", "preco_tabela", "custo_base", "classe_abc"],
    },
    {
      name: "d_vendedores",
      type: "Dimensão",
      color: "border-emerald-500/40 bg-emerald-950/20",
      badge: "5 Vendedores",
      cols: ["vendedor_id (PK)", "nome_vendedor", "regional", "cargo", "email"],
    },
    {
      name: "d_clientes",
      type: "Dimensão",
      color: "border-purple-500/40 bg-purple-950/20",
      badge: "40 Contas B2B",
      cols: ["cliente_id (PK)", "razao_social", "segmento", "porte", "estado", "regiao"],
    },
    {
      name: "f_metas",
      type: "Tabela Fato",
      color: "border-amber-500/40 bg-amber-950/20",
      badge: "120 Metas",
      cols: ["meta_id (PK)", "ano", "mes", "vendedor_id (FK)", "meta_faturamento", "meta_pedidos", "meta_margem_pct"],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-xl p-6 border border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <Database className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Arquitetura de Dados: Star Schema Dimensional (DuckDB)</h2>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl">
          Modelagem em Modelo Estrela (Kimball) otimizada para consultas analíticas colunares.
          O Agente de IA utiliza esta estrutura para gerar consultas SQL Text-to-SQL em milissegundos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {tables.map((t) => (
            <div key={t.name} className={`p-4 rounded-xl border ${t.color} glass-panel`}>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/5">
                <div>
                  <h3 className="font-mono font-bold text-white text-sm">{t.name}</h3>
                  <p className="text-[11px] text-slate-400">{t.type}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                  {t.badge}
                </span>
              </div>
              <ul className="space-y-1">
                {t.cols.map((col, i) => (
                  <li key={i} className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-500" />
                    {col}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
