import mongoose from 'mongoose';

const platformSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['whatsapp', 'telegram', 'viber', 'phone', 'instagram', 'facebook', 'snapchat', 'tiktok', 'website', 'discord'],
        required: true
    },
    value: {
        type: String,
        required: true
    },
    message: {
        type: String,
        default: '' // Optional message for WhatsApp and Telegram
    }
}, { _id: false });

const linktreeSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString()
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    subtitle: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: '#007AFF'
    },
    template: {
        type: String,
        enum: ['default', 'minimal', 'gradient'],
        default: 'default'
    },
    footerText: {
        type: String,
        default: 'Sponsored by'
    },
    sponsorName: {
        type: String,
        default: 'Wafaye Sponser'
    },
    sponsorPhone: {
        type: String,
        default: '07506553031'
    },
    platforms: [platformSchema],
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        index: { expires: 0 } // TTL index - auto delete when date passes
    }
}, { timestamps: true });

const Linktree = mongoose.model('Linktree', linktreeSchema);

export default Linktree;
