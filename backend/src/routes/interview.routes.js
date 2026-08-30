import express from 'express';
import {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviewHistory,
  getInterviewSession,
  deleteInterviewSession,
  getInterviewToken
} from '../controllers/interview.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = express.Router();

// Require authentication for all interview interactions
router.use(authenticateUser);

// 1. Session Setup & Start
router.post('/start', startInterview);

// 2. Ephemeral Token / Session Handshake
router.post('/token', getInterviewToken);

// 3. Candidate Turn / Message & Adaptive Questioning
router.post('/:sessionId/message', submitAnswer);
router.post('/:id/answer', submitAnswer); // Legacy compatibility

// 4. Session Finalization & Scorecard Generation
router.post('/:sessionId/complete', completeInterview);
router.post('/:id/complete', completeInterview); // Legacy compatibility
router.post('/:sessionId/evaluate', completeInterview);

// 5. History & Session Details
router.get('/history', getInterviewHistory);
router.get('/', getInterviewHistory); // Legacy compatibility
router.get('/:sessionId', getInterviewSession);

// 6. Delete Session
router.delete('/:sessionId', deleteInterviewSession);

export default router;
