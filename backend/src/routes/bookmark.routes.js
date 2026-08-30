import express from 'express';
import {
  toggleBookmark,
  getBookmarks,
  removeBookmark
} from '../controllers/bookmark.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/', toggleBookmark);
router.post('/toggle', toggleBookmark);
router.get('/', getBookmarks);
router.delete('/:id', removeBookmark);

export default router;
