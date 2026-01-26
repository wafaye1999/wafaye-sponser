import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
    linktreeId: {
        type: String,
        required: true,
        ref: 'Linktree'
    },
    type: {
        type: String,
        enum: ['view', 'click'],
        required: true
    },
    platform: {
        type: String,
        default: null // Only for clicks
    },
    ip: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Compound index for efficient querying
analyticsSchema.index({ linktreeId: 1, type: 1 });
analyticsSchema.index({ linktreeId: 1, ip: 1, type: 1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
