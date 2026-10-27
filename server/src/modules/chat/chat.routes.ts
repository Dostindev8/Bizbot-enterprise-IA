import { Router } from 'express';
import { chatController } from './chat.controller.js';
import { widgetRateLimiter } from '../../middleware/rateLimiter.js';
import { authenticateJWT, optionalJWT, requireOrg } from '../../middleware/auth.js';

const router = Router();

router.post('/chat', widgetRateLimiter, optionalJWT, (req, res, next) =>
  chatController.handleChatStream(req, res, next)
);

router.get('/conversations', authenticateJWT, requireOrg, (req, res, next) =>
  chatController.getConversations(req, res, next)
);
router.get('/conversations/:conversationId/messages', authenticateJWT, requireOrg, (req, res, next) =>
  chatController.getMessages(req, res, next)
);
router.post('/feedback', authenticateJWT, requireOrg, (req, res, next) =>
  chatController.submitFeedback(req, res, next)
);

export const chatRoutes: Router = router;
