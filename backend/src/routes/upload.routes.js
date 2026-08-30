import express from 'express';
import { uploadSingleFile } from '../controllers/upload.controller.js';
import { upload } from '../middleware/upload.middleware.js';
import { authenticateUser, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/single', optionalAuth, upload.single('file'), uploadSingleFile);

export default router;
