/**
 * Enhanced Background Service Worker for YouTube AI Optimizer
 * Includes improved error handling, retry logic, and state management
 */

import CONFIG from './config.js';
import * as utils from './utils.js';

// Global state
let authToken = null;
let isProcessing = false;
let optimizationQueue = [];
let currentVideo = null;
let geminiTabId = null;
let seoData = null;

/**
 * Initialize extension
 */
chrome.runtime.onInstalled.addListener(() => {
    console.log('YouTube AI Optimizer installed');
    initializeSettings();
});

/**
 * Initialize default settings
 */
async function initializeSettings() {
    const result = await chrome.storage.local.get(CONFIG.STORAGE.SETTINGS);
    if (!result[CONFIG.STORAGE.SETTINGS]) {
        await chrome.storage.local.set({
            [CONFIG.STORAGE.SETTINGS]: CONFIG.DEFAULT_SETTINGS
        });
    }
}

/**
 * Main message handler
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 Message received:', request.action, request);

    // Handle async operations
    (async () => {
        try {
            let response;

            switch (request.action) {
                case 'LOGIN':
                    console.log('Handling LOGIN...');
                    response = await handleLogin();
                    console.log('LOGIN response:', response);
                    break;

                case 'LOGOUT':
                    console.log('Handling LOGOUT...');
                    response = await handleLogout();
                    break;

                case 'GET_AUTH_STATUS':
                    console.log('Handling GET_AUTH_STATUS...');
                    response = await getAuthStatus();
                    console.log('GET_AUTH_STATUS response:', response);
                    break;

                case 'START_OPTIMIZATION':
                    console.log('Handling START_OPTIMIZATION...');
                    response = await startOptimization(request.videoIds);
                    break;

                case 'GET_OPTIMIZATION_STATUS':
                    response = {
                        isProcessing,
                        queue: optimizationQueue,
                        currentVideo
                    };
                    break;

                case 'GET_CHANNEL_VIDEOS':
                    console.log('Handling GET_CHANNEL_VIDEOS...');
                    response = await getChannelVideos(request.pageToken);
                    console.log('GET_CHANNEL_VIDEOS response:', response);
                    break;

                case 'SEO_RESULT':
                    console.log('Handling SEO_RESULT...');
                    response = await handleSeoResult(request.data);
                    break;

                case 'THUMBNAIL_RESULT':
                    console.log('Handling THUMBNAIL_RESULT...');
                    response = await handleThumbnailResult(request.data);
                    break;

                case 'NEXT_VIDEO':
                    response = await processNextVideo();
                    break;

                case 'CANCEL_OPTIMIZATION':
                    response = await cancelOptimization();
                    break;

                default:
                    console.warn('Unknown action:', request.action);
                    response = { success: false, error: 'Unknown action' };
            }

            console.log('📤 Sending response:', response);
            sendResponse(response);
        } catch (error) {
            console.error('❌ Error handling message:', error);
            console.error('Error stack:', error.stack);
            sendResponse({
                success: false,
                error: error.message || 'Unknown error'
            });
        }
    })();

    return true; // Keep channel open for async response
});

/**
 * Handle Google OAuth login using getAuthToken (try this first)
 */
async function handleLogin() {
    console.log('🔐 handleLogin called');
    console.log('📋 Manifest OAuth config:', chrome.runtime.getManifest().oauth2);
    
    return new Promise((resolve, reject) => {
        // Check for cached token first
        chrome.storage.local.get(CONFIG.STORAGE.AUTH_TOKEN, (result) => {
            const cachedToken = result[CONFIG.STORAGE.AUTH_TOKEN];
            
            if (cachedToken) {
                console.log('✅ Found cached token');
                authToken = cachedToken;
                resolve({
                    success: true,
                    message: 'Login successful (cached)',
                    token: cachedToken
                });
                return;
            }

            // No cached token, try getAuthToken first
            console.log('🔓 No cached token, trying getAuthToken...');
            
            chrome.identity.getAuthToken({ interactive: true }, (token) => {
                if (chrome.runtime.lastError) {
                    const errorMsg = chrome.runtime.lastError.message;
                    console.error('❌ getAuthToken error:', errorMsg);
                    
                    // If getAuthToken fails, try Web Auth Flow as fallback
                    console.log('🔄 Trying Web Auth Flow as fallback...');
                    tryWebAuthFlow(resolve, reject);
                    return;
                }
                
                if (!token) {
                    console.error('❌ No token from getAuthToken');
                    // Try Web Auth Flow as fallback
                    console.log('🔄 Trying Web Auth Flow as fallback...');
                    tryWebAuthFlow(resolve, reject);
                    return;
                }
                
                console.log('✅ Token received from getAuthToken:', token.substring(0, 20) + '...');
                authToken = token;
                
                chrome.storage.local.set({
                    [CONFIG.STORAGE.AUTH_TOKEN]: token
                }, () => {
                    console.log('✅ Token saved to storage');
                    resolve({
                        success: true,
                        message: CONFIG.SUCCESS.LOGIN,
                        token: token
                    });
                });
            });
        });
    });
}

