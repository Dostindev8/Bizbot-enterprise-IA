import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { GlassPanel, Badge } from '@bizbot/ui';
import { PhoneCall, Mic, Headphones, Sparkles, CheckCircle2 } from 'lucide-react';

export const CallCenterModule: React.FC = () => {
  const { data: records } = useQuery({
    queryKey: ['call-records'],
    queryFn: () => api.getCallRecords(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#E8EEF8]">Call Center Virtual & Transcripción Whisper</h1>
          <p className="text-xs text-[#8B9BB8] mt-1">
            Distribución automática de llamadas (ACD), transcripción en tiempo real y análisis de QA por IA
          </p>
        </div>
        <Badge variant="cyan" dot>
          ACD Engine: 8 Agentes Conectados
        </Badge>
      </div>

      {/* Live Agent Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <GlassPanel glow className="p-4 flex items-center gap-3">
          <Headphones className="w-8 h-8 text-[#00D4FF]" />
          <div>
            <div className="text-xl font-bold text-[#E8EEF8]">5 Disponibles</div>
            <div className="text-[11px] text-[#8B9BB8]">Agentes en Línea</div>
          </div>
        </GlassPanel>

        <GlassPanel glow className="p-4 flex items-center gap-3">
          <PhoneCall className="w-8 h-8 text-purple-400" />
          <div>
            <div className="text-xl font-bold text-[#C4B5FD]">3 en Llamada</div>
            <div className="text-[11px] text-[#8B9BB8]">Atención en Curso</div>
          </div>
        </GlassPanel>

        <GlassPanel glow className="p-4 flex items-center gap-3">
          <Mic className="w-8 h-8 text-[#39E58C]" />
          <div>
            <div className="text-xl font-bold text-[#39E58C]">97.4%</div>
            <div className="text-[11px] text-[#8B9BB8]">Precisión Whisper</div>
          </div>
        </GlassPanel>

        <GlassPanel glow className="p-4 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          <div>
            <div className="text-xl font-bold text-[#FDE047]">96.5 / 100</div>
            <div className="text-[11px] text-[#8B9BB8]">Promedio QA Score</div>
          </div>
        </GlassPanel>
      </div>

      {/* Call Records Stream */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#E8EEF8]">Registro de Llamadas & Análisis Conversacional</h3>
        {(records || []).map((call) => (
          <GlassPanel key={call.id} glow className="p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#23304E]">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-sm text-[#00D4FF]">{call.callerNumber}</span>
                <Badge variant={call.status === 'completed' ? 'success' : 'cyan'}>
                  {call.agentName}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-[#8B9BB8]">Duración: {call.durationSeconds}s</span>
                <span className="font-bold text-[#39E58C]">QA: {call.qaScore}/100</span>
              </div>
            </div>

            <div className="text-xs text-[#E8EEF8] bg-[#0B0F19] p-3.5 rounded-xl border border-[#23304E] leading-relaxed">
              <strong className="text-[#00D4FF] block mb-1">Transcripción Whisper AI:</strong>
              "{call.transcriptionText}"
            </div>

            {call.summary && (
              <div className="text-[11px] text-[#8B9BB8] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#39E58C]" />
                <span>Resumen Ejecutivo: {call.summary}</span>
              </div>
            )}
          </GlassPanel>
        ))}
      </div>
    </div>
  );
};
