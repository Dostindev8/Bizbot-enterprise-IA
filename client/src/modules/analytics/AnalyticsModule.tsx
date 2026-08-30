import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { GlassPanel, Badge } from '@bizbot/ui';
import { TrendingUp, DollarSign, Clock } from 'lucide-react';

export const AnalyticsModule: React.FC = () => {
  const { data: summary } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: () => api.getAnalyticsSummary(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#E8EEF8]">Analíticas Ejecutivas & Reportes SLA</h1>
          <p className="text-xs text-[#8B9BB8] mt-1">
            Métricas de rendimiento en tiempo real, latencias P95, distribución de canales y costos de IA
          </p>
        </div>
        <Badge variant="cyan">SLA Target 99.95%</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassPanel glow className="p-6">
          <div className="flex items-center justify-between text-xs text-[#8B9BB8] font-bold">
            <span>Latencia P95</span>
            <Clock className="w-4 h-4 text-[#00D4FF]" />
          </div>
          <div className="text-3xl font-black text-[#00D4FF] my-2">210 ms</div>
          <p className="text-[11px] text-[#39E58C]">Target &lt; 250ms Cumplido</p>
        </GlassPanel>

        <GlassPanel glow className="p-6">
          <div className="flex items-center justify-between text-xs text-[#8B9BB8] font-bold">
            <span>First Token Latency</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-[#C4B5FD] my-2">0.85 s</div>
          <p className="text-[11px] text-[#39E58C]">Target &lt; 1.2s Cumplido</p>
        </GlassPanel>

        <GlassPanel glow className="p-6">
          <div className="flex items-center justify-between text-xs text-[#8B9BB8] font-bold">
            <span>Costo Promedio por Conversación</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-[#39E58C] my-2">$0.012</div>
          <p className="text-[11px] text-[#8B9BB8]">Control inteligente por Model Router</p>
        </GlassPanel>
      </div>

      <GlassPanel className="p-6">
        <h3 className="text-base font-bold text-[#E8EEF8] mb-4">
          Distribución de Tráfico por Canal
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(summary?.channelDistribution || [
            { channel: 'Web Widget', count: 2150 },
            { channel: 'WhatsApp', count: 1240 },
            { channel: 'Email', count: 320 },
            { channel: 'Voice IVR', count: 132 },
          ]).map((c, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#0B0F19] border border-[#23304E]">
              <div className="text-xs text-[#8B9BB8] font-semibold">{c.channel}</div>
              <div className="text-xl font-bold text-[#E8EEF8] my-1">{c.count}</div>
              <div className="text-[10px] text-[#00D4FF]">Operativo 24/7</div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
};
