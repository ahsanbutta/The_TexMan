import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getReports,
  resolveReport
} from '../controllers/admin.controller.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateUser);
router.use(authorizeRoles('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/reports', getReports);
router.put('/reports/:id', resolveReport);

export default router;
