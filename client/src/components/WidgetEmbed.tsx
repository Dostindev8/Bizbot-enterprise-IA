import React, { useState, useRef, useEffect } from 'react';
import { api } from '../lib/api.js';
import { Bot, X, Send, Sparkles, ChevronDown } from 'lucide-react';
import { RagCitation } from '@bizbot/shared-types';

export const WidgetEmbed: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; sources?: RagCitation[] }>>([
    {
      role: 'assistant',
      text: '¡Hola! Soy BizBot AI Assistant. ¿En qué puedo ayudarte hoy con información de servicios, citas o cotizaciones?',
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    const userText = input.trim();
    setInput('');

    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsStreaming(true);

    let assistantText = '';

    api.streamChat(userText, {
      onToken: (token) => {
        assistantText += token;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant' && prev.length > 1 && prev[prev.length - 2]?.text === userText) {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'assistant', text: assistantText };
            return updated;
          } else {
            return [...prev, { role: 'assistant', text: assistantText }];
          }
        });
      },
      onMeta: (meta) => {
        if (meta.sources?.length) {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.role === 'assistant') {
              last.sources = meta.sources;
              return [...prev];
            }
            return prev;
          });
        }
      },
      onDone: () => setIsStreaming(false),
      onError: () => setIsStreaming(false),
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Widget Window */}
      {isOpen && (
        <div className="mb-4 w-90 sm:w-96 h-[520px] rounded-2xl bg-[#131A2B]/95 backdrop-blur-2xl border border-[#00D4FF]/30 shadow-[0_0_60px_rgba(0,212,255,0.22)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#0B0F19] to-[#131A2B] border-b border-[#23304E] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl p-0.5 bg-gradient-to-tr from-[#00D4FF] to-[#7C3AED] shadow-[0_0_15px_rgba(0,212,255,0.4)]">
                <img
                  src="/bizbot-logo.png"
                  alt="BizBot"
                  className="w-full h-full object-contain rounded-[10px] bg-[#0B0F19]"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-[#E8EEF8]">BizBot AI</h4>
                  <span className="w-2 h-2 rounded-full bg-[#39E58C] animate-pulse" />
                </div>
                <p className="text-[10px] text-[#8B9BB8]">Asistente de Negocios 24/7</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-[#8B9BB8] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#00D4FF] text-[#0B0F19] font-medium rounded-br-none shadow-[0_0_20px_rgba(0,212,255,0.25)]'
                      : 'bg-[#0B0F19] border border-[#23304E] text-[#E8EEF8] rounded-bl-none shadow-[0_0_15px_rgba(0,0,0,0.3)]'
                  }`}
                >
                  {m.text}
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {m.sources.map((s, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40"
                      >
                        📄 {s.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isStreaming && (
              <div className="flex items-center gap-1 text-[#00D4FF] text-xs">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Escribiendo respuesta...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-[#0B0F19] border-t border-[#23304E] flex items-center gap-2">
            <input
              type="text"
              placeholder="Haz tu consulta de negocios..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 h-10 px-3.5 rounded-xl bg-[#131A2B] border border-[#23304E] text-[#E8EEF8] text-xs placeholder-[#5F708F] focus:outline-none focus:border-[#00D4FF]"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="w-10 h-10 rounded-xl bg-[#00D4FF] text-[#0B0F19] flex items-center justify-center hover:bg-[#33DCFF] disabled:opacity-40 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Widget Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#00D4FF] via-[#7C3AED] to-[#39E58C] p-0.5 shadow-[0_0_35px_rgba(0,212,255,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center group"
      >
        <div className="w-full h-full rounded-full bg-[#0B0F19] flex items-center justify-center text-white group-hover:bg-[#131A2B] transition-colors">
          {isOpen ? <X className="w-6 h-6 text-[#00D4FF]" /> : <Bot className="w-7 h-7 text-[#00D4FF]" />}
        </div>
      </button>
    </div>
  );
};
