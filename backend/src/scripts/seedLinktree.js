import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Linktree from '../models/Linktree.js';

dotenv.config();

const seedLinktree = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Drop the entire collection to remove old schema constraints
        try {
            await mongoose.connection.collection('linktrees').drop();
            console.log('Dropped linktrees collection');
        } catch (e) {
            console.log('Collection does not exist, creating fresh');
        }

        // Sync indexes with new schema
        await Linktree.syncIndexes();
        console.log('Synced indexes');

        // Create root linktree (expires in 10 years - essentially permanent)
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 10);

        const linktree = new Linktree({
            _id: 'root',
            title: 'Wafaye Sponser',
            subtitle: 'بۆ پەیوەندی کردن, کلیک لەم لینکانەی خوارەوە بکە',
            image: '/images/Logo.jpg',
            color: '#007AFF',
            template: 'default',
            footerText: 'سپۆنسەر کراوە لەلایەن',
            sponsorName: 'Wafaye Sponser',
            sponsorPhone: '07506553031',
            expiresAt: expiresAt,
            platforms: [
                { type: 'whatsapp', value: '07506553031', message: '' },
                { type: 'telegram', value: 'waf_aye', message: '' },
                { type: 'viber', value: '07506553031' },
                { type: 'phone', value: '07506553031' }
            ]
        });

        await linktree.save();
        console.log('Root linktree created successfully');
        console.log('UID: root');
        console.log('URL: /root');
        console.log('Image: /images/Logo.jpg');
        console.log('Platforms:');
        console.log('  - WhatsApp: 07506553031');
        console.log('  - Telegram: waf_aye');
        console.log('  - Viber: 07506553031');
        console.log('  - Phone: 07506553031');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding linktree:', error);
        process.exit(1);
    }
};

seedLinktree();
