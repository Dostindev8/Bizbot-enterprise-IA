import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { GlassPanel, Button, Badge } from '@bizbot/ui';
import { Calendar as CalendarIcon, Plus, User, Mail, Phone } from 'lucide-react';

export const AgendaModule: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: 'Demostración Técnica BizBot Enterprise',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    startTime: '2026-08-30T15:00:00.000Z',
    durationMinutes: 30,
    notes: 'Reunión coordinada por asistente de inteligencia artificial.',
  });

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => api.getAppointments(),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => api.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setIsModalOpen(false);
      setFormData({
        serviceName: 'Demostración Técnica BizBot Enterprise',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        startTime: '2026-08-30T15:00:00.000Z',
        durationMinutes: 30,
        notes: '',
      });
    },
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#E8EEF8]">Agenda Inteligente & Google Calendar</h1>
          <p className="text-xs text-[#8B9BB8] mt-1">
            Sincronización bidireccional en tiempo real con Google Calendar y agendamiento por IA
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Agendar Nueva Cita
        </Button>
      </div>

      {/* Appointment Slots & Calendar View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-bold text-[#E8EEF8] flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-400" />
            Citas Confirmadas en el Sistema
          </h3>

          {isLoading ? (
            <div className="p-8 text-center text-xs text-[#8B9BB8]">Cargando citas del calendario...</div>
          ) : (appointments || []).length === 0 ? (
            <GlassPanel className="p-8 text-center text-xs text-[#8B9BB8]">
              No hay citas agendadas aún. Las citas agendadas por el Chatbot de IA aparecerán aquí automáticamente.
            </GlassPanel>
          ) : (
            (appointments || []).map((apt) => (
              <GlassPanel key={apt.id} glow className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#E8EEF8]">{apt.serviceName}</span>
                    <Badge variant="success" dot>
                      {apt.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#8B9BB8]">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#00D4FF]" />
                      {apt.clientName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-purple-400" />
                      {apt.clientEmail}
                    </span>
                    {apt.clientPhone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        {apt.clientPhone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-[#00D4FF]">
                    {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-[11px] text-[#8B9BB8]">
                    {new Date(apt.startTime).toLocaleDateString()}
                  </div>
                </div>
              </GlassPanel>
            ))
          )}
        </div>

        {/* Integration Status Panel */}
        <div className="space-y-4">
          <GlassPanel className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#E8EEF8]">Integración de Calendarios</h3>
            <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#23304E] space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-[#E8EEF8]">Google Calendar API</span>
                <Badge variant="success" dot>
                  Conectado
                </Badge>
              </div>
              <p className="text-[11px] text-[#8B9BB8]">
                OAuth2 y webhooks activos para sincronización instantánea de eventos.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#23304E] space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-[#E8EEF8]">Microsoft Outlook / Teams</span>
                <Badge variant="cyan" dot>
                  Listo
                </Badge>
              </div>
              <p className="text-[11px] text-[#8B9BB8]">
                Generación automática de enlaces de reunión por Teams.
              </p>
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#131A2B] border border-[#00D4FF]/40 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#E8EEF8]">Agendar Cita en Calendario</h3>

            <div className="space-y-3 text-xs text-left">
              <div>
                <label className="text-[#8B9BB8] font-semibold block mb-1">Servicio</label>
                <input
                  type="text"
                  value={formData.serviceName}
                  onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#0B0F19] border border-[#23304E] text-[#E8EEF8]"
                />
              </div>

              <div>
                <label className="text-[#8B9BB8] font-semibold block mb-1">Nombre del Cliente</label>
                <input
                  type="text"
                  placeholder="Ej. Roberto Martínez"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#0B0F19] border border-[#23304E] text-[#E8EEF8]"
                />
              </div>

              <div>
                <label className="text-[#8B9BB8] font-semibold block mb-1">Email del Cliente</label>
                <input
                  type="email"
                  placeholder="cliente@empresa.com"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#0B0F19] border border-[#23304E] text-[#E8EEF8]"
                />
              </div>

              <div>
                <label className="text-[#8B9BB8] font-semibold block mb-1">Teléfono (WhatsApp)</label>
                <input
                  type="text"
                  placeholder="+1 (809) 555-0199"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#0B0F19] border border-[#23304E] text-[#E8EEF8]"
                />
              </div>

              <div>
                <label className="text-[#8B9BB8] font-semibold block mb-1">Fecha y Hora</label>
                <input
                  type="datetime-local"
                  value={formData.startTime.slice(0, 16)}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: new Date(e.target.value).toISOString() })
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
                onClick={() => createMutation.mutate(formData)}
                isLoading={createMutation.isPending}
                disabled={!formData.clientName || !formData.clientEmail}
              >
                Confirmar Cita
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
