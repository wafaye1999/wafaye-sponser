import { ENV } from './env.js';

const TIKTOK_API_URL = 'https://business-api.tiktok.com/open_api/v1.3/event/track/';

/**
 * Send event to TikTok Events API
 * @param {string} eventName - Event name (ViewContent, ClickButton, etc.)
 * @param {object} eventData - Event data
 * @param {object} userData - User/customer information
 */
export const sendTikTokEvent = async (eventName, eventData, userData) => {
    // Skip if TikTok credentials are not configured
    if (!ENV.TIKTOK_ACCESS_TOKEN || !ENV.TIKTOK_PIXEL_ID) {
        console.log('TikTok Events API: Skipping - credentials not configured');
        return null;
    }

    try {
        const payload = {
            event_source: 'web',
            event_source_id: ENV.TIKTOK_PIXEL_ID,
            data: [
                {
                    event: eventName,
                    event_time: Math.floor(Date.now() / 1000),
                    event_id: userData.event_id || eventData.event_id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    user: {
                        ip: userData.ip || '',
                        user_agent: userData.user_agent || '',
                        external_id: userData.external_id || '',
                        ttclid: userData.ttclid || '',
                        ttp: userData.ttp || '',
                    },
                    properties: {
                        content_id: eventData.content_id || '',
                        content_type: eventData.content_type || 'product',
                        content_name: eventData.content_name || '',
                    },
                    page: {
                        url: eventData.url || '',
                    }
                }
            ]
        };

        const response = await fetch(TIKTOK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Token': ENV.TIKTOK_ACCESS_TOKEN,
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (result.code === 0) {
            console.log(`TikTok Event sent: ${eventName}`);
        } else {
            console.error('TikTok Event error:', result.message);
        }

        return result;
    } catch (error) {
        console.error('TikTok Events API error:', error.message);
        return null;
    }
};

/**
 * Track ViewContent event - when user views a linktree page
 */
export const trackViewContent = async (linktreeId, linktreeTitle, url, userData) => {
    return sendTikTokEvent('ViewContent', {
        content_id: linktreeId,
        content_type: 'product',
        content_name: linktreeTitle,
        url,
        event_id: userData.event_id, // Pass event_id from userData to eventData
    }, userData);
};

/**
 * Track ClickButton event - when user clicks a social media button
 */
export const trackClickButton = async (linktreeId, platform, url, userData) => {
    return sendTikTokEvent('ClickButton', {
        content_id: linktreeId,
        content_type: 'product',
        content_name: `${platform} button`,
        url,
        event_id: userData.event_id, // Pass event_id from userData to eventData
    }, userData);
};
