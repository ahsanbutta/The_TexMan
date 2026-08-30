import express from 'express';
import {
  askStudyTutor,
  getConversations,
  improveCvSummary,
  evaluateAnswer
} from '../controllers/ai.controller.js';
import { authenticateUser, optionalAuth } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

router.post('/study-tutor', aiLimiter, optionalAuth, askStudyTutor);
router.get('/conversations', authenticateUser, getConversations);
router.post('/cv/improve-summary', aiLimiter, optionalAuth, improveCvSummary);
router.post('/interview/evaluate', aiLimiter, optionalAuth, evaluateAnswer);

export default router;
