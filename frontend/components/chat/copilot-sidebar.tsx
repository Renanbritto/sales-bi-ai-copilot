"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  X,
  User,
  Trash2,
  MessageSquare,
  Code2,
  ChevronDown,
  ChevronUp,
  Clock,
  Database,
} from "lucide-react";
import {
  ChatMessage,
  ChatHistoryItem,
  ProjectMetadata,
  fetchProjectMetadata,
  streamChatMessage,
  FALLBACK_SALES_BI_METADATA,
} from "@/lib/rn-intelligence";

interface CopilotSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export function CopilotSidebar({ isOpen, onClose, initialPrompt }: CopilotSidebarProps) {
  const [projectMeta, setProjectMeta] = useState<ProjectMetadata>(FALLBACK_SALES_BI_METADATA);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [expandedSql, setExpandedSql] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Carrega metadados e perguntas sugeridas do projeto ao montar
  useEffect(() => {
    let mounted = true;
    fetchProjectMetadata().then((meta) => {
      if (mounted) {
        setProjectMeta(meta);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Atalhos de teclado: Escape para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Foco no input ao abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Rolagem suave com novas mensagens ou streaming
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Executa prompt inicial quando fornecido externamente
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSend(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt, isOpen]);

  const clearChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setHasStarted(false);
    setIsLoading(false);
    setExpandedSql({});
  };

  const toggleSql = (msgId: string) => {
    setExpandedSql((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handleSend = useCallback(
    async (textToSend?: string) => {
      const query = (textToSend || input).trim();
      if (!query || isLoading) return;

      const userMsgId = Date.now().toString();
      const assistantMsgId = (Date.now() + 1).toString();
      const nowTimestamp = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const userMsg: ChatMessage = {
        id: userMsgId,
        role: "user",
        content: query,
        timestamp: nowTimestamp,
      };

      // Mensagem inicial do assistente para streaming
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: nowTimestamp,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setHasStarted(true);
      if (!textToSend) setInput("");
      setIsLoading(true);

      const historyPayload: ChatHistoryItem[] = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      abortControllerRef.current = new AbortController();

      try {
        await streamChatMessage({
          projectId: projectMeta.project_id,
          message: query,
          history: historyPayload,
          signal: abortControllerRef.current.signal,
          onMetadata: (meta) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? {
                      ...msg,
                      sql: meta.sql_query,
                      data: meta.query_results,
                      mode: meta.mode,
                    }
                  : msg
              )
            );
          },
          onChunk: (delta) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? {
                      ...msg,
                      content: msg.content + delta,
                    }
                  : msg
              )
            );
          },
          onDone: (telemetry) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? {
                      ...msg,
                      executionTime: telemetry.execution_time_ms,
                      mode: telemetry.mode || msg.mode,
                    }
                  : msg
              )
            );
            setIsLoading(false);
          },
          onError: () => {
            setIsLoading(false);
          },
        });
      } catch {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages, projectMeta.project_id]
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ease-out ${
        isOpen
          ? "pointer-events-auto bg-black/60 backdrop-blur-sm opacity-100"
          : "pointer-events-none bg-black/0 backdrop-blur-none opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg md:max-w-xl h-full bg-[#0b0f1a] border-l border-white/10 flex flex-col shadow-2xl transition-all duration-300 ease-out relative overflow-hidden ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute top-0 right-0 w-80 h-40 bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl" />

        {/* HEADER DO DRAWER */}
        <div className="p-4 px-5 border-b border-white/10 flex items-center justify-between bg-[#0b0f1a]/95 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-2xl bg-[#0c101d] border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10 overflow-hidden shrink-0">
                <img
                  src="/rn_logo_emblem.jpg"
                  alt="RN Intelligence"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">RN Intelligence</h2>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[240px] sm:max-w-[300px]">
                {projectMeta.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={clearChat}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer border border-transparent hover:border-white/5"
              title="Limpar Conversa"
              aria-label="Limpar Conversa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer border border-transparent hover:border-white/5"
              title="Fechar Painel (Esc)"
              aria-label="Fechar Painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CORPO DAS MENSAGENS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#090d16]/70 relative">
          {/* Empty State / Boas-vindas quando o chat está limpo */}
          {!hasStarted && messages.length === 0 && (
            <div className="my-auto py-6 flex flex-col items-center text-center space-y-5 animate-in fade-in duration-300">
              <div className="h-16 w-16 rounded-3xl bg-[#0c101d] border border-cyan-500/30 flex items-center justify-center shadow-xl shadow-cyan-500/10 overflow-hidden shrink-0">
                <img
                  src="/rn_logo_emblem.jpg"
                  alt="RN Intelligence"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5 max-w-md">
                <h3 className="text-base font-bold text-white">
                  Bem-vindo ao RN Intelligence
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Assistente analítico executivo integrado ao DuckDB OLAP. Pergunte sobre decomposição de receita, margem de contribuição, curva ABC de produtos ou performance de vendedores.
                </p>
              </div>

              {/* Tags do projeto */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-sm">
                {projectMeta.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-white/[0.03] text-slate-300 border border-white/5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Perguntas Sugeridas do Catálogo */}
              <div className="w-full text-left space-y-2 pt-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1">
                  Perguntas Sugeridas para Começar:
                </span>
                <div className="flex flex-col gap-2">
                  {projectMeta.suggested_questions.map((question, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(question)}
                      className="group flex items-start gap-2.5 p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-cyan-500/30 text-left transition-all cursor-pointer shadow-sm hover:shadow-cyan-500/5"
                    >
                      <MessageSquare className="h-4 w-4 text-cyan-400 group-hover:scale-110 shrink-0 mt-0.5 transition-transform" />
                      <span className="text-xs text-slate-300 group-hover:text-white font-medium leading-relaxed">
                        {question}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Renderização das mensagens */}
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs leading-relaxed animate-in fade-in duration-200 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-[#0c101d] border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5 shadow-sm overflow-hidden">
                    <img
                      src="/rn_logo_emblem.jpg"
                      alt="RN"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 space-y-2.5 shadow-lg relative border ${
                    isUser
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500/40 rounded-br-xs"
                      : "bg-[#0f1422] border-white/10 text-slate-200 rounded-bl-xs"
                  }`}
                >
                  {/* Conteúdo com suporte a formatação executiva */}
                  <div className="whitespace-pre-line leading-relaxed space-y-2">
                    {msg.content ? (
                      <div>
                        {msg.content.split("\n\n").map((paragraph, pIdx) => (
                          <p key={pIdx} className="mb-2 last:mb-0">
                            {paragraph.split("**").map((chunk, cIdx) =>
                              cIdx % 2 === 1 ? (
                                <strong key={cIdx} className="font-semibold text-white">
                                  {chunk}
                                </strong>
                              ) : (
                                chunk
                              )
                            )}
                          </p>
                        ))}
                      </div>
                    ) : (
                      // Efeito de digitação suave enquanto aguarda o primeiro chunk
                      <div className="flex items-center gap-2 text-slate-400 py-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        <span className="text-[11px] font-mono">
                          Processando consulta com DuckDB...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* SQL Telemetry & Code Accordion */}
                  {msg.sql && (
                    <div className="mt-2 pt-2 border-t border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => toggleSql(msg.id)}
                          className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
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
                        <div className="space-y-2 animate-in fade-in duration-150">
                          <pre className="p-3 rounded-xl bg-black/80 border border-white/10 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                            {msg.sql}
                          </pre>
                          {msg.data && msg.data.length > 0 && (
                            <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 text-[10px] font-mono text-slate-300 overflow-x-auto">
                              <span className="text-cyan-400 font-bold block mb-1">Resultado:</span>
                              <pre className="whitespace-pre">{JSON.stringify(msg.data, null, 2)}</pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className={`text-[10px] text-right font-mono pt-1 ${
                      isUser ? "text-blue-200/80" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-blue-900/30">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && messages.length > 0 && !messages[messages.length - 1].content && (
            <div className="flex gap-3 text-xs items-center text-slate-400">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 p-0.5 animate-pulse">
                <Database className="h-3.5 w-3.5 text-cyan-400" />
              </div>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#0f1422] border border-white/10">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-slate-300 font-mono text-[11px]">
                  Executando consulta SQL colunar no DuckDB...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* PERGUNTAS RÁPIDAS (CHIPS) */}
        {hasStarted && (
          <div className="p-3 border-t border-white/5 bg-[#0b0f1a] overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 shrink-0 px-1">
              Sugestões:
            </span>
            {projectMeta.suggested_questions.slice(0, 3).map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-cyan-500/15 text-slate-300 hover:text-cyan-200 border border-white/5 hover:border-cyan-500/30 transition-all text-left whitespace-nowrap cursor-pointer disabled:opacity-40"
              >
                {prompt.length > 38 ? prompt.substring(0, 35) + "..." : prompt}
              </button>
            ))}
          </div>
        )}

        {/* INPUT DE MENSAGEM */}
        <div className="p-4 border-t border-white/10 bg-[#0b0f1a]/95 backdrop-blur-md relative z-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte ao RN Intelligence (ex: vendas, ranking, margem...)"
                disabled={isLoading}
                className="w-full bg-[#090d16] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-400 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-900/30 disabled:opacity-40 transition-all flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Enviar Pergunta"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
