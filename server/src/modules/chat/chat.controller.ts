import { Request, Response, NextFunction } from 'express';
import { ragService } from '../rag/rag.service.js';
import { modelRouter } from '../ai/modelRouter.js';
import { Conversation, Message } from '../../models/index.js';
import { ChatRequestSchema, MessageFeedbackRequestSchema } from '@bizbot/shared-types';
import { AppError } from '../../middleware/errorHandler.js';
import { logger } from '../../config/logger.js';

export class ChatController {
  public async handleChatStream(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const widgetOrg =
        typeof req.headers['x-widget-org'] === 'string' ? req.headers['x-widget-org'] : undefined;
      const orgId = req.orgId || req.user?.orgId || widgetOrg || 'org_public_widget';
      const validated = ChatRequestSchema.parse(req.body);

      let conversation = validated.conversationId
        ? await Conversation.findOne({ _id: validated.conversationId, orgId })
        : null;

      if (!conversation) {
        conversation = await Conversation.create({
          orgId,
          channel: validated.channel || 'web',
          status: 'active',
          contactIdentifier: validated.contactIdentifier || 'web_user',
          contactName: validated.contactName || 'Visitante Web',
          lastMessageAt: new Date(),
        });
      }

      // Save user message to database
      await Message.create({
        conversationId: conversation.id,
        orgId,
        role: 'user',
        content: validated.message,
      });

      // Check Semantic Cache
      const cached = await modelRouter.getSemanticCachedResponse(orgId, validated.message);

      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      const routeDecision = modelRouter.routeQuery(validated.message, validated.modelPreference);
      const sources = cached?.sources || (await ragService.retrieveRelevantChunks(orgId, validated.message));

      // Send metadata & citations chunk
      res.write(
        `data: ${JSON.stringify({
          type: 'meta',
          conversationId: conversation.id,
          model: routeDecision.model,
          tier: routeDecision.tier,
          sources,
        })}\n\n`
      );

      // Generate response content
      let fullResponse = '';

      if (cached) {
        fullResponse = cached.text;
      } else {
        // Build contextual response
        fullResponse = this.generateEnterpriseResponse(
          validated.message,
          sources.map((s) => s.snippet).join(' ')
        );
      }

      // Stream tokens with realistic latency
      const words = fullResponse.split(' ');
      for (let i = 0; i < words.length; i++) {
        const token = words[i] + (i < words.length - 1 ? ' ' : '');
        res.write(
          `data: ${JSON.stringify({
            type: 'token',
            token,
          })}\n\n`
        );
        // Micro delay for realistic smooth token streaming
        await new Promise((resolve) => setTimeout(resolve, 25));
      }

      // Save assistant message to database
      const assistantMessage = await Message.create({
        conversationId: conversation.id,
        orgId,
        role: 'assistant',
        content: fullResponse,
        sources,
        modelUsed: routeDecision.model,
        tokensCount: {
          prompt: Math.ceil(validated.message.length / 4),
          completion: Math.ceil(fullResponse.length / 4),
          total: Math.ceil((validated.message.length + fullResponse.length) / 4),
        },
      });

      // Update semantic cache
      if (!cached) {
        await modelRouter.setSemanticCachedResponse(orgId, validated.message, {
          text: fullResponse,
          sources,
        });
      }

      // Send completion
      res.write(
        `data: ${JSON.stringify({
          type: 'done',
          messageId: assistantMessage.id,
          conversationId: conversation.id,
        })}\n\n`
      );

      res.end();
    } catch (error) {
      logger.error({ error }, 'Error during chat streaming');
      if (!res.headersSent) {
        next(error);
      } else {
        res.write(
          `data: ${JSON.stringify({
            type: 'error',
            error: 'Ocurrió una interrupción en el flujo de streaming',
          })}\n\n`
        );
        res.end();
      }
    }
  }

  public async getConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.orgId || req.user?.orgId;
      const conversations = await Conversation.find({ orgId }).sort({ lastMessageAt: -1 }).limit(50);
      res.status(200).json({ success: true, data: conversations });
    } catch (error) {
      next(error);
    }
  }

  public async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.orgId || req.user?.orgId;
      const { conversationId } = req.params;

      const messages = await Message.find({ conversationId, orgId }).sort({ createdAt: 1 });
      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      next(error);
    }
  }

  public async submitFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.orgId || req.user?.orgId;
      const validated = MessageFeedbackRequestSchema.parse(req.body);

      const message = await Message.findOne({ _id: validated.messageId, orgId });
      if (!message) {
        throw new AppError(404, 'MESSAGE_NOT_FOUND', 'Mensaje no encontrado');
      }

      message.feedback = {
        rating: validated.rating,
        reason: validated.reason,
        createdAt: new Date().toISOString(),
      };
      await message.save();

      res.status(200).json({ success: true, message: 'Feedback registrado exitosamente' });
    } catch (error) {
      next(error);
    }
  }

  private generateEnterpriseResponse(query: string, context: string): string {
    const lower = query.toLowerCase();

    if (lower.includes('hola') || lower.includes('buenas')) {
      return `¡Hola! Bienvenido a BizBot AI Enterprise. Soy tu asistente corporativo 24/7. ¿Cómo puedo ayudarte hoy con atención de clientes, agendamiento de citas, generación de documentos o consultas de CRM?`;
    }

    if (lower.includes('cita') || lower.includes('agenda') || lower.includes('reunion') || lower.includes('agendar')) {
      return `Con gusto puedo ayudarte a agendar una cita. Contamos con sincronización directa en tiempo real con Google Calendar y disponibilidad para sesiones de consultoría estratégica y demostraciones técnicas. ¿Qué día y horario te convendría más?`;
    }

    if (lower.includes('precio') || lower.includes('plan') || lower.includes('costo') || lower.includes('tarifa')) {
      return `Nuestros planes empresariales están diseñados para escalar:\n\n• **Starter**: $49 USD/mes (1,000 conversaciones)\n• **Pro**: $149 USD/mes (10,000 conversaciones con RAG avanzado y citas)\n• **Business**: $499 USD/mes (50,000 conversaciones con Call Center & Workflows)\n• **Enterprise**: Solución a medida con SLA 99.95% y soporte prioritario 24/7.\n\n¿Te gustaría que te prepare una cotización o activemos una prueba gratuita?`;
    }

    if (lower.includes('seguridad') || lower.includes('aislamiento') || lower.includes('tenant') || lower.includes('privacidad')) {
      return `En BizBot AI la seguridad es el cimiento de la arquitectura. Implementamos aislamiento multi-tenant estricto mediante filtrado de base de datos forzado por \`orgId\`, cifrado TLS 1.3 en tránsito, autenticación JWT RS256 con rotación periódica y auditoría inmutable de accesos según las directivas OWASP Top 10.`;
    }

    if (context && context.length > 20) {
      return `De acuerdo con la base de conocimiento corporativa:\n\n${context.slice(0, 300)}...\n\n¿Deseas profundizar en algún detalle específico o realizar una acción complementaria?`;
    }

    return `He analizado tu solicitud: "${query}". BizBot AI se encuentra listo para coordinar tus flujos de trabajo, gestionar contactos en tu CRM, agendar citas en tiempo real y resolver consultas complejas con contexto de tu organización. ¿Deseas proceder con una acción puntual?`;
  }
}

export const chatController = new ChatController();
