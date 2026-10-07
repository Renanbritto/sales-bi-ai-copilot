"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  X,
  Code2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Bot,
  User,
  Trash2,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { ChatMessage, sendChatMessage } from "@/lib/api";

interface CopilotSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

const QUICK_PROMPTS = [
  "Quem é o vendedor com maior faturamento?",
  "Qual o produto da Classe A mais vendido?",
  "Qual a margem de contribuição geral?",
  "Quantos pedidos foram faturados no total?",
];

export function CopilotSidebar({ isOpen, onClose, initialPrompt }: CopilotSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Olá! Sou o seu **Sales BI AI Copilot**, integrado diretamente à base analítica DuckDB via Google Gemini.\n\nVocê pode me fazer qualquer pergunta sobre faturamento, atingimento de metas, curva ABC de produtos ou performance de vendedores!",
      timestamp: "Agora",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSql, setExpandedSql] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto preenche o prompt quando o usuário clica a partir de um card ou KPI
  useEffect(() => {
    if (isOpen && initialPrompt) {
      setInput(initialPrompt);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(query);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.reply,
        sql: response.sql_query,
        data: response.query_results,
        executionTime: response.execution_time_ms,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Desculpe, ocorreu uma instabilidade ao consultar o backend analítico DuckDB. Verifique se o serviço FastAPI está em execução.",
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSql = (msgId: string) => {
    setExpandedSql((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Histórico limpo! Pronto para uma nova análise sobre os dados de vendas.",
        timestamp: "Agora",
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div
        className="w-full max-w-lg h-full bg-[#0a0f1d] border-l border-cyan-500/30 flex flex-col shadow-2xl shadow-cyan-500/10 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Copilot */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Sales AI Copilot
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400">
                  DuckDB + Gemini
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Agente Analítico Autônomo com Text-to-SQL</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={clearChat}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Limpar Conversa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Fechar Painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Telemetria de Conexão */}
        <div className="px-4 py-2 bg-cyan-950/20 border-b border-cyan-900/30 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>Motor: DuckDB OLAP Columnar</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>13.747 Linhas Prontas</span>
          </div>
        </div>

        {/* Mensagens do Chat */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs leading-relaxed ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 ${
                    isUser
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-xs"
                      : "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>

                  {/* SQL Telemetry & Code Accordion */}
                  {msg.sql && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => toggleSql(msg.id)}
                          className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>{expandedSql[msg.id] ? "Ocultar SQL" : "Inspecionar SQL DuckDB"}</span>
                          {expandedSql[msg.id] ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>

                        {msg.executionTime && (
                          <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                            <Clock className="w-3 h-3 text-emerald-400" />
                            {msg.executionTime.toFixed(1)} ms
                          </span>
                        )}
                      </div>

                      {expandedSql[msg.id] && (
                        <pre className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                          {msg.sql}
                        </pre>
                      )}
                    </div>
                  )}

                  <div className="text-[10px] text-right text-slate-400/60 font-mono">
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 text-xs items-center text-slate-400">
              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-slate-300 font-mono text-[11px]">
                  Executando consulta SQL no DuckDB...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Perguntas Rápidas */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-2">
            Perguntas Rápidas Sugeridas:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/50 hover:text-cyan-300 hover:border-cyan-800 border border-slate-800 text-slate-300 transition-colors text-left cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input de Mensagem */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte ao Copilot (ex: vendas por canal, ranking...)"
              disabled={isLoading}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs shadow-md shadow-cyan-500/20 disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <p className="text-[10px] text-center text-slate-400 mt-2 font-mono">
            Copilot conectado ao banco colunar DuckDB em modo somente leitura.
          </p>
        </div>
      </div>
    </div>
  );
}
