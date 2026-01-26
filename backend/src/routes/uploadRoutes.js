import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if running on Vercel (read-only filesystem)
const isVercel = process.env.VERCEL === '1';

// Configure multer based on environment
let upload;

if (isVercel) {
    // On Vercel, use memory storage (for future cloud storage integration)
    upload = multer({
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (allowed.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Only images allowed'), false);
            }
        },
        limits: { fileSize: 1 * 1024 * 1024 } // 1MB
    });
} else {
    // Local development - use disk storage
    const uploadsDir = path.join(__dirname, '../../../frontend/public/uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
            const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueName + path.extname(file.originalname));
        }
    });

    upload = multer({
        storage,
        fileFilter: (req, file, cb) => {
            const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (allowed.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Only images allowed'), false);
            }
        },
        limits: { fileSize: 1 * 1024 * 1024 } // 1MB
    });
}

// Upload image
router.post('/', protect, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    if (isVercel) {
        // On Vercel, file uploads to disk are not supported
        // Return error suggesting to use external URLs
        return res.status(501).json({
            message: 'File uploads not supported on Vercel. Please use an external image URL instead.'
        });
    }

    res.json({
        url: `/uploads/${req.file.filename}`
    });
});

export default router;
