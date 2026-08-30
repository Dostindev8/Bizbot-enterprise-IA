import { Router } from 'express';
import { chatController } from './chat.controller.js';
import { generalRateLimiter } from '../../middleware/rateLimiter.js';
import { authenticateJWT, requireOrg } from '../../middleware/auth.js';

const router = Router();

// Public / Widget / Authenticated SSE Chat
router.post('/chat', generalRateLimiter, (req, res, next) => chatController.handleChatStream(req, res, next));

// Authenticated conversation management
router.get('/conversations', authenticateJWT, requireOrg, (req, res, next) =>
  chatController.getConversations(req, res, next)
);
router.get('/conversations/:conversationId/messages', authenticateJWT, requireOrg, (req, res, next) =>
  chatController.getMessages(req, res, next)
);
router.post('/feedback', generalRateLimiter, (req, res, next) => chatController.submitFeedback(req, res, next));

export const chatRoutes: Router = router;
