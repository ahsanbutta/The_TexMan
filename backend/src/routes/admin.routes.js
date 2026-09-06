import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  createAdminUser,
  updateUserRole,
  deleteUser,
  getReports,
  resolveReport
} from '../controllers/admin.controller.js';
import {
  approveResource,
  rejectResource
} from '../controllers/resource.controller.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateUser);
router.use(authorizeRoles('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.post('/users', createAdminUser);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id', updateUserRole);
router.patch('/users/:id/status', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/reports', getReports);
router.put('/reports/:id', resolveReport);

// Admin Resource Approval and Rejection Workflows
router.post('/resources/:id/approve', approveResource);
router.post('/resources/:id/reject', rejectResource);

export default router;
