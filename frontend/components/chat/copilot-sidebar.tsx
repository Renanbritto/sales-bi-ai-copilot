"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  X,
  Code2,
  ChevronDown,
  ChevronUp,
  Cpu,
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
        "Olá! Sou o seu **RN Intelligence**, integrado diretamente à base analítica DuckDB via Google Gemini.\n\nVocê pode me fazer qualquer pergunta sobre faturamento, atingimento de metas, curva ABC de produtos ou performance de vendedores!",
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
        className="w-full max-w-lg h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Copilot */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-900/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                RN Intelligence
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-600 dark:text-blue-400 font-medium">
                  DuckDB + Gemini
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Agente Analítico Autônomo com Text-to-SQL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={clearChat}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Limpar Conversa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Fechar Painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Telemetria de Conexão */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>Motor: DuckDB OLAP Columnar</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            <span>13.747 Linhas Prontas</span>
          </div>
        </div>

        {/* Mensagens do Chat */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40 dark:bg-slate-950/50">
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
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 shadow-xs ${
                    isUser
                      ? "bg-blue-600 text-white rounded-br-xs"
                      : "bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 rounded-bl-xs"
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>

                  {/* SQL Telemetry & Code Accordion */}
                  {msg.sql && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => toggleSql(msg.id)}
                          className="flex items-center gap-1 text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
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
                          <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            <Clock className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                            {msg.executionTime.toFixed(1)} ms
                          </span>
                        )}
                      </div>

                      {expandedSql[msg.id] && (
                        <pre className="p-2.5 rounded-lg bg-slate-900 dark:bg-black/80 border border-slate-700/70 text-[11px] font-mono text-emerald-400 overflow-x-auto">
                          {msg.sql}
                        </pre>
                      )}
                    </div>
                  )}

                  <div className={`text-[10px] text-right font-mono ${isUser ? "text-blue-200" : "text-slate-400 dark:text-slate-500"}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 text-xs items-center text-slate-500 dark:text-slate-400">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <span className="text-slate-700 dark:text-slate-200 font-mono text-[11px]">
                  Executando consulta SQL no DuckDB...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Perguntas Rápidas */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Perguntas Rápidas Sugeridas:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-slate-600 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors text-left cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input de Mensagem */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
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
              placeholder="Pergunte ao RN Intelligence (ex: vendas por canal, ranking...)"
              disabled={isLoading}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-400 outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-900/20 disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2 font-mono">
            RN Intelligence conectado ao banco colunar DuckDB em modo somente leitura.
          </p>
        </div>
      </div>
    </div>
  );
}
