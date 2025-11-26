import { Router } from 'express';
import * as authHandlers from './auth.handlers';
import { authenticate } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validation.middleware';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.validation';

const router = Router();

router.post('/register', validateRequest(registerSchema), authHandlers.register);
router.post('/login', validateRequest(loginSchema), authHandlers.login);
router.post('/refresh', validateRequest(refreshTokenSchema), authHandlers.refreshToken);
router.get('/profile', authenticate, authHandlers.getProfile);

export default router;
