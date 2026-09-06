import express from 'express';
import {
  askStudyTutor,
  getConversations,
  improveCvSummary,
  evaluateAnswer
} from '../controllers/ai.controller.js';
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
  handleN8nWebhook,
  handleWhatsAppWebhook,
  getTelemetryStatusController,
  getResearchSources,
  createResearchSource,
  updateResearchSource,
  deleteResearchSource,
  scanSingleSource,
  getAISettings,
  updateAISettings,
  getDailyReportsList,
  triggerAutonomousCycleNow,
  testExternalNotification,
  quickApproveOrRejectViaEmail
} from '../controllers/aiAgent.controller.js';
import { authenticateUser, optionalAuth } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// Existing Conversational & Career Endpoints
router.post('/study-tutor', aiLimiter, optionalAuth, askStudyTutor);
router.get('/conversations', authenticateUser, getConversations);
router.post('/cv/improve-summary', aiLimiter, optionalAuth, improveCvSummary);
router.post('/interview/evaluate', aiLimiter, optionalAuth, evaluateAnswer);

// Multi-Agent Grounded Student Search (Public / Authenticated)
router.post('/support/query', optionalAuth, queryStudentSupport);
router.get('/support/query', optionalAuth, (req, res, next) => {
  req.body = { query: req.query.q || '' };
  return queryStudentSupport(req, res, next);
});

// Autonomous Two-Way Webhooks (Meta WhatsApp API & n8n)
router.get('/webhook/whatsapp', handleWhatsAppWebhook);
router.post('/webhook/whatsapp', handleWhatsAppWebhook);
router.post('/webhook/n8n', handleN8nWebhook);

// Real Delivery Telemetry Verification Status
router.get('/telemetry/status', optionalAuth, getTelemetryStatusController);

// AI Control Center & Multi-Agent Operations
router.get('/control-center/stats', optionalAuth, getControlCenterStats);
router.post('/orchestrator/command', optionalAuth, executeOrchestratorCommand);
router.post('/agents/:agentId/run', optionalAuth, runSingleAgent);
router.get('/tasks', optionalAuth, getAITasks);
router.get('/activity', optionalAuth, getAIActivityLogs);

// Autonomous Scheduler & Trigger
router.post('/scheduler/trigger-now', optionalAuth, triggerAutonomousCycleNow);

// AI Autonomy Settings (/admin/ai/settings)
router.get('/settings', optionalAuth, getAISettings);
router.put('/settings', optionalAuth, updateAISettings);

// Daily AI Intelligence Reports
router.get('/reports', optionalAuth, getDailyReportsList);

// External Notifications Testing
router.post('/notifications/test', optionalAuth, testExternalNotification);

// Research Inbox
router.get('/research-inbox', optionalAuth, getResearchInboxList);
router.put('/research-inbox/:id', optionalAuth, updateResearchItem);
router.post('/research-inbox/:id/convert', optionalAuth, convertResearchItem);

// AI Approval Queue
router.get('/approvals', optionalAuth, getApprovalsList);
router.post('/approvals/:id/decide', optionalAuth, decideApproval);
router.get('/quick-action', quickApproveOrRejectViaEmail);

// Research Sources Management (/admin/ai/sources)
router.get('/sources', optionalAuth, getResearchSources);
router.post('/sources', optionalAuth, createResearchSource);
router.put('/sources/:id', optionalAuth, updateResearchSource);
router.delete('/sources/:id', optionalAuth, deleteResearchSource);
router.post('/sources/:id/scan', optionalAuth, scanSingleSource);

export default router;
