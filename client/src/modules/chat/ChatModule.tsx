import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { Badge, Button } from '@bizbot/ui';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  FileText,
} from 'lucide-react';
import { RagCitation } from '@bizbot/shared-types';

export const ChatModule: React.FC = () => {
  const [messages, setMessages] = useState<
    Array<{
      role: 'user' | 'assistant';
      text: string;
      modelUsed?: string;
      sources?: RagCitation[];
      feedbackGiven?: 'thumbs_up' | 'thumbs_down';
    }>
  >([
    {
      role: 'assistant',
      text: '¡Hola! Soy tu asistente de BizBot AI Enterprise. Puedo resolver consultas con RAG de tus documentos, agendar citas en tiempo real, generar contratos PDF o gestionar contactos en el CRM. ¿En qué puedo asistirte?',
      modelUsed: 'claude-3-5-sonnet-latest',
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [modelPref, setModelPref] = useState<'fast' | 'standard' | 'deep'>('standard');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isStreaming) return;
    setInput('');

    setMessages((prev) => [...prev, { role: 'user', text: query }]);
    setIsStreaming(true);

    let assistantText = '';
    let currentSources: RagCitation[] = [];
    let currentModel = 'claude-3-5-sonnet-latest';

    api.streamChat(query, {
      modelPreference: modelPref,
      onMeta: (meta) => {
        if (meta.sources) currentSources = meta.sources;
        if (meta.model) currentModel = meta.model;
      },
      onToken: (token) => {
        assistantText += token;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant') {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: 'assistant',
              text: assistantText,
              modelUsed: currentModel,
              sources: currentSources,
            };
            return updated;
          } else {
            return [
              ...prev,
              {
                role: 'assistant',
                text: assistantText,
                modelUsed: currentModel,
                sources: currentSources,
              },
            ];
          }
        });
      },
      onDone: () => setIsStreaming(false),
      onError: () => setIsStreaming(false),
    });
  };

  const handleFeedback = (index: number, type: 'thumbs_up' | 'thumbs_down') => {
    setMessages((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index].feedbackGiven = type;
      }
      return updated;
    });
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col rounded-3xl bg-[#0E1424] border border-[#23304E] overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="p-4 bg-[#131A2B] border-b border-[#23304E] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl p-0.5 bg-gradient-to-tr from-[#00D4FF] to-[#7C3AED] shadow-[0_0_20px_rgba(0,212,255,0.3)]">
            <img
              src="/bizbot-logo.png"
              alt="BizBot"
              className="w-full h-full object-contain rounded-[12px] bg-[#0B0F19]"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#E8EEF8]">BizBot AI Enterprise Stream</h2>
              <Badge variant="cyan" dot>
                Online
              </Badge>
            </div>
            <p className="text-[11px] text-[#8B9BB8]">RAG Activo • Aislamiento Multi-Tenant orgId</p>
          </div>
        </div>

        {/* Model Router Selector */}
        <div className="flex items-center gap-2 bg-[#0B0F19] p-1 rounded-xl border border-[#23304E] text-xs">
          <span className="text-[#8B9BB8] px-2 font-semibold">Router:</span>
          {(['fast', 'standard', 'deep'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setModelPref(mode)}
              className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all cursor-pointer ${
                modelPref === mode
                  ? 'bg-[#00D4FF] text-[#0B0F19] shadow-[0_0_15px_rgba(0,212,255,0.4)]'
                  : 'text-[#8B9BB8] hover:text-white'
              }`}
            >
              {mode === 'fast' ? '⚡ Haiku' : mode === 'standard' ? '🧠 Sonnet' : '🔬 Opus'}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                m.role === 'user'
                  ? 'bg-[#7C3AED] text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                  : 'bg-gradient-to-tr from-[#00D4FF] to-[#7C3AED] p-0.5'
              }`}
            >
              {m.role === 'user' ? (
                <User className="w-5 h-5" />
              ) : (
                <div className="w-full h-full rounded-[10px] bg-[#0B0F19] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#00D4FF]" />
                </div>
              )}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#00D4FF] text-[#0B0F19] font-medium rounded-tr-none shadow-[0_0_25px_rgba(0,212,255,0.25)]'
                  : 'bg-[#131A2B] border border-[#23304E] text-[#E8EEF8] rounded-tl-none shadow-md'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>

              {/* RAG Citations */}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-[#39E58C] flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    Fuentes Citadas del Conocimiento Empresarial:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {m.sources.map((s, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-[#0B0F19] border border-cyan-800/50 text-[#00D4FF]"
                      >
                        📄 {s.title} (Pág. {s.pageNumber || 1} • {Math.round(s.score * 100)}% relevancia)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Assistant Footer Info */}
              {m.role === 'assistant' && (
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#5F708F]">
                  <span className="font-mono">{m.modelUsed || 'Claude 3.5 Sonnet'}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFeedback(idx, 'thumbs_up')}
                      className={`hover:text-[#39E58C] transition-colors cursor-pointer ${
                        m.feedbackGiven === 'thumbs_up' ? 'text-[#39E58C]' : ''
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleFeedback(idx, 'thumbs_down')}
                      className={`hover:text-red-400 transition-colors cursor-pointer ${
                        m.feedbackGiven === 'thumbs_down' ? 'text-red-400' : ''
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isStreaming && (
          <div className="flex items-center gap-2 text-xs text-[#00D4FF] pl-12 animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Generando respuesta en streaming SSE...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-[#0B0F19] border-t border-[#23304E] flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[#8B9BB8] shrink-0 font-semibold">Sugerencias:</span>
        {[
          '¿Cómo agendo una cita en el calendario?',
          '¿Qué datos necesito para generar un contrato?',
          'Explicar política de aislamiento multi-tenant',
        ].map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="shrink-0 px-3 py-1 rounded-lg bg-[#131A2B] border border-[#23304E] text-[#C4B5FD] hover:border-[#00D4FF] hover:text-[#00D4FF] transition-all cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-[#131A2B] border-t border-[#23304E] flex items-center gap-3">
        <input
          type="text"
          placeholder="Escribe tu mensaje para el asistente empresarial..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 h-12 px-4 rounded-xl bg-[#0B0F19] border border-[#23304E] text-sm text-[#E8EEF8] placeholder-[#5F708F] focus:outline-none focus:border-[#00D4FF]"
        />
        <Button
          variant="primary"
          size="md"
          onClick={() => handleSend()}
          disabled={!input.trim() || isStreaming}
          rightIcon={<Send className="w-4 h-4" />}
          className="h-12 px-6"
        >
          Enviar
        </Button>
      </div>
    </div>
  );
};
