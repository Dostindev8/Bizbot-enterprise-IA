import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { GlassPanel, Button, Badge } from '@bizbot/ui';
import { Plus, ArrowRight } from 'lucide-react';

export const WorkflowsModule: React.FC = () => {
  useQuery({
    queryKey: ['workflows'],
    queryFn: () => api.getWorkflows(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#E8EEF8]">Workflow Engine Visual</h1>
          <p className="text-xs text-[#8B9BB8] mt-1">
            Automatizaciones conectadas a triggers, condiciones lógicas, acciones de IA y webhooks salientes
          </p>
        </div>
        <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
          Nuevo Flujo Visual
        </Button>
      </div>

      {/* Visual Workflow Diagram Card */}
      <GlassPanel glow className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#E8EEF8]">
              Flujo: Onboarding & Cualificación de Prospectos WhatsApp
            </h3>
            <p className="text-xs text-[#8B9BB8] mt-0.5">Ejecutado 1,420 veces • Tasa de éxito 99.8%</p>
          </div>
          <Badge variant="success" dot>
            Flujo Activo
          </Badge>
        </div>

        {/* Visual Nodes Chain */}
        <div className="flex flex-col md:flex-row items-center gap-3 overflow-x-auto py-4">
          <div className="p-4 rounded-2xl bg-[#0B0F19] border border-[#00D4FF]/40 text-left min-w-[200px] shadow-[0_0_20px_rgba(0,212,255,0.15)]">
            <Badge variant="cyan" className="mb-2">
              Trigger
            </Badge>
            <div className="text-xs font-bold text-[#E8EEF8]">Mensaje WhatsApp</div>
            <div className="text-[10px] text-[#8B9BB8]">Webhook Inbound Twilio</div>
          </div>

          <ArrowRight className="w-5 h-5 text-[#00D4FF] shrink-0 rotate-90 md:rotate-0" />

          <div className="p-4 rounded-2xl bg-[#0B0F19] border border-purple-500/40 text-left min-w-[200px] shadow-[0_0_20px_rgba(124,58,237,0.15)]">
            <Badge variant="purple" className="mb-2">
              Acción IA
            </Badge>
            <div className="text-xs font-bold text-[#E8EEF8]">Clasificación RAG</div>
            <div className="text-[10px] text-[#8B9BB8]">Claude 3.5 Model Router</div>
          </div>

          <ArrowRight className="w-5 h-5 text-[#00D4FF] shrink-0 rotate-90 md:rotate-0" />

          <div className="p-4 rounded-2xl bg-[#0B0F19] border border-amber-500/40 text-left min-w-[200px]">
            <Badge variant="warning" className="mb-2">
              Condición
            </Badge>
            <div className="text-xs font-bold text-[#E8EEF8]">Lead Score &gt; 70</div>
            <div className="text-[10px] text-[#8B9BB8]">Si es prospecto calificado</div>
          </div>

          <ArrowRight className="w-5 h-5 text-[#00D4FF] shrink-0 rotate-90 md:rotate-0" />

          <div className="p-4 rounded-2xl bg-[#0B0F19] border border-emerald-500/40 text-left min-w-[200px] shadow-[0_0_20px_rgba(57,229,140,0.15)]">
            <Badge variant="success" className="mb-2">
              Acción
            </Badge>
            <div className="text-xs font-bold text-[#E8EEF8]">Agendar Cita Google Cal</div>
            <div className="text-[10px] text-[#8B9BB8]">Notificar por WhatsApp</div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};
