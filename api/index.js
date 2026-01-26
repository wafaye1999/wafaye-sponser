// Vercel serverless function wrapper for Express app
import app from '../backend/src/app.js';
import { connectDB } from '../backend/src/lib/db.js';

// Connect to database
connectDB();

export default app;
