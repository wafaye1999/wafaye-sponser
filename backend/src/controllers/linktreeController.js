import Linktree from '../models/Linktree.js';
import { deleteImage, deleteImageIfChanged } from '../lib/imageUtils.js';

// Get all linktrees
export const getAllLinktrees = async (req, res) => {
    try {
        const linktrees = await Linktree.find().sort({ createdAt: -1 });
        
        // Sort to ensure 'root' is always at the top
        linktrees.sort((a, b) => {
            if (a._id === 'root') return -1;
            if (b._id === 'root') return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        res.json(linktrees);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single linktree by ID (uid)
export const getLinktreeById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const linktree = await Linktree.findById(id);
        if (!linktree) {
            return res.status(404).json({ message: 'Linktree not found' });
        }
        res.json(linktree);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create linktree
export const createLinktree = async (req, res) => {
    try {
        const { title, subtitle, image, color, template, footerText, sponsorName, sponsorPhone, platforms, expiresAt } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const linktree = new Linktree({
            title,
            subtitle,
            image,
            color,
            template,
            footerText,
            sponsorName,
            sponsorPhone,
            platforms,
            expiresAt: expiresAt ? new Date(expiresAt) : undefined
        });

        await linktree.save();
        res.status(201).json(linktree);
    } catch (error) {
        console.error('Create linktree error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update linktree
export const updateLinktree = async (req, res) => {
    try {
        // Get the current linktree to check for image changes
        const currentLinktree = await Linktree.findById(req.params.id);
        
        if (!currentLinktree) {
            return res.status(404).json({ message: 'Linktree not found' });
        }

        // Check if image is being changed and delete old one
        if (req.body.image !== undefined) {
            deleteImageIfChanged(currentLinktree.image, req.body.image);
        }

        const linktree = await Linktree.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(linktree);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete linktree
export const deleteLinktree = async (req, res) => {
    try {
        // Prevent deleting root linktree
        if (req.params.id === 'root') {
            return res.status(403).json({ message: 'Cannot delete root linktree' });
        }

        const linktree = await Linktree.findByIdAndDelete(req.params.id);

        if (!linktree) {
            return res.status(404).json({ message: 'Linktree not found' });
        }

        // Delete the associated image if it exists
        if (linktree.image) {
            deleteImage(linktree.image);
        }

        res.json({ message: 'Linktree deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