/**
 * Fallback Web Auth Flow
 */
function tryWebAuthFlow(resolve, reject) {
    const manifest = chrome.runtime.getManifest();
    const clientId = manifest.oauth2.client_id;
    const redirectUri = chrome.identity.getRedirectURL();
    const scopes = manifest.oauth2.scopes.join(' ');
    
    const authUrl = `https://accounts.google.com/oauth/authorize?` +
        `client_id=${clientId}&` +
        `response_type=token&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scopes)}`;
    
    console.log('🌐 Fallback Auth URL:', authUrl);
    
    chrome.identity.launchWebAuthFlow({
        url: authUrl,
        interactive: true
    }, (responseUrl) => {
        if (chrome.runtime.lastError) {
            const errorMsg = chrome.runtime.lastError.message;
            console.error('❌ Web Auth Flow fallback error:', errorMsg);
            
            reject(new Error(`Both getAuthToken and Web Auth Flow failed. Last error: ${errorMsg}`));
            return;
        }
        
        if (!responseUrl) {
            reject(new Error('No response URL from Web Auth Flow'));
            return;
        }
        
        console.log('📥 Fallback Response URL:', responseUrl);
        
        try {
            const urlFragment = responseUrl.split('#')[1];
            if (!urlFragment) {
                throw new Error('No URL fragment found');
            }
            
            const urlParams = new URLSearchParams(urlFragment);
            const token = urlParams.get('access_token');
            
            if (!token) {
                throw new Error('No access token in response');
            }
            
            console.log('✅ Token from Web Auth Flow:', token.substring(0, 20) + '...');
            authToken = token;
            
            chrome.storage.local.set({
                [CONFIG.STORAGE.AUTH_TOKEN]: token
            }, () => {
                resolve({
                    success: true,
                    message: CONFIG.SUCCESS.LOGIN,
                    token: token
                });
            });
        } catch (error) {
            reject(new Error('Failed to parse Web Auth Flow response: ' + error.message));
        }
    });
}

/**
 * Handle logout
 */
async function handleLogout() {
    return new Promise((resolve) => {
        if (authToken) {
            chrome.identity.removeCachedAuthToken({ token: authToken }, () => {
                authToken = null;
                chrome.storage.local.remove([
                    CONFIG.STORAGE.AUTH_TOKEN,
                    CONFIG.STORAGE.QUEUE,
                    CONFIG.STORAGE.CURRENT_VIDEO
                ]);
                resolve({
                    success: true,
                    message: CONFIG.SUCCESS.LOGOUT
                });
            });
        } else {
            resolve({
                success: true,
                message: CONFIG.SUCCESS.LOGOUT
            });
        }
    });
}

/**
 * Get authentication status
 */
async function getAuthStatus() {
    const result = await chrome.storage.local.get(CONFIG.STORAGE.AUTH_TOKEN);
    const token = result[CONFIG.STORAGE.AUTH_TOKEN];

    if (token) {
        authToken = token;
        
        // For testing - skip token validation
        console.log('✅ Token found in storage:', token.substring(0, 20) + '...');
        return {
            isAuthenticated: true,
            token: token
        };
    }

    return {
        isAuthenticated: false,
        token: null
    };
}

/**
 * Start optimization for multiple videos
 */
