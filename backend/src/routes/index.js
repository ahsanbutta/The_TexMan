import express from 'express';
import authRoutes from './auth.routes.js';
import jobRoutes from './job.routes.js';
import resourceRoutes from './resource.routes.js';
import announcementRoutes from './announcement.routes.js';
import counselingRoutes from './counseling.routes.js';
import mentorRoutes from './mentor.routes.js';
import aiRoutes from './ai.routes.js';
import cvRoutes from './cv.routes.js';
import interviewRoutes from './interview.routes.js';
import communityRoutes from './community.routes.js';
import bookmarkRoutes from './bookmark.routes.js';
import notificationRoutes from './notification.routes.js';
import adminRoutes from './admin.routes.js';
import searchRoutes from './search.routes.js';
import uploadRoutes from './upload.routes.js';
import healthRoutes from './health.routes.js';

const router = express.Router();

// Mount all modular routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/resources', resourceRoutes);
router.use('/announcements', announcementRoutes);
router.use('/counseling', counselingRoutes);
router.use('/mentors', mentorRoutes);
router.use('/ai', aiRoutes);
router.use('/cv', cvRoutes);
router.use('/interviews', interviewRoutes);
router.use('/community', communityRoutes);
router.use('/bookmarks', bookmarkRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/search', searchRoutes);
router.use('/uploads', uploadRoutes);

export default router;
