import express from 'express';
import {
  submitQuery,
  getMyQueries,
  getAllQueries,
  replyToQuery,
  deleteCounselingQuery
} from '../controllers/counseling.controller.js';
import { authenticateUser, authorizeRoles, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/queries', optionalAuth, submitQuery);
router.post('/inquiries', optionalAuth, submitQuery);
router.post('/inquiry', optionalAuth, submitQuery);
router.post('/book', optionalAuth, submitQuery);
router.get('/my-queries', authenticateUser, getMyQueries);
router.get('/queries', authenticateUser, authorizeRoles('admin', 'mentor'), getAllQueries);
router.get('/inquiries', authenticateUser, authorizeRoles('admin', 'mentor'), getAllQueries);
router.put('/queries/:id/reply', authenticateUser, authorizeRoles('admin', 'mentor'), replyToQuery);
router.post('/queries/:id/reply', authenticateUser, authorizeRoles('admin', 'mentor'), replyToQuery);
router.post('/inquiries/:id/reply', authenticateUser, authorizeRoles('admin', 'mentor'), replyToQuery);
router.delete('/queries/:id', authenticateUser, authorizeRoles('admin'), deleteCounselingQuery);
router.delete('/inquiries/:id', authenticateUser, authorizeRoles('admin'), deleteCounselingQuery);

export default router;