async function startOptimization(videoIds) {
    if (isProcessing) {
        throw new Error(CONFIG.ERRORS.OPTIMIZATION_IN_PROGRESS);
    }

    if (!authToken) {
        throw new Error(CONFIG.ERRORS.NOT_AUTHENTICATED);
    }

    // Validate video IDs
    const validIds = videoIds.filter(id => utils.isValidVideoId(id));
    if (validIds.length === 0) {
        throw new Error('No valid video IDs provided');
    }

    optimizationQueue = validIds.map(id => ({
        videoId: id,
        status: 'pending',
        startTime: null,
        endTime: null,
        seoData: null,
        thumbnailUrl: null,
        error: null
    }));

    await chrome.storage.local.set({
        [CONFIG.STORAGE.QUEUE]: optimizationQueue
    });

    isProcessing = true;
    notifyPopup(CONFIG.SUCCESS.OPTIMIZATION_STARTED, 'info');

    // Start processing first video
    await processNextVideo();

    return {
        success: true,
        message: CONFIG.SUCCESS.OPTIMIZATION_STARTED,
        count: validIds.length
    };
}

/**
 * Process next video in queue
 */
async function processNextVideo() {
    const pendingVideo = optimizationQueue.find(v => v.status === 'pending');

    if (!pendingVideo) {
        // All videos processed
        await completeOptimization();
        return {
            success: true,
            message: 'All videos processed'
        };
    }

    currentVideo = pendingVideo;
    pendingVideo.status = 'processing';
    pendingVideo.startTime = new Date();

    await updateQueueStorage();
    notifyPopup(`Processing: ${pendingVideo.videoId}`, 'info');

    try {
        // Fetch video details
        const videoDetails = await fetchVideoDetails(pendingVideo.videoId);

        // Open Gemini tab
        await openGeminiTab();

        // Send SEO prompt
        const seoPrompt = generateSeoPrompt(videoDetails.url);
        await sendPromptToGemini(seoPrompt, 'SEO');

        return {
            success: true,
            message: 'Video processing started'
        };
    } catch (error) {
        pendingVideo.status = 'failed';
        pendingVideo.error = error.message;
        await updateQueueStorage();
        notifyPopup(`Error processing video: ${error.message}`, 'error');

        // Try next video
        return await processNextVideo();
    }
}

/**
 * Get channel videos from YouTube API
 */
async function getChannelVideos(pageToken = null) {
    console.log('getChannelVideos called, pageToken:', pageToken);
    
    if (!authToken) {
        console.log('No authToken, checking storage...');
        // Try to get token from storage
        const result = await chrome.storage.local.get(CONFIG.STORAGE.AUTH_TOKEN);
        if (result[CONFIG.STORAGE.AUTH_TOKEN]) {
            authToken = result[CONFIG.STORAGE.AUTH_TOKEN];
            console.log('Token found in storage');
        } else {
            console.error('No token found');
            throw new Error(CONFIG.ERRORS.NOT_AUTHENTICATED);
        }
    }

    return utils.retry(async () => {
        console.log('Fetching channel info...');
        
        // First, get the channel ID
        const channelResponse = await fetch(
            `${CONFIG.API.YOUTUBE_BASE}/channels?part=contentDetails&mine=true`,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            }
        );

        console.log('Channel response status:', channelResponse.status);

        if (!channelResponse.ok) {
            const errorText = await channelResponse.text();
            console.error('Channel API error:', errorText);
            throw new Error(`${CONFIG.ERRORS.API_ERROR}: ${channelResponse.statusText}`);
        }

        const channelData = await channelResponse.json();
        console.log('Channel data:', channelData);
        
        if (!channelData.items || channelData.items.length === 0) {
            console.error('No channel found in response');
            throw new Error('No channel found. Make sure you have a YouTube channel.');
        }

        const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
        console.log('Uploads playlist ID:', uploadsPlaylistId);

        // Build URL with pagination
        let url = `${CONFIG.API.YOUTUBE_BASE}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50`;
        if (pageToken) {
            url += `&pageToken=${pageToken}`;
        }

        console.log('Fetching videos from:', url);

        // Get videos from uploads playlist
        const videosResponse = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        console.log('Videos response status:', videosResponse.status);

        if (!videosResponse.ok) {
            const errorText = await videosResponse.text();
            console.error('Videos API error:', errorText);
            throw new Error(`${CONFIG.ERRORS.API_ERROR}: ${videosResponse.statusText}`);
        }

        const videosData = await videosResponse.json();
        console.log('Videos data:', videosData);
        
        if (!videosData.items || videosData.items.length === 0) {
            console.warn('No videos found in playlist');
            return {
                success: true,
                videos: [],
                nextPageToken: null,
                totalResults: 0
            };
        }
        
        const videos = videosData.items.map(item => ({
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
            publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
            url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
        }));

        console.log(`Mapped ${videos.length} videos`);

        return {
            success: true,
            videos: videos,
            nextPageToken: videosData.nextPageToken || null,
            totalResults: videosData.pageInfo?.totalResults || videos.length
        };
    }, CONFIG.API.RETRY_ATTEMPTS, CONFIG.API.RETRY_DELAY);
}

