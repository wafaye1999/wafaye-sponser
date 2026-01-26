import fs from 'fs';
import path from 'path';
import Linktree from '../models/Linktree.js';

const uploadsDir = path.join(process.cwd(), '../frontend/public/uploads');

/**
 * Clean up orphaned images that are not referenced by any linktree
 * This handles cases like TTL auto-deletion where Mongoose middleware doesn't run
 */
export const cleanupOrphanedImages = async () => {
    try {
        // Ensure uploads directory exists
        if (!fs.existsSync(uploadsDir)) {
            console.log('Uploads directory does not exist, skipping cleanup');
            return { deleted: 0, kept: 0 };
        }

        // Get all files in uploads directory
        const files = fs.readdirSync(uploadsDir);
        
        if (files.length === 0) {
            console.log('No images to clean up');
            return { deleted: 0, kept: 0 };
        }

        // Get all image URLs currently in use
        const linktrees = await Linktree.find({}, 'image');
        const usedImages = new Set(
            linktrees
                .map(lt => lt.image)
                .filter(img => img && img.startsWith('/uploads/'))
                .map(img => img.replace('/uploads/', ''))
        );

        let deleted = 0;
        let kept = 0;

        // Check each file
        for (const file of files) {
            if (usedImages.has(file)) {
                kept++;
            } else {
                // File is orphaned, delete it
                const filePath = path.join(uploadsDir, file);
                try {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted orphaned image: ${file}`);
                    deleted++;
                } catch (err) {
                    console.error(`Failed to delete ${file}:`, err.message);
                }
            }
        }

        console.log(`Image cleanup complete: ${deleted} deleted, ${kept} kept`);
        return { deleted, kept };
    } catch (error) {
        console.error('Error during image cleanup:', error);
        return { deleted: 0, kept: 0, error: error.message };
    }
};

/**
 * Start periodic cleanup (runs every hour by default)
 * @param {number} intervalMs - Interval in milliseconds (default: 1 hour)
 */
export const startPeriodicCleanup = (intervalMs = 60 * 60 * 1000) => {
    // Run once on startup after a short delay (wait for DB connection)
    setTimeout(() => {
        console.log('Running initial orphaned image cleanup...');
        cleanupOrphanedImages();
    }, 10000); // 10 seconds after startup

    // Then run periodically
    setInterval(() => {
        console.log('Running scheduled orphaned image cleanup...');
        cleanupOrphanedImages();
    }, intervalMs);

    console.log(`Periodic image cleanup scheduled (every ${intervalMs / 1000 / 60} minutes)`);
};
