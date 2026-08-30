import express from 'express';
import {
  getMentors,
  getMentorById,
  updateMentorProfile,
  addMentorReview
} from '../controllers/mentor.controller.js';
import { authenticateUser, authorizeRoles, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', optionalAuth, getMentors);
router.get('/:id', optionalAuth, getMentorById);
router.post('/profile', authenticateUser, authorizeRoles('mentor', 'admin'), updateMentorProfile);
router.post('/:id/reviews', authenticateUser, addMentorReview);

export default router;