/**
 * Fetch video details from YouTube API
 */
async function fetchVideoDetails(videoId) {
    return utils.retry(async () => {
        const response = await fetch(
            `${CONFIG.API.YOUTUBE_BASE}/videos?part=snippet&id=${videoId}`,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`${CONFIG.ERRORS.API_ERROR}: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.items || data.items.length === 0) {
            throw new Error('Video not found');
        }

        const video = data.items[0];
        return {
            videoId: videoId,
            title: video.snippet.title,
            description: video.snippet.description,
            tags: video.snippet.tags || [],
            url: `https://www.youtube.com/watch?v=${videoId}`
        };
    }, CONFIG.API.RETRY_ATTEMPTS, CONFIG.API.RETRY_DELAY);
}

/**
 * Open Gemini tab
 */
async function openGeminiTab() {
    return new Promise((resolve, reject) => {
        // Close previous tab if exists
        if (geminiTabId) {
            chrome.tabs.remove(geminiTabId).catch(() => {});
        }

        chrome.tabs.create({ url: CONFIG.GEMINI.URL }, (tab) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }

            geminiTabId = tab.id;
            // Wait for tab to load
            setTimeout(resolve, 2000);
        });
    });
}

/**
 * Send prompt to Gemini
 */
async function sendPromptToGemini(prompt, type) {
    if (!geminiTabId) {
        throw new Error(CONFIG.ERRORS.GEMINI_NOT_OPEN);
    }

    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(geminiTabId, {
            action: 'INJECT_PROMPT',
            prompt: prompt,
            type: type
        }, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }

            if (!response || !response.success) {
                reject(new Error(response?.error || 'Failed to inject prompt'));
                return;
            }

            resolve(response.data);
        });
    });
}

/**
 * Generate SEO prompt
 */
function generateSeoPrompt(videoUrl) {
    return CONFIG.PROMPTS.SEO.replace('{video_url}', videoUrl);
}

/**
 * Generate thumbnail prompt
 */
function generateThumbnailPrompt(videoTitle) {
    const keyPhrase = videoTitle.substring(0, 50);
    return CONFIG.PROMPTS.THUMBNAIL
        .replace('{width}', CONFIG.VIDEO.THUMBNAIL_WIDTH)
        .replace('{height}', CONFIG.VIDEO.THUMBNAIL_HEIGHT)
        .replace('{video_title}', videoTitle)
        .replace('{key_phrase}', keyPhrase);
}

/**
 * Handle SEO result
 */
async function handleSeoResult(result) {
    if (!currentVideo) {
        throw new Error('No current video in processing');
    }

    try {
        if (!result || !result.data) {
            throw new Error('Invalid SEO result');
        }

        // Validate SEO data
        if (!utils.validateSeoData(result.data)) {
            throw new Error('SEO data validation failed');
        }

        seoData = result.data;
        currentVideo.seoData = seoData;

        // Update video with SEO data
        await updateVideoSEO(currentVideo.videoId, seoData);

        // Send thumbnail prompt
        const thumbnailPrompt = generateThumbnailPrompt(seoData.title);
        await sendPromptToGemini(thumbnailPrompt, 'THUMBNAIL');

        return {
            success: true,
            message: CONFIG.SUCCESS.SEO_UPDATED
        };
    } catch (error) {
        currentVideo.status = 'failed';
        currentVideo.error = error.message;
        throw error;
    }
}

/**
 * Update video SEO via YouTube API
 */
async function updateVideoSEO(videoId, seoData) {
    return utils.retry(async () => {
        const updateData = {
            id: videoId,
            snippet: {
                title: seoData.title,
                description: seoData.description,
                tags: seoData.tags
            }
        };

        const response = await fetch(
            `${CONFIG.API.YOUTUBE_BASE}/videos?part=snippet`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            }
        );

        if (!response.ok) {
            throw new Error(`${CONFIG.ERRORS.API_ERROR}: ${response.statusText}`);
        }

        return await response.json();
    }, CONFIG.API.RETRY_ATTEMPTS, CONFIG.API.RETRY_DELAY);
}

/**
 * Handle thumbnail result
 */
