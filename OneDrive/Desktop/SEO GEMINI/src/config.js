/**
 * Configuration file for YouTube AI Optimizer
 */

export const CONFIG = {
    // API Configuration
    API: {
        YOUTUBE_BASE: 'https://www.googleapis.com/youtube/v3',
        YOUTUBE_SCOPES: [
            'https://www.googleapis.com/auth/youtube.force-ssl',
            'https://www.googleapis.com/auth/youtube.upload'
        ],
        REQUEST_TIMEOUT: 30000, // 30 seconds
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000 // 1 second
    },

    // Gemini Configuration
    GEMINI: {
        URL: 'https://gemini.google.com',
        RESPONSE_TIMEOUT: 120000, // 2 minutes
        IMAGE_GENERATION_TIMEOUT: 120000, // 2 minutes
        POLL_INTERVAL: 1000, // 1 second
        MAX_RETRIES: 3
    },

    // Video Configuration
    VIDEO: {
        THUMBNAIL_WIDTH: 1280,
        THUMBNAIL_HEIGHT: 720,
        THUMBNAIL_FORMAT: 'image/jpeg',
        THUMBNAIL_QUALITY: 0.95,
        MAX_TITLE_LENGTH: 100,
        MAX_DESCRIPTION_LENGTH: 5000,
        MAX_TAGS: 15,
        MAX_TAG_LENGTH: 30
    },

    // Storage Keys
    STORAGE: {
        AUTH_TOKEN: 'youtube_auth_token',
        REFRESH_TOKEN: 'youtube_refresh_token',
        QUEUE: 'optimization_queue',
        CURRENT_VIDEO: 'current_video',
        SETTINGS: 'extension_settings',
        HISTORY: 'optimization_history'
    },

    // UI Configuration
    UI: {
        POPUP_WIDTH: 400,
        POPUP_HEIGHT: 600,
        PROGRESS_UPDATE_INTERVAL: 1000, // 1 second
        STATUS_MESSAGE_DURATION: 5000 // 5 seconds
    },

    // Prompt Templates
    PROMPTS: {
        SEO: `วิเคราะห์วิดีโอ YouTube ที่ลิงก์นี้: {video_url} และทำ SEO ให้วิดีโอนี้ โดยให้ผลลัพธ์เป็น JSON format เท่านั้น ประกอบด้วย:
1. "title": ชื่อวิดีโอใหม่ที่น่าสนใจและดึงดูด (ไม่เกิน 100 ตัวอักษร)
2. "description": คำอธิบายวิดีโอที่ละเอียดและมีคีย์เวิร์ด (ไม่เกิน 5000 ตัวอักษร)
3. "tags": รายการแฮชแท็กที่เกี่ยวข้องสูงสุด 15 รายการ (ในรูปแบบ Array of Strings)
4. "summary": สรุปเนื้อหาวิดีโอสั้นๆ สำหรับการตรวจสอบ (ไม่เกิน 500 ตัวอักษร)`,

        THUMBNAIL: `สร้างรูปหน้าปกวิดีโอ YouTube คุณภาพสูงด้วย Gemini 3 Pro (Nano Banana) ขนาด {width}x{height} พิกเซล สำหรับวิดีโอชื่อ: '{video_title}' รูปแบบเป็นสไตล์ที่ดึงดูดสายตาและเกี่ยวข้องกับเนื้อหาของวิดีโอ. ข้อความบนภาพคือ: '{key_phrase}'`
    },

    // Selectors for DOM elements
    SELECTORS: {
        GEMINI: {
            INPUT_FIELD: [
                'textarea[aria-label*="Message"]',
                'textarea[placeholder*="Message"]',
                'div[contenteditable="true"][role="textbox"]',
                'textarea[role="textbox"]',
                'input[type="text"][aria-label*="Message"]'
            ],
            SEND_BUTTON: [
                'button[aria-label*="Send"]',
                'button[title*="Send"]',
                'button[data-tooltip*="Send"]',
                'button[aria-label="Send message"]'
            ],
            MESSAGE_CONTAINER: '[role="article"]',
            IMAGE_ELEMENT: 'img, picture img'
        },
        YOUTUBE: {
            VIDEO_ITEM: '[data-video-id]',
            VIDEO_ROW: 'tr[data-video-id]',
            VIDEO_LINK: 'a[href*="/watch?v="]',
            HEADER: 'ytcp-toolbar, [role="banner"], .header'
        }
    },

    // Error Messages
    ERRORS: {
        NOT_AUTHENTICATED: 'Not authenticated. Please login first.',
        OPTIMIZATION_IN_PROGRESS: 'Optimization already in progress',
        GEMINI_NOT_OPEN: 'Gemini tab not open',
        INPUT_FIELD_NOT_FOUND: 'Could not find Gemini input field',
        SEND_BUTTON_NOT_FOUND: 'Could not find Gemini send button',
        RESPONSE_TIMEOUT: 'Response timeout from Gemini',
        INVALID_JSON: 'Invalid JSON response from Gemini',
        API_ERROR: 'YouTube API error',
        NETWORK_ERROR: 'Network error',
        UNKNOWN_ERROR: 'Unknown error occurred'
    },

    // Success Messages
    SUCCESS: {
        LOGIN: 'Logged in successfully',
        LOGOUT: 'Logged out successfully',
        OPTIMIZATION_STARTED: 'Optimization started',
        OPTIMIZATION_COMPLETE: 'All videos optimized successfully',
        SEO_UPDATED: 'SEO metadata updated',
        THUMBNAIL_UPLOADED: 'Thumbnail uploaded successfully'
    },

    // Default Settings
    DEFAULT_SETTINGS: {
        autoCloseTabs: true,
        notifyOnComplete: true,
        retryOnFailure: true,
        maxRetries: 3,
        language: 'en'
    }
};

export default CONFIG;
