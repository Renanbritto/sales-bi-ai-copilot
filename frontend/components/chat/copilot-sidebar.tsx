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
}

const QUICK_PROMPTS = [
  "Quem é o vendedor com maior faturamento?",
  "Qual o produto da Classe A mais vendido?",
  "Qual a margem de contribuição geral?",
  "Quantos pedidos foram faturados no total?",
];

export function CopilotSidebar({ isOpen, onClose }: CopilotSidebarProps) {
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
      // Expande o SQL da nova mensagem automaticamente
      setExpandedSql((prev) => ({ ...prev, [assistantMsg.id]: true }));
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao consultar o motor analítico. Verifique se o backend está ativo.",
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
        content: "Conversa reiniciada. Como posso ajudar com a análise do BI hoje?",
        timestamp: "Agora",
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <aside className="fixed inset-y-0 right-0 w-full sm:w-[480px] z-50 flex flex-col bg-[#0b1120] border-l border-slate-800 shadow-2xl transition-all duration-300">
      {/* Header do Copilot */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-white text-sm">BI AI Copilot</h2>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950 border border-cyan-800 text-cyan-400">
                Gemini 2.0
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Conectado ao DuckDB OLAP</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            title="Limpar conversa"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            title="Fechar Copilot"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2.5 bg-slate-900/30 border-b border-slate-800/80 overflow-x-auto">
        <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider mb-1.5">
          Sugestões de Perguntas:
        </p>
        <div className="flex gap-1.5">
          {QUICK_PROMPTS.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div key={m.id} className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isUser ? "bg-cyan-600 text-white" : "bg-slate-800 text-cyan-400 border border-slate-700"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] space-y-2`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? "bg-cyan-600 text-white rounded-tr-none shadow-md shadow-cyan-900/20"
                      : "glass-panel text-slate-200 rounded-tl-none border border-slate-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>

                {/* Bloco de Inspeção SQL (apenas mensagens do assistente que executaram query) */}
                {m.sql && (
                  <div className="glass-panel rounded-lg overflow-hidden border border-slate-800/90 text-xs">
                    <button
                      onClick={() => toggleSql(m.id)}
                      className="w-full px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800/80 flex items-center justify-between text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <span className="flex items-center gap-1.5 font-mono text-[11px]">
                        <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                        SQL executado no DuckDB
                      </span>
                      <div className="flex items-center gap-2">
                        {m.executionTime !== undefined && (
                          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {m.executionTime}ms
                          </span>
                        )}
                        {expandedSql[m.id] ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </button>

                    {expandedSql[m.id] && (
                      <div className="p-3 bg-slate-950 border-t border-slate-800/60 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                        <pre className="whitespace-pre-wrap">{m.sql}</pre>
                      </div>
                    )}
                  </div>
                )}

                <div className={`text-[10px] text-slate-500 px-1 ${isUser ? "text-right" : "text-left"}`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-800 text-cyan-400 border border-slate-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="glass-panel p-3.5 rounded-2xl rounded-tl-none border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Consultando DuckDB e gerando resposta...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input de Mensagem */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Faça uma pergunta sobre o BI comercial..."
            disabled={isLoading}
            className="flex-1 bg-slate-950/80 border border-slate-800 focus:border-cyan-500/60 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:hover:bg-cyan-500 text-slate-950 font-medium transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </aside>
  );
}
