import { Router } from 'express';
import { authController } from './auth.controller.js';
import { authRateLimiter } from '../../middleware/rateLimiter.js';
import { authenticateJWT } from '../../middleware/auth.js';

const router = Router();

router.post('/register', authRateLimiter, (req, res, next) => authController.register(req, res, next));
router.post('/login', authRateLimiter, (req, res, next) => authController.login(req, res, next));
router.post('/mfa/verify', authRateLimiter, (req, res, next) => authController.mfaVerify(req, res, next));
router.post('/refresh', authRateLimiter, (req, res, next) => authController.refresh(req, res, next));
router.post('/magic-link', authRateLimiter, (req, res, next) => authController.magicLink(req, res, next));
router.get('/me', authenticateJWT, (req, res, next) => authController.getMe(req, res, next));

export const authRoutes: Router = router;
