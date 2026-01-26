import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV } from './lib/env.js';
import authRoutes from './routes/authRoutes.js';
import linktreeRoutes from './routes/linktreeRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Production: Serve frontend static files (only if not in Vercel)
if (ENV.NODE_ENV === "production" && process.env.VERCEL !== '1') {
    app.use(express.static(path.join(__dirname, '../../frontend', 'dist')));
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/linktree', linktreeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Production: Catch-all route for SPA (only if not in Vercel - Vercel handles this)
if (ENV.NODE_ENV === "production" && process.env.VERCEL !== '1') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../frontend', 'dist', 'index.html'));
    });
}

export default app;
