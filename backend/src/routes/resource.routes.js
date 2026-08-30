import express from 'express';
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  incrementDownload,
  requestResource,
  getResourceRequests
} from '../controllers/resource.controller.js';
import { authenticateUser, authorizeRoles, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', optionalAuth, getResources);
router.get('/requests', authenticateUser, authorizeRoles('admin'), getResourceRequests);
router.get('/:id', optionalAuth, getResourceById);
router.post('/', authenticateUser, authorizeRoles('admin', 'mentor'), createResource);
router.put('/:id', authenticateUser, authorizeRoles('admin', 'mentor'), updateResource);
router.delete('/:id', authenticateUser, authorizeRoles('admin'), deleteResource);
router.post('/:id/download', incrementDownload);
router.post('/requests', optionalAuth, requestResource);

export default router;