async function handleThumbnailResult(result) {
    if (!currentVideo) {
        throw new Error('No current video in processing');
    }

    try {
        if (!result || !result.imageBlob) {
            throw new Error('Invalid thumbnail result');
        }

        // Upload thumbnail
        await uploadThumbnail(currentVideo.videoId, result.imageBlob);

        currentVideo.thumbnailUrl = result.imageUrl || 'uploaded';
        currentVideo.status = 'completed';
        currentVideo.endTime = new Date();

        await updateQueueStorage();
        notifyPopup(
            `✓ ${currentVideo.videoId} optimized successfully`,
            'success'
        );

        // Process next video
        await processNextVideo();

        return {
            success: true,
            message: CONFIG.SUCCESS.THUMBNAIL_UPLOADED
        };
    } catch (error) {
        currentVideo.status = 'failed';
        currentVideo.error = error.message;
        await updateQueueStorage();
        throw error;
    }
}

/**
 * Upload thumbnail via YouTube API
 */
async function uploadThumbnail(videoId, imageBlob) {
    return utils.retry(async () => {
        const formData = new FormData();
        formData.append('file', imageBlob, 'thumbnail.jpg');

        const response = await fetch(
            `${CONFIG.API.YOUTUBE_BASE}/thumbnails/set?videoId=${videoId}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error(`${CONFIG.ERRORS.API_ERROR}: ${response.statusText}`);
        }

        return await response.json();
    }, CONFIG.API.RETRY_ATTEMPTS, CONFIG.API.RETRY_DELAY);
}

/**
 * Complete optimization
 */
async function completeOptimization() {
    isProcessing = false;

    const settings = await getSettings();
    if (settings.autoCloseTabs && geminiTabId) {
        chrome.tabs.remove(geminiTabId).catch(() => {});
        geminiTabId = null;
    }

    const completed = optimizationQueue.filter(v => v.status === 'completed').length;
    const failed = optimizationQueue.filter(v => v.status === 'failed').length;

    const message = `Optimization complete: ${completed} succeeded, ${failed} failed`;
    notifyPopup(message, completed === optimizationQueue.length ? 'success' : 'warning');

    // Save to history
    await saveToHistory();
}

/**
 * Cancel optimization
 */
async function cancelOptimization() {
    isProcessing = false;

    if (geminiTabId) {
        chrome.tabs.remove(geminiTabId).catch(() => {});
        geminiTabId = null;
    }

    optimizationQueue = [];
    currentVideo = null;
    seoData = null;

    await chrome.storage.local.remove([
        CONFIG.STORAGE.QUEUE,
        CONFIG.STORAGE.CURRENT_VIDEO
    ]);

    notifyPopup('Optimization cancelled', 'info');

    return {
        success: true,
        message: 'Optimization cancelled'
    };
}

/**
 * Get extension settings
 */
async function getSettings() {
    const result = await chrome.storage.local.get(CONFIG.STORAGE.SETTINGS);
    return result[CONFIG.STORAGE.SETTINGS] || CONFIG.DEFAULT_SETTINGS;
}

/**
 * Update queue storage
 */
async function updateQueueStorage() {
    await chrome.storage.local.set({
        [CONFIG.STORAGE.QUEUE]: optimizationQueue,
        [CONFIG.STORAGE.CURRENT_VIDEO]: currentVideo
    });
}

/**
 * Save optimization to history
 */
async function saveToHistory() {
    const result = await chrome.storage.local.get(CONFIG.STORAGE.HISTORY);
    const history = result[CONFIG.STORAGE.HISTORY] || [];

    const entry = {
        timestamp: new Date().toISOString(),
        queue: optimizationQueue,
        summary: {
            total: optimizationQueue.length,
            completed: optimizationQueue.filter(v => v.status === 'completed').length,
            failed: optimizationQueue.filter(v => v.status === 'failed').length
        }
    };

    history.push(entry);

    // Keep only last 100 entries
    if (history.length > 100) {
        history.shift();
    }

    await chrome.storage.local.set({
        [CONFIG.STORAGE.HISTORY]: history
    });
}

/**
 * Notify popup
 */
function notifyPopup(message, type = 'info') {
    chrome.runtime.sendMessage({
        action: 'STATUS_UPDATE',
        message: message,
        type: type
    }).catch(() => {
        console.log('Popup not open:', message);
    });
}

console.log('Enhanced background service worker loaded');
