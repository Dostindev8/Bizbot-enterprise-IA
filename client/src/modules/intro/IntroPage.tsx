import React, { useState } from 'react';
import { useAppStore } from '../../lib/store.js';
import { api } from '../../lib/api.js';
import { RagCitation } from '@bizbot/shared-types';
import { Button, GlassPanel, Badge, UptimeBadge, ThinkingIndicator } from '@bizbot/ui';
import {
  Bot,
  Sparkles,
  Calendar,
  FileText,
  Users,
  PhoneCall,
  GitFork,
  BarChart3,
  ShieldCheck,
  Send,
  ArrowRight,
  Award,
} from 'lucide-react';

export const IntroPage: React.FC = () => {
  const { setCurrentModule } = useAppStore();
  const [sandboxInput, setSandboxInput] = useState('');
  const [sandboxOutput, setSandboxOutput] = useState(
    '¡Hola! Soy BizBot AI Enterprise. Pregúntame sobre disponibilidad de citas, tarifas SaaS, generación de documentos o cómo aislamos los datos de tu organización con RAG multi-tenant.'
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [sources, setSources] = useState<RagCitation[]>([]);

  const handleTestChat = (presetText?: string) => {
    const textToSend = presetText || sandboxInput;
    if (!textToSend.trim() || isStreaming) return;
    setSandboxInput('');
    setIsStreaming(true);
    setSandboxOutput('');
    setSources([]);

    api.streamChat(textToSend, {
      onToken: (token) => {
        setSandboxOutput((prev) => prev + token);
      },
      onMeta: (meta) => {
        if (meta.sources) setSources(meta.sources);
      },
      onDone: () => setIsStreaming(false),
      onError: () => setIsStreaming(false),
    });
  };

  return (
    <div className="relative min-h-screen bg-[#0B0F19] text-[#E8EEF8] overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-[#00D4FF]/18 to-[#7C3AED]/22 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[45%] right-[-10%] w-[600px] h-[600px] bg-[#7C3AED]/12 blur-[150px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-20 flex flex-col items-center text-center">
        {/* Top Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <Badge variant="cyan" dot>
            GOD-STACK Edition v3.0 · Enterprise Ready
          </Badge>
          <Badge variant="purple">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-300 inline" />
            Model Router: Claude 3.5 Sonnet / Opus
          </Badge>
          <UptimeBadge uptime={99.98} />
        </div>

        {/* 3D Metallic Animated Logo Badge */}
        <div className="relative mb-8 group">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl p-1 bg-gradient-to-tr from-[#00D4FF] via-[#7C3AED] to-[#39E58C] shadow-[0_0_80px_rgba(0,212,255,0.45)] group-hover:scale-105 transition-all duration-500 animate-float">
            <div className="w-full h-full rounded-[22px] bg-[#0B0F19] p-3 flex items-center justify-center overflow-hidden">
              <img
                src="/bizbot-logo.png"
                alt="BizBot AI 3D Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(0,212,255,0.6)]"
              />
            </div>
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-1 rounded-full bg-[#131A2B] border border-[#00D4FF]/40 text-[11px] font-bold text-[#00D4FF] shadow-[0_0_20px_rgba(0,212,255,0.3)]">
            IA CONTEXTUAL • AUTOMATIZACIÓN • ANALYTICS
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl leading-[1.1] mb-6">
          El Asistente de Negocios Autónomo que <br />
          <span className="gradient-text-cyan-purple">Comprende, Agenda, Vende y Firma</span>
        </h1>

        <p className="text-base sm:text-xl text-[#8B9BB8] max-w-3xl leading-relaxed mb-10 font-normal">
          Plataforma empresarial de inteligencia artificial con RAG multi-tenant, sincronización de
          Google Calendar, generación de documentos con firma digital, CRM integrado y Call Center
          con Whisper en tiempo real.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setCurrentModule('register')}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="w-full sm:w-auto text-base px-8 h-14"
          >
            Comenzar Prueba Gratis (14 Días)
          </Button>
          <Button
            variant="glass"
            size="lg"
            onClick={() => setCurrentModule('login')}
            className="w-full sm:w-auto text-base px-8 h-14 border-[#00D4FF]/40 hover:border-[#00D4FF]"
          >
            Acceso a Demo Enterprise
          </Button>
        </div>

        {/* Live Interactive Prompt Sandbox */}
        <div className="w-full max-w-4xl rounded-3xl p-6 sm:p-8 bg-[#131A2B]/90 backdrop-blur-2xl border border-[#00D4FF]/30 shadow-[0_0_80px_rgba(0,212,255,0.18)] text-left mb-20">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-[#23304E]">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs font-mono text-[#8B9BB8] ml-2">
                sandbox://bizbot-live-engine-v3.0
              </span>
            </div>
            <ThinkingIndicator model="Claude 3.5 Sonnet + RAG" />
          </div>

          {/* Preset Prompts */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs text-[#8B9BB8] flex items-center font-semibold">Prueba rápida:</span>
            {[
              '¿Cómo agendo una cita de demostración técnica?',
              '¿Cuáles son los planes y costos de BizBot AI?',
              '¿Cómo funciona el aislamiento de seguridad multi-tenant?',
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => handleTestChat(p)}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-[#23304E] text-[#C4B5FD] hover:border-[#00D4FF] hover:text-[#00D4FF] transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* AI Response Box */}
          <div className="p-5 rounded-2xl bg-[#0B0F19] border border-[#23304E] min-h-[140px] text-sm leading-relaxed text-[#E8EEF8] mb-4 relative whitespace-pre-line">
            {sandboxOutput}
            {isStreaming && <span className="inline-block w-2 h-4 bg-[#00D4FF] ml-1 animate-pulse" />}
            {sources.length > 0 && (
              <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-[#39E58C]">Fuentes Citadas (RAG):</span>
                {sources.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded bg-cyan-950/80 text-[#00D4FF] border border-cyan-800/50"
                  >
                    📄 {s.title} ({Math.round(s.score * 100)}% match)
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Escribe cualquier pregunta para probar la IA en vivo..."
              value={sandboxInput}
              onChange={(e) => setSandboxInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTestChat()}
              className="flex-1 h-12 px-4 rounded-xl bg-[#0B0F19] border border-[#23304E] text-sm text-[#E8EEF8] placeholder-[#5F708F] focus:outline-none focus:border-[#00D4FF]"
            />
            <Button
              variant="primary"
              size="md"
              onClick={() => handleTestChat()}
              disabled={!sandboxInput.trim() || isStreaming}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Enviar
            </Button>
          </div>
        </div>

        {/* 8 Core Functional Modules Grid */}
        <div className="w-full text-left mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-3 text-[#E8EEF8]">
              8 Módulos Core Integrados en una Sola Plataforma
            </h2>
            <p className="text-[#8B9BB8] max-w-2xl mx-auto text-sm sm:text-base">
              Elimina la necesidad de contratar 6 herramientas separadas. BizBot AI unifica toda la
              operación comercial y de soporte.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <Bot className="w-6 h-6 text-[#00D4FF]" />,
                title: 'Chat IA con RAG',
                desc: 'Streaming SSE, respuestas basadas en tus documentos corporativos con citas clickeables y Model Router.',
              },
              {
                icon: <Calendar className="w-6 h-6 text-emerald-400" />,
                title: 'Agenda Inteligente',
                desc: 'Citas por lenguaje natural con verificación de disponibilidad y sincronización Google/Outlook.',
              },
              {
                icon: <Users className="w-6 h-6 text-purple-400" />,
                title: 'CRM & Lead Scoring',
                desc: 'Captura automática de prospectos, calificación con IA de 0 a 100 y pipeline Kanban interactivo.',
              },
              {
                icon: <FileText className="w-6 h-6 text-amber-400" />,
                title: 'Documentos & Firma',
                desc: 'Generación automática de contratos en PDF desde plantillas y firma digital con validez legal.',
              },
              {
                icon: <PhoneCall className="w-6 h-6 text-cyan-400" />,
                title: 'Call Center & Voz',
                desc: 'ACD inteligente, transcripción en tiempo real con Whisper, IVR conversacional y métricas de QA.',
              },
              {
                icon: <GitFork className="w-6 h-6 text-indigo-400" />,
                title: 'Workflow Engine',
                desc: 'Automatizaciones visuales drag & drop con triggers, condiciones, acciones y webhooks externos.',
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-teal-400" />,
                title: 'Analytics & SLA',
                desc: 'Panel ejecutivo con tasa de auto-resolución, CSAT 4.86/5, costos de IA por org y tiempos de respuesta.',
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-pink-400" />,
                title: 'Seguridad Multi-Tenant',
                desc: 'Aislamiento estricto de base de datos por orgId, roles RBAC, TOTP MFA y auditoría inmutable.',
              },
            ].map((mod, i) => (
              <GlassPanel key={i} glow className="flex flex-col justify-between p-6 hover:border-[#00D4FF]/50 transition-all group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#0B0F19] border border-[#23304E] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {mod.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#E8EEF8] mb-2">{mod.title}</h3>
                  <p className="text-xs text-[#8B9BB8] leading-relaxed">{mod.desc}</p>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>

        {/* Competitive Benchmark Table */}
        <div className="w-full max-w-5xl mx-auto rounded-3xl p-6 sm:p-8 bg-[#131A2B]/80 border border-[#23304E] text-left mb-20">
          <h3 className="text-2xl font-black mb-6 text-center text-[#E8EEF8]">
            ¿Por qué BizBot AI v3 supera a las soluciones tradicionales?
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#23304E] text-[#8B9BB8]">
                  <th className="py-3 px-4 text-left">Capacidad</th>
                  <th className="py-3 px-4 text-center font-bold text-[#00D4FF]">BizBot AI v3</th>
                  <th className="py-3 px-4 text-center">Intercom / Tidio</th>
                  <th className="py-3 px-4 text-center">ChatGPT Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23304E]/50">
                {[
                  ['RAG Multi-tenant con citas reales', '✅ Full Nativo', '❌ No / Limitado', '⚠️ Parcial'],
                  ['Agenda + Sync Google/Outlook', '✅ Integrado', '❌ No', '❌ No'],
                  ['Generación de Docs + Firma Digital', '✅ Automático', '❌ No', '❌ Manual'],
                  ['Call Center + Whisper + Voz', '✅ Integrado', '⚠️ Básico', '❌ No'],
                  ['Model Router (Control de Costo IA)', '✅ Haiku/Sonnet/Opus', '❌ No', '❌ Fijo'],
                  ['Despliegue Self-Hosted / Docker', '✅ 100% Soportado', '❌ Solo SaaS', '❌ Solo API'],
                  ['Aislamiento de Datos por orgId', '✅ Cero Fuga', '⚠️ Limitado', '❌ No'],
                ].map(([cap, biz, oth, gpt], idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4 font-semibold text-[#E8EEF8]">{cap}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#00D4FF] bg-[#00D4FF]/5 rounded-lg">
                      {biz}
                    </td>
                    <td className="py-3.5 px-4 text-center text-[#8B9BB8]">{oth}</td>
                    <td className="py-3.5 px-4 text-center text-[#8B9BB8]">{gpt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Banner CTA */}
        <div className="w-full max-w-4xl p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#131A2B] via-[#1B243B] to-[#131A2B] border border-[#00D4FF]/40 shadow-[0_0_80px_rgba(0,212,255,0.2)] flex flex-col items-center text-center">
          <Award className="w-12 h-12 text-[#00D4FF] mb-4 animate-bounce" />
          <h3 className="text-3xl sm:text-4xl font-black text-[#E8EEF8] mb-3">
            Listo para Transformar la Atención de tu Empresa
          </h3>
          <p className="text-sm sm:text-base text-[#8B9BB8] max-w-xl mb-8">
            Únete a cientos de empresas que operan con un asistente de negocios 24/7 de máximo
            rendimiento y cero tiempo de inactividad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setCurrentModule('register')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Crear Cuenta Enterprise Ahora
            </Button>
            <Button
              variant="glass"
              size="lg"
              onClick={() => setCurrentModule('login')}
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
