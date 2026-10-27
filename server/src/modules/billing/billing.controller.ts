import { Request, Response, NextFunction } from 'express';
import { SubscriptionPlanDetails, CreateCheckoutSessionRequestSchema } from '@bizbot/shared-types';
import { Subscription, Organization, AuditLog } from '../../models/index.js';
import { AppError } from '../../middleware/errorHandler.js';
import { usdToCents, previewHash, assertPreviewHash, formatUsdFromCents } from '../../lib/money.js';

type CatalogPlan = SubscriptionPlanDetails;

export class BillingController {
  private plans: CatalogPlan[] = [
    {
      tier: 'starter',
      name: 'Starter',
      priceMonthlyUsd: 49,
      priceMonthlyCents: usdToCents(49),
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
      tier: 'pro',
      name: 'Pro',
      priceMonthlyUsd: 149,
      priceMonthlyCents: usdToCents(149),
      maxConversations: 10000,
      features: [
        '10,000 conversaciones / mes',
        'RAG Multi-tenant con Citas de Fuente',
        'Integración WhatsApp Oficial',
        'CRM con Lead Scoring Inteligente',
        'Generador de Documentos y Firma Digital',
        'Hasta 10 usuarios',
      ],
    },
    {
      tier: 'business',
      name: 'Business',
      priceMonthlyUsd: 499,
      priceMonthlyCents: usdToCents(499),
      maxConversations: 50000,
      features: [
        '50,000 conversaciones / mes',
        'Call Center Virtual con Whisper & Voz',
        'Workflow Engine Visual con Webhooks',
        'Model Router con Claude 3.5 Sonnet & Opus',
        'Analytics Avanzado y Reportes Exportables',
        'Usuarios ilimitados',
      ],
    },
    {
      tier: 'enterprise',
      name: 'Enterprise',
      priceMonthlyUsd: 1200,
      priceMonthlyCents: usdToCents(1200),
      maxConversations: 200000,
      features: [
        '200,000+ conversaciones / mes',
        'SLA 99.95% garantizado con soporte 24/7',
        'Infraestructura Dedicada / Self-Hosted',
        'Modelos Custom Fine-Tuned',
        'Compliance DGII/NCF y Auditoría SOC2',
      ],
    },
  ];

  public async getPlans(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({ success: true, data: this.plans });
    } catch (error) {
      next(error);
    }
  }

  public async createCheckoutSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.orgId || req.user?.orgId;
      if (!orgId) throw new AppError(400, 'ORG_REQUIRED', 'Organización requerida');

      const validated = CreateCheckoutSessionRequestSchema.pick({ plan: true, previewHash: true }).parse(
        req.body
      );
      const selectedPlan = this.plans.find((p) => p.tier === validated.plan);
      if (!selectedPlan) {
        throw new AppError(400, 'INVALID_PLAN', 'Plan seleccionado no válido');
      }

      const expectedHash = previewHash({
        orgId,
        plan: selectedPlan.tier,
        amountCents: selectedPlan.priceMonthlyCents,
      });

      if (validated.previewHash && !assertPreviewHash(expectedHash, validated.previewHash)) {
        throw new AppError(409, 'PREVIEW_HASH_MISMATCH', 'El precio o el plan cambió. Recalcula el checkout.');
      }

      await Subscription.findOneAndUpdate(
        { orgId },
        { plan: validated.plan, status: 'active', updatedAt: new Date() },
        { upsert: true }
      );

      await Organization.findByIdAndUpdate(orgId, { plan: validated.plan });

      await AuditLog.create({
        orgId,
        actorId: req.user?.id || 'system',
        actorEmail: req.user?.email || 'system@bizbot.local',
        action: 'billing:subscription_changed',
        resourceRef: `plan_${selectedPlan.tier}`,
        metadata: {
          amountCents: selectedPlan.priceMonthlyCents,
          previewHash: expectedHash,
          correlationId: req.correlationId,
        },
      });

      res.status(200).json({
        success: true,
        data: {
          checkoutUrl: `https://checkout.stripe.com/pay/cs_test_mock_${Date.now()}`,
          plan: selectedPlan,
          amountCents: selectedPlan.priceMonthlyCents,
          amountLabel: formatUsdFromCents(selectedPlan.priceMonthlyCents),
          previewHash: expectedHash,
          message: `Plan ${selectedPlan.name} activado (${formatUsdFromCents(selectedPlan.priceMonthlyCents)}/mes). Stripe live 🔒.`,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const billingController = new BillingController();
