import express from 'express';
import {
    getAllLinktrees,
    getLinktreeById,
    createLinktree,
    updateLinktree,
    deleteLinktree
} from '../controllers/linktreeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - get linktree by ID (uid)
router.get('/public/:id', getLinktreeById);

// Protected routes
router.get('/', protect, getAllLinktrees);
router.post('/', protect, createLinktree);
router.put('/:id', protect, updateLinktree);
router.delete('/:id', protect, deleteLinktree);

export default router;
