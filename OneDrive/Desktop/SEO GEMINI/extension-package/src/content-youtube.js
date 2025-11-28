/**
 * Content Script for YouTube Studio
 * Handles video selection and integration with the extension
 */

/**
 * Listen for messages from background script
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('YouTube content script received:', request.action);

    switch (request.action) {
        case 'GET_SELECTED_VIDEOS':
            getSelectedVideos().then(sendResponse);
            return true;

        case 'GET_VIDEO_URL':
            getVideoUrl(request.videoId).then(sendResponse);
            return true;

        default:
            sendResponse({ success: false, error: 'Unknown action' });
    }
});

/**
 * Get selected videos from YouTube Studio
 */
async function getSelectedVideos() {
    try {
        const videos = [];

        // Check if we're on YouTube Studio
        if (!window.location.href.includes('youtube.com/studio')) {
            return {
                success: false,
                error: 'Not on YouTube Studio page',
                videos: []
            };
        }

        // Look for video items in the page
        const videoElements = document.querySelectorAll('[data-video-id]');

        for (const element of videoElements) {
            const videoId = element.getAttribute('data-video-id');
            const titleElement = element.querySelector('[aria-label*="Title"]') || 
                                element.querySelector('a[href*="/watch"]');
            const title = titleElement?.textContent || titleElement?.getAttribute('aria-label') || 'Unknown';

            if (videoId) {
                videos.push({
                    videoId: videoId,
                    title: title.trim(),
                    url: `https://www.youtube.com/watch?v=${videoId}`
                });
            }
        }

        // Fallback: try to extract from page data
        if (videos.length === 0) {
            const pageData = extractPageData();
            if (pageData.videos) {
                return {
                    success: true,
                    videos: pageData.videos
                };
            }
        }

        return {
            success: true,
            videos: videos
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            videos: []
        };
    }
}

/**
 * Get video URL from video ID
 */
async function getVideoUrl(videoId) {
    return {
        success: true,
        url: `https://www.youtube.com/watch?v=${videoId}`
    };
}

/**
 * Extract page data from YouTube Studio
 */
function extractPageData() {
    try {
        // Try to find video list in page
        const videos = [];

        // Method 1: Look for video rows in the table
        const rows = document.querySelectorAll('tr[data-video-id]');
        for (const row of rows) {
            const videoId = row.getAttribute('data-video-id');
            const titleCell = row.querySelector('td:first-child');
            const title = titleCell?.textContent || 'Unknown';

            videos.push({
                videoId: videoId,
                title: title.trim(),
                url: `https://www.youtube.com/watch?v=${videoId}`
            });
        }

        // Method 2: Look for video items in divs
        if (videos.length === 0) {
            const items = document.querySelectorAll('[role="row"]');
            for (const item of items) {
                const link = item.querySelector('a[href*="/watch?v="]');
                if (link) {
                    const url = link.href;
                    const videoId = new URL(url).searchParams.get('v');
                    const title = link.textContent || link.getAttribute('aria-label') || 'Unknown';

                    if (videoId) {
                        videos.push({
                            videoId: videoId,
                            title: title.trim(),
                            url: url
                        });
                    }
                }
            }
        }

        return { videos };
    } catch (error) {
        console.error('Error extracting page data:', error);
        return { videos: [] };
    }
}

/**
 * Inject button into YouTube Studio UI
 */
function injectOptimizeButton() {
    // Look for the header area where we can add a button
    const header = document.querySelector('ytcp-toolbar') || 
                   document.querySelector('[role="banner"]') ||
                   document.querySelector('.header');

    if (!header) {
        console.log('Could not find header to inject button');
        return;
    }

    // Check if button already exists
    if (document.getElementById('youtube-optimizer-btn')) {
        return;
    }

    // Create button
    const button = document.createElement('button');
    button.id = 'youtube-optimizer-btn';
    button.textContent = '🚀 Optimize Videos';
    button.style.cssText = `
        padding: 8px 16px;
        margin: 8px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 12px;
        transition: all 0.3s ease;
    `;

    button.addEventListener('mouseover', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
    });

    button.addEventListener('mouseout', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = 'none';
    });

    button.addEventListener('click', async () => {
        const result = await getSelectedVideos();
        if (result.success && result.videos.length > 0) {
            chrome.runtime.sendMessage({
                action: 'START_OPTIMIZATION',
                videoIds: result.videos.map(v => v.videoId)
            });
        } else {
            alert('No videos found. Please select videos on YouTube Studio.');
        }
    });

    // Try to append to header
    try {
        header.appendChild(button);
    } catch (error) {
        console.error('Error injecting button:', error);
        // Fallback: append to body
        document.body.appendChild(button);
    }
}

/**
 * Initialize content script
 */
function init() {
    console.log('YouTube content script initialized');

    // Check if we're on YouTube Studio
    if (window.location.href.includes('youtube.com/studio')) {
        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', injectOptimizeButton);
        } else {
            injectOptimizeButton();
        }

        // Also inject after a delay in case of dynamic loading
        setTimeout(injectOptimizeButton, 2000);
    }
}

// Start initialization
init();

console.log('YouTube content script loaded');
