import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes.js';
import { chatRoutes } from '../modules/chat/chat.routes.js';
import { agendaRoutes } from '../modules/agenda/agenda.routes.js';
import { crmRoutes } from '../modules/crm/crm.routes.js';
import { documentRoutes } from '../modules/documents/documents.routes.js';
import { callCenterRoutes } from '../modules/call-center/callCenter.routes.js';
import { workflowRoutes } from '../modules/workflows/workflows.routes.js';
import { analyticsRoutes } from '../modules/analytics/analytics.routes.js';
import { billingRoutes } from '../modules/billing/billing.routes.js';
import { ragRoutes } from '../modules/rag/rag.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/ai', chatRoutes);
router.use('/agenda', agendaRoutes);
router.use('/crm', crmRoutes);
router.use('/documents', documentRoutes);
router.use('/call-center', callCenterRoutes);
router.use('/workflows', workflowRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/billing', billingRoutes);
router.use('/rag', ragRoutes);

export const apiV1Routes: Router = router;
