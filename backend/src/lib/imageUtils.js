import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if running on Vercel (read-only filesystem)
const isVercel = process.env.VERCEL === '1';

const uploadsDir = path.join(__dirname, '../../../frontend/public/uploads');

/**
 * Delete an image file from the uploads directory
 * @param {string} imageUrl - The image URL (e.g., '/uploads/filename.png')
 * @returns {boolean} - Whether the deletion was successful
 */
export const deleteImage = (imageUrl) => {
    // Skip on Vercel - filesystem is read-only
    if (isVercel) {
        return false;
    }

    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
        return false;
    }

    try {
        const filename = imageUrl.replace('/uploads/', '');
        const filePath = path.join(uploadsDir, filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted image: ${filename}`);
            return true;
        }
    } catch (error) {
        console.error('Error deleting image:', error);
    }

    return false;
};

/**
 * Delete image if it's different from the new one
 * @param {string} oldImageUrl - The old image URL
 * @param {string} newImageUrl - The new image URL
 */
export const deleteImageIfChanged = (oldImageUrl, newImageUrl) => {
    if (oldImageUrl && oldImageUrl !== newImageUrl && oldImageUrl.startsWith('/uploads/')) {
        deleteImage(oldImageUrl);
    }
};
