/**
 * Utility functions for YouTube AI Optimizer
 */

/**
 * Extract video ID from YouTube URL
 */
export function extractVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }

    return null;
}

/**
 * Validate video ID format
 */
export function isValidVideoId(videoId) {
    return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
}

/**
 * Extract JSON from text
 */
export function extractJSON(text) {
    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return null;
        }
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('JSON extraction error:', error);
        return null;
    }
}

/**
 * Validate SEO data structure
 */
export function validateSeoData(data) {
    return (
        data &&
        typeof data.title === 'string' &&
        typeof data.description === 'string' &&
        Array.isArray(data.tags) &&
        data.title.length > 0 &&
        data.title.length <= 100 &&
        data.description.length > 0 &&
        data.description.length <= 5000 &&
        data.tags.length <= 15
    );
}

/**
 * Truncate text to specified length
 */
export function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength - 3) + '...';
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Delay execution for specified milliseconds
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 */
export async function retry(fn, maxAttempts = 3, delayMs = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxAttempts) {
                throw error;
            }
            const waitTime = delayMs * Math.pow(2, attempt - 1);
            console.log(`Attempt ${attempt} failed. Retrying in ${waitTime}ms...`);
            await delay(waitTime);
        }
    }
}

/**
 * Generate unique ID
 */
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Format timestamp to readable date
 */
export function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString();
}

/**
 * Check if element is visible in viewport
 */
export function isElementVisible(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Wait for element to appear in DOM
 */
export function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}

/**
 * Create blob from data URL
 */
export function dataUrlToBlob(dataUrl) {
    const parts = dataUrl.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}

/**
 * Resize image to specified dimensions
 */
export async function resizeImage(blob, width, height) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(resolve, 'image/jpeg', 0.95);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Log with timestamp
 */
export function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}] [${type.toUpperCase()}]`;
    console.log(`${prefix} ${message}`);
}

/**
 * Create notification
 */
export function notify(title, options = {}) {
    if (!chrome.notifications) {
        console.warn('Notifications not available');
        return;
    }

    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'assets/icon-128.png',
        title: title,
        message: options.message || '',
        ...options
    });
}

/**
 * Parse query parameters from URL
 */
export function getQueryParams(url) {
    const params = {};
    const searchParams = new URL(url).searchParams;
    for (const [key, value] of searchParams) {
        params[key] = value;
    }
    return params;
}

/**
 * Build query string from object
 */
export function buildQueryString(params) {
    return Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
}

/**
 * Deep clone object
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }

    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }

    if (obj instanceof Object) {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}

export default {
    extractVideoId,
    isValidVideoId,
    extractJSON,
    validateSeoData,
    truncateText,
    formatBytes,
    delay,
    retry,
    generateId,
    formatTimestamp,
    isElementVisible,
    waitForElement,
    dataUrlToBlob,
    resizeImage,
    log,
    notify,
    getQueryParams,
    buildQueryString,
    deepClone
};
