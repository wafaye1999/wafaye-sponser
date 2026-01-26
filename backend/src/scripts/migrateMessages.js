import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Linktree from '../models/Linktree.js';

dotenv.config();

const DEFAULT_MESSAGE = '';

const migrateMessages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find all linktrees
        const linktrees = await Linktree.find({});
        console.log(`Found ${linktrees.length} linktrees to migrate`);

        let updatedCount = 0;

        for (const linktree of linktrees) {
            let needsUpdate = false;
            const updatedPlatforms = linktree.platforms.map(platform => {
                // Add default message to WhatsApp and Telegram platforms that don't have one
                if ((platform.type === 'whatsapp' || platform.type === 'telegram') && !platform.message) {
                    needsUpdate = true;
                    return {
                        ...platform.toObject(),
                        message: DEFAULT_MESSAGE
                    };
                }
                return platform.toObject();
            });

            if (needsUpdate) {
                linktree.platforms = updatedPlatforms;
                await linktree.save();
                updatedCount++;
                console.log(`Updated linktree: ${linktree._id} (${linktree.title})`);
            }
        }

        console.log(`\n✅ Migration complete!`);
        console.log(`   - Total linktrees: ${linktrees.length}`);
        console.log(`   - Updated: ${updatedCount}`);
        console.log(`   - No changes needed: ${linktrees.length - updatedCount}`);

        process.exit(0);
    } catch (error) {
        console.error('Error migrating messages:', error);
        process.exit(1);
    }
};

migrateMessages();
