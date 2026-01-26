import express from 'express';
import { login, verifyToken, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/verify - Protected route to verify token
router.get('/verify', protect, verifyToken);

// PUT /api/auth/profile - Update admin profile
router.put('/profile', protect, updateProfile);

export default router;
