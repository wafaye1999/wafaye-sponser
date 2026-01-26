import express from 'express';
import { trackView, trackClick, getAnalytics, deleteAnalytics, deleteAllAnalytics, hasAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes - tracking
router.post('/view/:id', trackView);
router.post('/click/:id', trackClick);

// Protected routes
router.get('/check', protect, hasAnalytics); // Must be before /:id to avoid conflict
router.delete('/all', protect, deleteAllAnalytics); // Must be before /:id to avoid conflict
router.get('/:id', protect, getAnalytics);
router.delete('/:id', protect, deleteAnalytics);

export default router;
