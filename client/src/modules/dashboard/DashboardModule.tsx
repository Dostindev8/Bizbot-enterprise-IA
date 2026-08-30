import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { useAppStore, NavModule } from '../../lib/store.js';
import { GlassPanel, Badge, Button } from '@bizbot/ui';
import {
  MessageSquare,
  DollarSign,
  TrendingUp,
  Bot,
  Sparkles,
  Calendar,
  FileCheck,
  PhoneCall,
  Users,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';

export const DashboardModule: React.FC = () => {
  const { setCurrentModule, user } = useAppStore();
  const { data: summary } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: () => api.getAnalyticsSummary(),
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#131A2B] via-[#1B243B] to-[#131A2B] border border-[#00D4FF]/30 shadow-[0_0_40px_rgba(0,212,255,0.12)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="cyan">Consola Operacional</Badge>
            <span className="text-xs text-[#39E58C] font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#39E58C] animate-pulse" />
              SLA 99.98% Activo
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#E8EEF8]">
            ¡Hola, {user?.name || 'Administrador'}!
          </h1>
          <p className="text-xs sm:text-sm text-[#8B9BB8] mt-1">
            BizBot AI ha resuelto el <strong className="text-[#00D4FF]">78.6%</strong> de las
            consultas este mes de forma autónoma con RAG y citas de fuente.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setCurrentModule('chat')}
            leftIcon={<Bot className="w-4 h-4" />}
          >
            Abrir Chat IA
          </Button>
          <Button
            variant="glass"
            size="md"
            onClick={() => setCurrentModule('agenda')}
            leftIcon={<Calendar className="w-4 h-4 text-emerald-400" />}
          >
            Ver Agenda
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassPanel glow className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8B9BB8] text-xs font-semibold">
            <span>Conversaciones Totales</span>
            <MessageSquare className="w-4 h-4 text-[#00D4FF]" />
          </div>
          <div className="my-3">
            <span className="text-3xl font-black text-[#E8EEF8]">
              {summary?.totalConversations || 3842}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#39E58C] font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs mes anterior</span>
          </div>
        </GlassPanel>

        <GlassPanel glow className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8B9BB8] text-xs font-semibold">
            <span>Tasa de Auto-Resolución</span>
            <CheckCircle2 className="w-4 h-4 text-[#39E58C]" />
          </div>
          <div className="my-3">
            <span className="text-3xl font-black text-[#39E58C]">
              {summary?.autoResolvedRate || 78.6}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#39E58C] font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Target ≥ 70% Superado</span>
          </div>
        </GlassPanel>

        <GlassPanel glow className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8B9BB8] text-xs font-semibold">
            <span>Satisfacción (CSAT)</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="my-3">
            <span className="text-3xl font-black text-[#E8EEF8]">
              {summary?.csatScore || 4.86} <span className="text-sm text-[#8B9BB8]">/ 5</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-yellow-400 font-medium">
            <span>⭐ Calificación Excelente</span>
          </div>
        </GlassPanel>

        <GlassPanel glow className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8B9BB8] text-xs font-semibold">
            <span>Costo IA del Mes (Router)</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-3">
            <span className="text-3xl font-black text-[#C4B5FD]">
              ${summary?.aiCostThisMonth || 46.2}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#39E58C] font-medium">
            <span>~$0.012 / conv (Haiku/Sonnet)</span>
          </div>
        </GlassPanel>
      </div>

      {/* Two Columns: Volume Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Volume & Topics */}
        <div className="lg:col-span-2 space-y-6">
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#E8EEF8]">
                Volumen de Consultas por Hora (Pico Operacional)
              </h3>
              <Badge variant="cyan">Tiempo Real</Badge>
            </div>
            <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-[#23304E]">
              {(summary?.hourlyVolume || [
                { hour: '08:00', count: 120 },
                { hour: '10:00', count: 480 },
                { hour: '12:00', count: 390 },
                { hour: '14:00', count: 620 },
                { hour: '16:00', count: 540 },
                { hour: '18:00', count: 310 },
                { hour: '20:00', count: 180 },
              ]).map((point, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div
                    className="w-full max-w-[36px] bg-gradient-to-t from-[#7C3AED] to-[#00D4FF] rounded-t-lg transition-all duration-500 hover:brightness-125 relative group"
                    style={{ height: `${(point.count / 650) * 100}%` }}
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0B0F19] border border-[#00D4FF] text-[10px] text-[#00D4FF] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {point.count}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8B9BB8]">{point.hour}</span>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-6">
            <h3 className="text-base font-bold text-[#E8EEF8] mb-4">
              Distribución por Temas Más Consultados
            </h3>
            <div className="space-y-3">
              {(summary?.topTopics || [
                { topic: 'Agendamiento y Citas', count: 1420, resolvedPercent: 92 },
                { topic: 'Precios y Planes SaaS', count: 1105, resolvedPercent: 88 },
                { topic: 'Soporte Técnico RAG', count: 740, resolvedPercent: 81 },
                { topic: 'Facturación / Pagos', count: 577, resolvedPercent: 96 },
              ]).map((t, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#E8EEF8]">{t.topic}</span>
                    <span className="text-[#00D4FF] font-mono">
                      {t.count} ({t.resolvedPercent}% auto-resuelto)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#0B0F19] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00D4FF] to-[#39E58C] rounded-full"
                      style={{ width: `${t.resolvedPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Quick Operational Shortcuts */}
        <div className="space-y-4">
          <GlassPanel className="p-5">
            <h3 className="text-sm font-bold text-[#E8EEF8] mb-3">Módulos Rápidos</h3>
            <div className="space-y-2">
              {[
                { label: 'Nuevo Contacto CRM', mod: 'crm' as NavModule, icon: <Users className="w-4 h-4 text-purple-400" /> },
                { label: 'Agendar Cita en Calendario', mod: 'agenda' as NavModule, icon: <Calendar className="w-4 h-4 text-emerald-400" /> },
                { label: 'Generar Contrato PDF', mod: 'documents' as NavModule, icon: <FileCheck className="w-4 h-4 text-amber-400" /> },
                { label: 'Monitoreo Call Center', mod: 'call-center' as NavModule, icon: <PhoneCall className="w-4 h-4 text-cyan-400" /> },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentModule(item.mod)}
                  className="w-full p-3 rounded-xl bg-[#0B0F19] hover:bg-[#1B243B] border border-[#23304E] flex items-center justify-between text-xs font-semibold text-[#E8EEF8] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#8B9BB8] group-hover:text-[#00D4FF] transition-colors" />
                </button>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-5">
            <h3 className="text-sm font-bold text-[#E8EEF8] mb-3">Canales Activos</h3>
            <div className="space-y-2.5 text-xs">
              {[
                { name: 'Web Widget 24/7', count: '2,150 chats', status: 'Online' },
                { name: 'WhatsApp Business API', count: '1,240 mensajes', status: 'Conectado' },
                { name: 'Email Omnicanal', count: '320 tickets', status: 'Sync Activo' },
                { name: 'Voice IVR Whisper', count: '132 llamadas', status: 'Operativo' },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#0B0F19]">
                  <div>
                    <div className="font-semibold text-[#E8EEF8]">{c.name}</div>
                    <div className="text-[11px] text-[#8B9BB8]">{c.count}</div>
                  </div>
                  <Badge variant="success" dot>
                    {c.status}
                  </Badge>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
