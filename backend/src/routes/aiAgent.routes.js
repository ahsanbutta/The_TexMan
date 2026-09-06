import express from 'express';
import {
  executeOrchestratorCommand,
  runSingleAgent,
  getControlCenterStats,
  getAITasks,
  getAIActivityLogs,
  getResearchInboxList,
  updateResearchItem,
  convertResearchItem,
  getApprovalsList,
  decideApproval,
  queryStudentSupport,
  handleN8nWebhook
} from '../controllers/aiAgent.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public / Student Grounded Search
router.post('/support/query', optionalAuth, queryStudentSupport);
router.get('/support/query', optionalAuth, (req, res, next) => {
  req.body = { query: req.query.q || '' };
  return queryStudentSupport(req, res, next);
});

// n8n Webhook Trigger (Protected by Secret Header)
router.post('/webhook/n8n', handleN8nWebhook);

// AI Control Center & Orchestrator Operations
router.get('/control-center/stats', optionalAuth, getControlCenterStats);
router.post('/orchestrator/command', optionalAuth, executeOrchestratorCommand);
router.post('/agents/:agentId/run', optionalAuth, runSingleAgent);
router.get('/tasks', optionalAuth, getAITasks);
router.get('/activity', optionalAuth, getAIActivityLogs);

// Research Inbox
router.get('/research-inbox', optionalAuth, getResearchInboxList);
router.put('/research-inbox/:id', optionalAuth, updateResearchItem);
router.post('/research-inbox/:id/convert', optionalAuth, convertResearchItem);

// AI Approval Queue
router.get('/approvals', optionalAuth, getApprovalsList);
router.post('/approvals/:id/decide', optionalAuth, decideApproval);

export default router;
