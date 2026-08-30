import express from 'express';
import { register, login, logout, getMe, updateProfile, changePassword } from '../controllers/auth.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';
import { validateRequest, registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', authLimiter, validateRequest(registerSchema), register);
router.post('/login', authLimiter, validateRequest(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authenticateUser, getMe);
router.put('/profile', authenticateUser, updateProfile);
router.put('/change-password', authenticateUser, changePassword);

export default router;
