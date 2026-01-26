import Analytics from '../models/Analytics.js';
import Linktree from '../models/Linktree.js';
import { trackViewContent, trackClickButton } from '../lib/tiktokEvents.js';

// Get client IP
const getClientIp = (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
           req.headers['x-real-ip'] ||
           req.connection?.remoteAddress ||
           req.socket?.remoteAddress ||
           'unknown';
};

// Track page view
export const trackView = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if linktree exists
        const linktree = await Linktree.findById(id);
        if (!linktree) {
            return res.status(404).json({ message: 'Linktree not found' });
        }

        const ip = getClientIp(req);
        const userAgent = req.headers['user-agent'] || '';

        // Create view record
        await Analytics.create({
            linktreeId: id,
            type: 'view',
            ip
        });

        // Send TikTok ViewContent event (non-blocking)
        const url = req.body.url || req.headers.referer || '';
        const eventId = req.body.event_id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        trackViewContent(id, linktree.title, url, {
            event_id: eventId,
            ip,
            user_agent: userAgent,
            external_id: ip,
            ttclid: req.body.ttclid || req.query.ttclid || '',
            ttp: req.body.ttp || '',
        }).catch(err => console.error('TikTok event error:', err));

        res.json({ success: true });
    } catch (error) {
        console.error('Track view error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Track platform click
export const trackClick = async (req, res) => {
    try {
        const { id } = req.params;
        const { platform } = req.body;

        if (!platform) {
            return res.status(400).json({ message: 'Platform is required' });
        }

        // Check if linktree exists
        const linktree = await Linktree.findById(id);
        if (!linktree) {
            return res.status(404).json({ message: 'Linktree not found' });
        }

        const ip = getClientIp(req);
        const userAgent = req.headers['user-agent'] || '';

        // Create click record
        await Analytics.create({
            linktreeId: id,
            type: 'click',
            platform,
            ip
        });

        // Send TikTok ClickButton event (non-blocking)
        const url = req.body.url || req.headers.referer || '';
        const eventId = req.body.event_id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        trackClickButton(id, platform, url, {
            event_id: eventId,
            ip,
            user_agent: userAgent,
            external_id: ip,
            ttclid: req.body.ttclid || req.query.ttclid || '',
            ttp: req.body.ttp || '',
        }).catch(err => console.error('TikTok event error:', err));

        res.json({ success: true });
    } catch (error) {
        console.error('Track click error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get analytics for a linktree (protected)
export const getAnalytics = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if linktree exists
        const linktree = await Linktree.findById(id);
        if (!linktree) {
            return res.status(404).json({ message: 'Linktree not found' });
        }

        // Get unique views (distinct IPs)
        const uniqueViews = await Analytics.distinct('ip', {
            linktreeId: id,
            type: 'view'
        });

        // Get unique clicks (distinct IPs)
        const uniqueClicks = await Analytics.distinct('ip', {
            linktreeId: id,
            type: 'click'
        });

        // Get clicks by platform (unique IPs per platform)
        const clicksByPlatform = await Analytics.aggregate([
            {
                $match: {
                    linktreeId: id,
                    type: 'click'
                }
            },
            {
                $group: {
                    _id: '$platform',
                    uniqueIps: { $addToSet: '$ip' }
                }
            },
            {
                $project: {
                    _id: 1,
                    total: { $size: '$uniqueIps' }
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        // Get views over time (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const viewsOverTime = await Analytics.aggregate([
            {
                $match: {
                    linktreeId: id,
                    type: 'view',
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Get recent activity (last 10)
        const recentActivity = await Analytics.find({ linktreeId: id })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('type platform ip createdAt');

        res.json({
            linktree: {
                id: linktree._id,
                title: linktree.title
            },
            views: {
                total: uniqueViews.length
            },
            clicks: {
                total: uniqueClicks.length,
                byPlatform: clicksByPlatform
            },
            viewsOverTime,
            recentActivity
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete all analytics for a linktree (protected)
export const deleteAnalytics = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete all analytics records for this linktree
        const result = await Analytics.deleteMany({ linktreeId: id });

        res.json({ 
            success: true, 
            message: 'Analytics deleted',
            deletedCount: result.deletedCount 
        });
    } catch (error) {
        console.error('Delete analytics error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete ALL analytics for ALL linktrees (protected)
export const deleteAllAnalytics = async (req, res) => {
    try {
        // Delete all analytics records
        const result = await Analytics.deleteMany({});

        res.json({ 
            success: true, 
            message: 'All analytics deleted',
            deletedCount: result.deletedCount 
        });
    } catch (error) {
        console.error('Delete all analytics error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Check if any analytics data exists (protected)
export const hasAnalytics = async (req, res) => {
    try {
        const count = await Analytics.countDocuments();
        res.json({ hasData: count > 0, count });
    } catch (error) {
        console.error('Check analytics error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
