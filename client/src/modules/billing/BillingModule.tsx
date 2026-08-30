import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { GlassPanel, Button } from '@bizbot/ui';
import { Check } from 'lucide-react';
import { PlanTier } from '@bizbot/shared-types';

export const BillingModule: React.FC = () => {
  const [selectedPlan] = useState<PlanTier>('pro');
  const [successMessage, setSuccessMessage] = useState('');

  const { data: plans } = useQuery({
    queryKey: ['billing-plans'],
    queryFn: () => api.getBillingPlans(),
  });

  const upgradeMutation = useMutation({
    mutationFn: (plan: PlanTier) => api.selectPlan(plan),
    onSuccess: (data) => {
      setSuccessMessage(data.message || 'Suscripción actualizada exitosamente');
    },
  });

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-black text-[#E8EEF8]">Planes de Suscripción SaaS</h1>
        <p className="text-xs sm:text-sm text-[#8B9BB8] mt-2">
          Elige el plan ideal para escalar la atención y automatización inteligente de tu negocio
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-[#39E58C] text-sm text-center font-bold">
          {successMessage}
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(plans || [
          {
            tier: 'starter' as const,
            name: 'Starter',
            priceMonthlyUsd: 49,
            maxConversations: 1000,
            features: [
              '1,000 conversaciones / mes',
              'Chatbot IA con RAG Básico',
              'Widget Web Embebible',
              'Agenda con Google Calendar',
              'Hasta 3 usuarios',
            ],
          },
          {
            tier: 'pro' as const,
            name: 'Pro',
            priceMonthlyUsd: 149,
            maxConversations: 10000,
            features: [
              '10,000 conversaciones / mes',
              'RAG Multi-tenant con Citas',
              'Integración WhatsApp Oficial',
              'CRM con Lead Scoring Inteligente',
              'Generador de Documentos y Firma Digital',
              'Hasta 10 usuarios',
            ],
          },
          {
            tier: 'business' as const,
            name: 'Business',
            priceMonthlyUsd: 499,
            maxConversations: 50000,
            features: [
              '50,000 conversaciones / mes',
              'Call Center Virtual con Whisper & Voz',
              'Workflow Engine Visual con Webhooks',
              'Model Router Claude 3.5 Sonnet/Opus',
              'Analytics Avanzado',
              'Usuarios ilimitados',
            ],
          },
          {
            tier: 'enterprise' as const,
            name: 'Enterprise',
            priceMonthlyUsd: 1200,
            maxConversations: 200000,
            features: [
              '200,000+ conversaciones / mes',
              'SLA 99.95% garantizado 24/7',
              'Infraestructura Dedicada / Self-Hosted',
              'Modelos Custom Fine-Tuned',
              'Compliance DGII/NCF y SOC2',
            ],
          },
        ]).map((plan) => {
          const isPro = plan.tier === 'pro';
          return (
            <GlassPanel
              key={plan.tier}
              glow={isPro}
              className={`flex flex-col justify-between p-6 relative ${
                isPro ? 'border-[#00D4FF] shadow-[0_0_50px_rgba(0,212,255,0.25)]' : ''
              }`}
            >
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#00D4FF] text-[#0B0F19] text-[10px] font-black uppercase tracking-wider">
                  Más Popular
                </div>
              )}

              <div>
                <h3 className="text-lg font-black text-[#E8EEF8] mb-1">{plan.name}</h3>
                <div className="my-4">
                  <span className="text-3xl font-black text-[#E8EEF8]">${plan.priceMonthlyUsd}</span>
                  <span className="text-xs text-[#8B9BB8]"> USD / mes</span>
                </div>

                <div className="space-y-2.5 my-6 text-xs text-[#8B9BB8]">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#00D4FF] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant={isPro ? 'primary' : 'glass'}
                size="md"
                onClick={() => upgradeMutation.mutate(plan.tier)}
                isLoading={upgradeMutation.isPending && selectedPlan === plan.tier}
                className="w-full"
              >
                Seleccionar Plan
              </Button>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
};
