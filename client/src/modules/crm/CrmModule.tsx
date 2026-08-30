import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { GlassPanel, Button } from '@bizbot/ui';
import { Plus, DollarSign, Building2, Flame } from 'lucide-react';
import { PipelineStage } from '@bizbot/shared-types';

const STAGES: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'lead', label: 'Nuevos Prospectos', color: 'border-blue-500/40' },
  { id: 'contacted', label: 'Contactados', color: 'border-cyan-500/40' },
  { id: 'qualified', label: 'Calificados por IA', color: 'border-purple-500/40' },
  { id: 'proposal_sent', label: 'Propuesta Enviada', color: 'border-amber-500/40' },
  { id: 'won', label: 'Ganados / Cerrados', color: 'border-emerald-500/40' },
];

export const CrmModule: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    estimatedValue: 500,
    pipelineStage: 'lead' as PipelineStage,
  });

  const { data: contacts } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => api.getContacts(),
  });

  const createContactMutation = useMutation({
    mutationFn: (data: typeof newContact) => api.createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setIsModalOpen(false);
      setNewContact({
        name: '',
        email: '',
        phone: '',
        company: '',
        estimatedValue: 500,
        pipelineStage: 'lead',
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#E8EEF8]">CRM & Lead Scoring Inteligente</h1>
          <p className="text-xs text-[#8B9BB8] mt-1">
            Captura autónoma de prospectos desde conversaciones de chat y calificación de 0 a 100
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Nuevo Prospecto
        </Button>
      </div>

      {/* Kanban Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageContacts = (contacts || []).filter((c) => c.pipelineStage === stage.id);
          return (
            <div
              key={stage.id}
              className={`rounded-2xl bg-[#0E1424] border ${stage.color} p-3 min-h-[500px] flex flex-col`}
            >
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#23304E]">
                <h4 className="text-xs font-bold text-[#E8EEF8]">{stage.label}</h4>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#131A2B] text-[#00D4FF]">
                  {stageContacts.length}
                </span>
              </div>

              <div className="flex-1 space-y-3">
                {stageContacts.map((c) => (
                  <GlassPanel key={c.id} className="p-3.5 space-y-2 hover:border-[#00D4FF]/40 cursor-pointer">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-xs text-[#E8EEF8]">{c.name}</div>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                          c.leadScore >= 75
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : c.leadScore >= 50
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        <Flame className="w-2.5 h-2.5" />
                        {c.leadScore}
                      </span>
                    </div>

                    {c.company && (
                      <div className="text-[11px] text-[#8B9BB8] flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {c.company}
                      </div>
                    )}

                    <div className="text-[11px] text-[#39E58C] font-mono font-semibold flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />${c.estimatedValue} USD
                    </div>
                  </GlassPanel>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#131A2B] border border-[#00D4FF]/40 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#E8EEF8]">Registrar Prospecto CRM</h3>
            <div className="space-y-3 text-xs text-left">
              <div>
                <label className="text-[#8B9BB8] font-semibold block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  placeholder="Ej. Laura Morales"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#0B0F19] border border-[#23304E] text-[#E8EEF8]"
                />
              </div>

              <div>
                <label className="text-[#8B9BB8] font-semibold block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="laura@empresa.com"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#0B0F19] border border-[#23304E] text-[#E8EEF8]"
                />
              </div>

              <div>
                <label className="text-[#8B9BB8] font-semibold block mb-1">Empresa</label>
                <input
                  type="text"
                  placeholder="Ej. Inversiones del Caribe"
                  value={newContact.company}
                  onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#0B0F19] border border-[#23304E] text-[#E8EEF8]"
                />
              </div>

              <div>
                <label className="text-[#8B9BB8] font-semibold block mb-1">Valor Estimado ($ USD)</label>
                <input
                  type="number"
                  value={newContact.estimatedValue}
                  onChange={(e) =>
                    setNewContact({ ...newContact, estimatedValue: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full h-10 px-3 rounded-xl bg-[#0B0F19] border border-[#23304E] text-[#E8EEF8]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => createContactMutation.mutate(newContact)}
                isLoading={createContactMutation.isPending}
                disabled={!newContact.name}
              >
                Guardar Contacto
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
