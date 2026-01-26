import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { ENV } from '../lib/env.js';

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, ENV.JWT_SECRET, { expiresIn: '7d' });
};

// Login admin
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password' });
        }

        // Find admin by username
        const admin = await Admin.findOne({ username: username.toLowerCase() });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(admin._id);

        res.json({
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                username: admin.username
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify token (for protected routes)
export const verifyToken = async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId).select('-password');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json({ admin });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update admin profile (username and/or password)
export const updateProfile = async (req, res) => {
    try {
        const { username, currentPassword, newPassword } = req.body;
        
        const admin = await Admin.findById(req.adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // If changing password, verify current password first
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Current password is required to change password' });
            }
            
            const isMatch = await admin.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ message: 'New password must be at least 6 characters' });
            }
            
            admin.password = newPassword;
        }

        // Update username if provided
        if (username && username !== admin.username) {
            // Check if username already exists
            const existingAdmin = await Admin.findOne({ username: username.toLowerCase() });
            if (existingAdmin && existingAdmin._id.toString() !== admin._id.toString()) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            admin.username = username.toLowerCase();
        }

        await admin.save();

        // Generate new token with updated info
        const token = generateToken(admin._id);

        res.json({
            message: 'Profile updated successfully',
            token,
            admin: {
                id: admin._id,
                username: admin.username
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
