/**
 * Enhanced Popup Script for YouTube AI Optimizer
 * Handles UI interactions, authentication, and real-time progress monitoring
 */

import CONFIG from './config.js';
import * as utils from './utils.js';

// DOM elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const optimizeBtn = document.getElementById('optimizeBtn');
const refreshBtn = document.getElementById('refreshBtn');
const selectAllBtn = document.getElementById('selectAllBtn');
const deselectAllBtn = document.getElementById('deselectAllBtn');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const authSection = document.getElementById('authSection');
const mainSection = document.getElementById('mainSection');
const statusMessage = document.getElementById('statusMessage');
const videoList = document.getElementById('videoList');
const videoCount = document.getElementById('videoCount');
const selectedCount = document.getElementById('selectedCount');
const optimizeCount = document.getElementById('optimizeCount');
const searchBox = document.getElementById('searchBox');
const loadMoreContainer = document.getElementById('loadMoreContainer');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const autoCloseTabs = document.getElementById('autoCloseTabs');
const notifyOnComplete = document.getElementById('notifyOnComplete');

let allVideos = [];
let displayedVideos = [];
let selectedVideos = [];
let isProcessing = false;
let progressInterval = null;
let nextPageToken = null;
let isLoadingMore = false;

/**
 * Show detailed error notification
 */
function showDetailedError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    
    let errorTitle = 'เกิดข้อผิดพลาด';
    let errorMessage = error.message || 'Unknown error';
    let errorSolution = '';
    let errorType = 'error';
    let showGuideLink = false;

    // Analyze error and provide solution
    if (errorMessage.includes('OAuth') || errorMessage.includes('bad client')) {
        errorTitle = '❌ OAuth Configuration Error';
        errorMessage = 'OAuth Client ID ไม่ถูกต้อง หรือเป็น Web Application แทน Chrome Extension';
        errorSolution = `
            💡 วิธีแก้แบบเร็ว:<br>
            1. ไปที่ <a href="https://console.cloud.google.com/apis/credentials" target="_blank">Google Cloud Console</a><br>
            2. สร้าง OAuth Client ID แบบ <strong>Chrome Extension</strong> (ไม่ใช่ Web App!)<br>
            3. ใส่ Extension ID: <code>${chrome.runtime.id}</code><br>
            4. คัดลอก Client ID ใหม่<br>
            5. แก้ไข manifest.json<br>
            6. Reload Extension แล้ว Login ใหม่
        `;
        showGuideLink = true;
    } else if (errorMessage.includes('Not authenticated') || errorMessage.includes('not signed in') || errorMessage.includes('user is not signed')) {
        errorTitle = '❌ ไม่สามารถเข้าสู่ระบบได้';
        errorMessage = 'OAuth configuration อาจไม่ถูกต้อง หรือ Extension ID ไม่ตรงกัน';
        errorSolution = `
            💡 วิธีแก้:<br>
            1. ตรวจสอบว่าสร้าง OAuth Client แบบ <strong>Chrome Extension</strong><br>
            2. ตรวจสอบว่า Extension ID ตรงกัน: <code>${chrome.runtime.id}</code><br>
            3. ตรวจสอบว่า OAuth Consent Screen setup แล้ว<br>
            4. เพิ่ม email ของคุณใน Test users
        `;
        showGuideLink = true;
        errorType = 'warning';
    } else if (errorMessage.includes('No channel found')) {
        errorTitle = '❌ ไม่พบ YouTube Channel';
        errorMessage = 'บัญชี Google ของคุณยังไม่มี YouTube Channel';
        errorSolution = '💡 วิธีแก้: ไปที่ <a href="https://youtube.com" target="_blank">youtube.com</a> และสร้าง Channel ก่อน';
    } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        errorTitle = '❌ Token หมดอายุ';
        errorMessage = 'การเข้าสู่ระบบหมดอายุแล้ว';
        errorSolution = '💡 วิธีแก้: กรุณา Logout แล้ว Login ใหม่อีกครั้ง';
    } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
        errorTitle = '❌ ไม่มีสิทธิ์เข้าถึง API';
        errorMessage = 'YouTube Data API ไม่ได้เปิดใช้งาน หรือไม่มีสิทธิ์';
        errorSolution = '💡 วิธีแก้: ไปที่ <a href="https://console.cloud.google.com/apis/library" target="_blank">Google Cloud Console</a> เปิด YouTube Data API v3';
    } else if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
        errorTitle = '❌ ปัญหาการเชื่อมต่อ';
        errorMessage = 'ไม่สามารถเชื่อมต่อกับ YouTube API ได้';
        errorSolution = '💡 วิธีแก้: ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต';
    } else if (errorMessage.includes('quota')) {
        errorTitle = '❌ API Quota เกิน';
        errorMessage = 'ใช้ YouTube API เกิน quota ที่กำหนด';
        errorSolution = '💡 วิธีแก้: รอ 24 ชั่วโมง หรือเพิ่ม quota ใน Google Cloud Console';
    } else if (errorMessage.includes('cancelled')) {
        errorTitle = '⚠️ ยกเลิกการ Login';
        errorMessage = 'คุณยกเลิกการเข้าสู่ระบบ';
        errorSolution = '💡 วิธีแก้: ลอง Login อีกครั้งและอนุญาตสิทธิ์ทั้งหมด';
        errorType = 'warning';
    }

    // Create error notification element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <div class="error-header">${errorTitle}</div>
        <div class="error-body">
            <p><strong>ข้อผิดพลาด:</strong> ${errorMessage}</p>
            ${errorSolution ? `<div class="error-solution">${errorSolution}</div>` : ''}
            ${showGuideLink ? `
                <div style="margin-top: 10px; padding: 10px; background: #fff3cd; border-radius: 4px;">
                    📖 <strong>คู่มือแก้ปัญหา:</strong><br>
                    <a href="#" onclick="alert('เปิดไฟล์ QUICK_FIX_LOGIN.md ในโปรเจค'); return false;" style="color: #0066cc;">
                        QUICK_FIX_LOGIN.md - แก้ปัญหาแบบเร็ว (5 นาที)
                    </a>
                </div>
            ` : ''}
            ${context ? `<p class="error-context"><small>Context: ${context}</small></p>` : ''}
        </div>
        <button class="error-close" onclick="this.parentElement.remove()">✕</button>
    `;
    
    // Add to page
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(errorDiv, container.firstChild);
        
        // Auto remove after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 10000);
    }

    // Also update status message
    updateStatus(`${errorTitle}: ${errorMessage}`, errorType);
}

/**
 * Initialize popup
 */
async function initPopup() {
    console.log('Popup initialized');

    try {
        // Show loading state
        updateStatus('กำลังเริ่มต้น Extension...', 'info');
        
        // Check authentication
        await checkAuthStatus();

        // Load settings
        await loadSettings();

        // Setup event listeners
        setupEventListeners();

        // Listen for background updates
        chrome.runtime.onMessage.addListener(handleBackgroundMessage);

        console.log('✅ Popup initialized successfully');
    } catch (error) {
        console.error('❌ Initialization error:', error);
        showDetailedError(error, 'Popup Initialization');
        updateStatus(`ไม่สามารถเริ่มต้น Extension ได้: ${error.message}`, 'error');
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    loginBtn.addEventListener('click', handleLogin);
    logoutBtn?.addEventListener('click', handleLogout);
    optimizeBtn?.addEventListener('click', handleOptimize);
    refreshBtn?.addEventListener('click', refreshVideoList);
    selectAllBtn?.addEventListener('click', selectAllVideos);
    deselectAllBtn?.addEventListener('click', deselectAllVideos);
    loadMoreBtn?.addEventListener('click', loadMoreVideos);
    searchBox?.addEventListener('input', handleSearch);
    autoCloseTabs?.addEventListener('change', saveSettings);
    notifyOnComplete?.addEventListener('change', saveSettings);
    
    // Debug Tools Event Listeners
    const diagnoseBtn = document.getElementById('diagnoseBtn');
    const forceLoginBtn = document.getElementById('forceLoginBtn');
    const ultimateFixBtn = document.getElementById('ultimateFixBtn');
    const debugInfoBtn = document.getElementById('debugInfoBtn');
    
    if (diagnoseBtn) {
        diagnoseBtn.addEventListener('click', () => {
            console.log('🔍 Diagnose button clicked');
            diagnoseAndFix();
        });
    }
    
    if (forceLoginBtn) {
        forceLoginBtn.addEventListener('click', () => {
            console.log('🚀 Force Login button clicked');
            forceLogin();
        });
    }
    
    if (ultimateFixBtn) {
        ultimateFixBtn.addEventListener('click', () => {
            console.log('🔥 Ultimate Fix button clicked');
            ultimateOAuthFix();
        });
    }
    
    if (debugInfoBtn) {
        debugInfoBtn.addEventListener('click', () => {
            console.log('📊 Debug Info button clicked');
            showDebugInfo();
        });
    }
}

/**
 * Check authentication status
 */
async function checkAuthStatus() {
    try {
        console.log('Checking authentication status...');
        const response = await sendMessage({ action: 'GET_AUTH_STATUS' });
        console.log('Auth status response:', response);

        if (response && response.isAuthenticated) {
            console.log('✅ User is authenticated');
            showMainSection();
            updateStatus('กำลังโหลดวิดีโอ...', 'info');
            await refreshVideoList();
        } else {
            console.log('❌ User is not authenticated');
            showAuthSection();
            updateStatus('กรุณา Login เพื่อเริ่มใช้งาน', 'info');
        }
    } catch (error) {
        console.error('❌ Auth check error:', error);
        showDetailedError(error, 'Authentication Check');
        showAuthSection();
        updateStatus('ไม่สามารถตรวจสอบสถานะการเข้าสู่ระบบได้', 'error');
    }
}

/**
 * Handle login
 */
async function handleLogin() {
    loginBtn.disabled = true;
    loginBtn.textContent = 'กำลัง Login...';
    updateStatus('กำลังเข้าสู่ระบบ...', 'info');

    try {
        console.log('🔐 Starting login process...');
        const response = await sendMessage({ action: 'LOGIN' });
        console.log('Login response:', response);

        if (response && response.success) {
            console.log('✅ Login successful');
            showMainSection();
            updateStatus('✅ Login สำเร็จ! กำลังโหลดวิดีโอ...', 'success');
            
            // Small delay before loading videos
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('📺 Loading videos...');
            await refreshVideoList();
        } else {
            const errorMsg = response?.error || 'Unknown error';
            console.error('❌ Login failed:', errorMsg);
            showDetailedError(new Error(errorMsg), 'Login');
            updateStatus(`❌ Login ล้มเหลว: ${errorMsg}`, 'error');
            showAuthSection();
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        showDetailedError(error, 'Login Process');
        updateStatus(`❌ เกิดข้อผิดพลาดในการ Login: ${error.message}`, 'error');
        showAuthSection();
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login with Google';
    }
}

/**
 * Handle logout
 */
async function handleLogout() {
    logoutBtn.disabled = true;

    try {
        const response = await sendMessage({ action: 'LOGOUT' });

        if (response.success) {
            updateStatus(CONFIG.SUCCESS.LOGOUT, 'info');
            showAuthSection();
        } else {
            updateStatus(`Logout failed: ${response.error}`, 'error');
        }
    } catch (error) {
        updateStatus(`Logout error: ${error.message}`, 'error');
    } finally {
        logoutBtn.disabled = false;
    }
}

/**
 * Handle optimize button click
 */
async function handleOptimize() {
    // Get checked videos
    const checkedBoxes = videoList.querySelectorAll('input[type="checkbox"]:checked');
    const videoIds = Array.from(checkedBoxes).map(cb => cb.id.replace('video-', ''));
    
    if (videoIds.length === 0) {
        updateStatus('Please select at least one video', 'warning');
        return;
    }

    optimizeBtn.disabled = true;
    isProcessing = true;

    try {
        const response = await sendMessage({
            action: 'START_OPTIMIZATION',
            videoIds: videoIds
        });

        if (response.success) {
            updateStatus(`Starting optimization for ${videoIds.length} video(s)...`, 'info');
            showProgressBar();
            monitorProgress();
        } else {
            updateStatus(`Optimization failed: ${response.error}`, 'error');
            optimizeBtn.disabled = false;
            isProcessing = false;
        }
    } catch (error) {
        updateStatus(`Error: ${error.message}`, 'error');
        optimizeBtn.disabled = false;
        isProcessing = false;
    }
}

/**
 * Refresh video list
 */
async function refreshVideoList() {
    try {
        console.log('📺 refreshVideoList called');
        updateStatus('<span class="loading-spinner"></span> กำลังโหลดวิดีโอ...', 'info');
        
        if (refreshBtn) {
            refreshBtn.disabled = true;
        }
        
        // Reset state
        allVideos = [];
        displayedVideos = [];
        nextPageToken = null;
        
        // Clear video list with loading state
        videoList.innerHTML = `
            <div class="empty-message">
                <div class="loading-spinner" style="width: 32px; height: 32px; margin: 0 auto 10px;"></div>
                <p>กำลังโหลดวิดีโอจาก YouTube...</p>
            </div>
        `;
        
        console.log('📤 Sending GET_CHANNEL_VIDEOS message...');
        
        // Get videos from YouTube API
        const response = await sendMessage({ 
            action: 'GET_CHANNEL_VIDEOS',
            pageToken: null
        });

        console.log('📥 GET_CHANNEL_VIDEOS response:', response);

        if (!response) {
            throw new Error('ไม่ได้รับ response จาก background script');
        }

        if (response.success && response.videos && response.videos.length > 0) {
            console.log(`✅ Found ${response.videos.length} videos`);
            allVideos = response.videos;
            nextPageToken = response.nextPageToken;
            
            displayVideos(allVideos);
            videoCount.textContent = allVideos.length;
            
            // Show load more button if there are more videos
            if (nextPageToken) {
                loadMoreContainer.style.display = 'block';
            } else {
                loadMoreContainer.style.display = 'none';
            }
            
            updateStatus(`✅ โหลดวิดีโอสำเร็จ ${allVideos.length} รายการ`, 'success');
        } else if (!response.success) {
            const errorMsg = response.error || 'ไม่สามารถโหลดวิดีโอได้';
            console.error('❌ API Error:', errorMsg);
            
            showDetailedError(new Error(errorMsg), 'Load Videos');
            
            videoList.innerHTML = `
                <div class="empty-message">
                    <p style="color: #f44336;">❌ ${errorMsg}</p>
                    <button onclick="location.reload()" class="btn btn-secondary" style="margin-top: 10px;">
                        🔄 ลองใหม่อีกครั้ง
                    </button>
                </div>
            `;
            videoCount.textContent = '0';
            updateStatus(`❌ ${errorMsg}`, 'error');
        } else {
            console.warn('⚠️ No videos found');
            videoList.innerHTML = `
                <div class="empty-message">
                    <p>ไม่พบวิดีโอใน Channel ของคุณ</p>
                    <p style="font-size: 11px; color: #999; margin-top: 5px;">
                        ลอง upload วิดีโอใหม่แล้วกด Refresh
                    </p>
                </div>
            `;
            videoCount.textContent = '0';
            updateStatus('⚠️ ไม่พบวิดีโอใน Channel', 'warning');
        }
    } catch (error) {
        console.error('❌ Error refreshing videos:', error);
        
        showDetailedError(error, 'Refresh Video List');
        
        videoList.innerHTML = `
            <div class="empty-message">
                <p style="color: #f44336;">❌ เกิดข้อผิดพลาด</p>
                <p style="font-size: 11px; margin-top: 5px;">${error.message}</p>
                <button onclick="location.reload()" class="btn btn-secondary" style="margin-top: 10px;">
                    🔄 ลองใหม่อีกครั้ง
                </button>
            </div>
        `;
        videoCount.textContent = '0';
        updateStatus(`❌ เกิดข้อผิดพลาด: ${error.message}`, 'error');
    } finally {
        if (refreshBtn) {
            refreshBtn.disabled = false;
        }
    }
}

/**
 * Load more videos
 */
async function loadMoreVideos() {
    if (isLoadingMore || !nextPageToken) return;
    
    try {
        isLoadingMore = true;
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = 'Loading...';
        
        const response = await sendMessage({ 
            action: 'GET_CHANNEL_VIDEOS',
            pageToken: nextPageToken
        });

        if (response.success && response.videos.length > 0) {
            allVideos = [...allVideos, ...response.videos];
            nextPageToken = response.nextPageToken;
            
            displayVideos(response.videos, true);
            videoCount.textContent = allVideos.length;
            
            // Hide load more button if no more videos
            if (!nextPageToken) {
                loadMoreContainer.style.display = 'none';
            }
            
            updateStatus(`Loaded ${allVideos.length} videos total`, 'success');
        } else {
            loadMoreContainer.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading more videos:', error);
        updateStatus(`Error: ${error.message}`, 'error');
    } finally {
        isLoadingMore = false;
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Load More Videos';
    }
}

/**
 * Display videos in list
 */
function displayVideos(videos, append = false) {
    if (!append) {
        videoList.innerHTML = '';
    }

    if (videos.length === 0 && !append) {
        videoList.innerHTML = '<p class="empty-message">No videos found</p>';
        return;
    }

    videos.forEach((video, index) => {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        videoItem.dataset.videoId = video.videoId;
        videoItem.dataset.title = video.title.toLowerCase();
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = false;
        checkbox.id = `video-${video.videoId}`;
        checkbox.addEventListener('change', updateSelectedCount);
        
        videoItem.innerHTML = `
            <label for="video-${video.videoId}" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <div style="flex-shrink: 0;"></div>
                <img src="${video.thumbnail}" alt="thumbnail" style="width: 80px; height: 45px; object-fit: cover; border-radius: 4px;">
                <div style="flex: 1; min-width: 0;">
                    <div class="video-title" style="font-weight: 500;">${utils.truncateText(video.title, 40)}</div>
                    <div class="video-id" style="font-size: 11px; color: #666;">${video.videoId} • ${video.publishedAt}</div>
                </div>
            </label>
        `;
        
        videoItem.querySelector('div').prepend(checkbox);
        videoList.appendChild(videoItem);
    });

    displayedVideos = append ? [...displayedVideos, ...videos] : videos;
    updateSelectedCount();
}

/**
 * Update selected count display
 */
function updateSelectedCount() {
    const checkedBoxes = videoList.querySelectorAll('input[type="checkbox"]:checked');
    const count = checkedBoxes.length;
    
    selectedCount.textContent = `${count} video${count !== 1 ? 's' : ''} selected`;
    optimizeCount.textContent = count;
    optimizeBtn.disabled = count === 0;
}

/**
 * Select all videos
 */
function selectAllVideos() {
    const checkboxes = videoList.querySelectorAll('input[type="checkbox"]:not(:checked)');
    checkboxes.forEach(cb => cb.checked = true);
    updateSelectedCount();
}

/**
 * Deselect all videos
 */
function deselectAllVideos() {
    const checkboxes = videoList.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(cb => cb.checked = false);
    updateSelectedCount();
}

/**
 * Handle search
 */
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    const videoItems = videoList.querySelectorAll('.video-item');
    
    videoItems.forEach(item => {
        const title = item.dataset.title || '';
        const videoId = item.dataset.videoId || '';
        
        if (title.includes(searchTerm) || videoId.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Monitor optimization progress
 */
function monitorProgress() {
    if (progressInterval) {
        clearInterval(progressInterval);
    }

    progressInterval = setInterval(async () => {
        try {
            const response = await sendMessage({ action: 'GET_OPTIMIZATION_STATUS' });

            if (!response.isProcessing) {
                clearInterval(progressInterval);
                hideProgressBar();
                optimizeBtn.disabled = false;
                isProcessing = false;
                updateStatus('All videos optimized successfully!', 'success');
                return;
            }

            // Update progress bar
            const total = response.queue.length;
            const completed = response.queue.filter(v => v.status === 'completed').length;
            const percentage = (completed / total) * 100;

            progressFill.style.width = percentage + '%';
            progressText.textContent = `${completed}/${total} videos completed`;

            if (response.currentVideo) {
                updateStatus(`Processing: ${response.currentVideo.videoId}`, 'info');
            }
        } catch (error) {
            console.error('Error monitoring progress:', error);
            clearInterval(progressInterval);
        }
    }, CONFIG.UI.PROGRESS_UPDATE_INTERVAL);
}

/**
 * Show progress bar
 */
function showProgressBar() {
    progressBar.style.display = 'block';
    progressText.style.display = 'block';
    progressFill.style.width = '0%';
}

/**
 * Hide progress bar
 */
function hideProgressBar() {
    progressBar.style.display = 'none';
    progressText.style.display = 'none';
}

/**
 * Update status message
 */
function updateStatus(message, type = 'info') {
    // Support HTML content
    if (message.includes('<')) {
        statusMessage.innerHTML = message;
    } else {
        statusMessage.textContent = message;
    }
    
    statusMessage.className = 'status-message';

    if (type === 'error') {
        statusMessage.classList.add('error');
    } else if (type === 'warning') {
        statusMessage.classList.add('warning');
    } else if (type === 'success') {
        statusMessage.classList.add('success');
    } else if (type === 'info') {
        statusMessage.classList.add('info');
    }

    // Auto-clear after duration (except for errors)
    if (type !== 'error') {
        setTimeout(() => {
            if (statusMessage.textContent === message || statusMessage.innerHTML === message) {
                statusMessage.textContent = 'พร้อมใช้งาน';
                statusMessage.className = 'status-message info';
            }
        }, CONFIG.UI.STATUS_MESSAGE_DURATION);
    }
}

/**
 * Show main section
 */
function showMainSection() {
    authSection.style.display = 'none';
    mainSection.style.display = 'block';
}

/**
 * Show auth section
 */
function showAuthSection() {
    authSection.style.display = 'flex';
    mainSection.style.display = 'none';
}

/**
 * Load settings from storage
 */
async function loadSettings() {
    const result = await chrome.storage.local.get(CONFIG.STORAGE.SETTINGS);
    const settings = result[CONFIG.STORAGE.SETTINGS] || CONFIG.DEFAULT_SETTINGS;

    autoCloseTabs.checked = settings.autoCloseTabs !== false;
    notifyOnComplete.checked = settings.notifyOnComplete !== false;
}

/**
 * Save settings to storage
 */
function saveSettings() {
    const settings = {
        autoCloseTabs: autoCloseTabs.checked,
        notifyOnComplete: notifyOnComplete.checked
    };

    chrome.storage.local.set({ [CONFIG.STORAGE.SETTINGS]: settings });
}

/**
 * Handle messages from background script
 */
function handleBackgroundMessage(request, sender, sendResponse) {
    if (request.action === 'STATUS_UPDATE') {
        updateStatus(request.message, request.type);
    }
}

/**
 * Send message to background script
 */
function sendMessage(message) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }
            resolve(response);
        });
    });
}

/**
 * Show debug info (for development)
 */
function showDebugInfo() {
    console.log('=== DEBUG INFO ===');
    console.log('Extension ID:', chrome.runtime.id);
    console.log('Manifest:', chrome.runtime.getManifest());
    
    chrome.storage.local.get(null, (data) => {
        console.log('Storage:', data);
    });
    
    chrome.runtime.sendMessage({ action: 'GET_AUTH_STATUS' }, (response) => {
        console.log('Auth Status:', response);
    });
    
    console.log('==================');
}

/**
 * Comprehensive OAuth Diagnosis and Auto-Fix
 */
async function diagnoseAndFix() {
    console.log('🔍 เริ่มวินิจฉัยและแก้ไขปัญหา OAuth...\n');
    
    const results = {
        extensionInfo: null,
        oauthConfig: null,
        permissions: null,
        storage: null,
        identityAPI: null,
        actualLogin: null
    };
    
    // Test 1: Extension Info
    console.log('📋 Test 1: Extension Information');
    try {
        results.extensionInfo = {
            id: chrome.runtime.id,
            name: chrome.runtime.getManifest().name,
            version: chrome.runtime.getManifest().version
        };
        console.log('✅ Extension ID:', results.extensionInfo.id);
        console.log('✅ Name:', results.extensionInfo.name);
        console.log('✅ Version:', results.extensionInfo.version);
    } catch (error) {
        console.error('❌ Extension Info Error:', error.message);
        return;
    }
    
    // Test 2: OAuth Configuration
    console.log('\n🔐 Test 2: OAuth Configuration');
    try {
        const manifest = chrome.runtime.getManifest();
        results.oauthConfig = manifest.oauth2;
        
        if (!results.oauthConfig) {
            console.error('❌ ไม่พบ oauth2 configuration ใน manifest.json');
            showAutoFix('oauth_missing');
            return;
        }
        
        console.log('✅ Client ID:', results.oauthConfig.client_id);
        console.log('✅ Scopes:', results.oauthConfig.scopes);
        
        // Validate Client ID
        if (!results.oauthConfig.client_id || !results.oauthConfig.client_id.includes('.apps.googleusercontent.com')) {
            console.error('❌ Client ID ไม่ถูกต้อง');
            showAutoFix('client_id_invalid', results.extensionInfo.id);
            return;
        }
        
        // Validate Scopes
        const requiredScopes = [
            'https://www.googleapis.com/auth/youtube.force-ssl',
            'https://www.googleapis.com/auth/youtube.upload'
        ];
        const missingScopes = requiredScopes.filter(scope => !results.oauthConfig.scopes.includes(scope));
        if (missingScopes.length > 0) {
            console.error('❌ ขาด scopes:', missingScopes);
            showAutoFix('scopes_missing', null, missingScopes);
            return;
        }
        
    } catch (error) {
        console.error('❌ OAuth Config Error:', error.message);
        return;
    }
    
    // Test 3: Permissions
    console.log('\n🔑 Test 3: Permissions');
    try {
        const permissions = chrome.runtime.getManifest().permissions;
        results.permissions = permissions;
        
        const requiredPerms = ['identity', 'storage'];
        const missingPerms = requiredPerms.filter(perm => !permissions.includes(perm));
        
        if (missingPerms.length > 0) {
            console.error('❌ ขาด permissions:', missingPerms);
            showAutoFix('permissions_missing', null, null, missingPerms);
            return;
        }
        
        console.log('✅ Permissions ครบถ้วน:', permissions);
    } catch (error) {
        console.error('❌ Permissions Error:', error.message);
        return;
    }
    
    // Test 4: Storage Check
    console.log('\n💾 Test 4: Storage & Token');
    try {
        const storageData = await new Promise(resolve => {
            chrome.storage.local.get('youtube_auth_token', resolve);
        });
        
        results.storage = storageData;
        
        if (storageData.youtube_auth_token) {
            console.log('✅ มี Token ใน Storage:', storageData.youtube_auth_token.substring(0, 30) + '...');
        } else {
            console.log('⚠️ ไม่มี Token (ยังไม่เคย login สำเร็จ)');
        }
    } catch (error) {
        console.error('❌ Storage Error:', error.message);
    }
    
    // Test 5: Identity API (Non-Interactive)
    console.log('\n🔍 Test 5: Identity API Test');
    try {
        const tokenResult = await new Promise(resolve => {
            chrome.identity.getAuthToken({ interactive: false }, (token) => {
                resolve({
                    token: token,
                    error: chrome.runtime.lastError?.message
                });
            });
        });
        
        results.identityAPI = tokenResult;
        
        if (tokenResult.error) {
            console.error('❌ Identity API Error:', tokenResult.error);
            analyzeAndFixError(tokenResult.error, results.extensionInfo.id);
        } else if (tokenResult.token) {
            console.log('✅ Identity API ทำงานได้! Token:', tokenResult.token.substring(0, 30) + '...');
            console.log('🎉 OAuth configuration ถูกต้องแล้ว!');
        } else {
            console.log('⚠️ ไม่มี cached token - ต้อง login แบบ interactive');
            console.log('💡 ลองคลิกปุ่ม Login with Google ใน Extension');
        }
    } catch (error) {
        console.error('❌ Identity API Error:', error.message);
    }
    
    // Summary
    console.log('\n📊 สรุปผลการวินิจฉัย:');
    console.log('Extension Info:', results.extensionInfo ? '✅' : '❌');
    console.log('OAuth Config:', results.oauthConfig ? '✅' : '❌');
    console.log('Permissions:', results.permissions ? '✅' : '❌');
    console.log('Storage:', results.storage ? '✅' : '❌');
    console.log('Identity API:', results.identityAPI?.error ? '❌' : '✅');
    
    return results;
}

/**
 * Analyze error and provide auto-fix solutions
 */
function analyzeAndFixError(error, extensionId) {
    console.log('\n🔧 วิเคราะห์ Error และแนะนำการแก้ไข:');
    
    if (error.includes('OAuth2') || error.includes('bad client')) {
        console.error('❌ สาเหตุ: OAuth Client ID ไม่ถูกต้อง');
        showAutoFix('oauth_client_error', extensionId);
    } else if (error.includes('not signed in') || error.includes('user is not signed')) {
        console.error('❌ สาเหตุ: OAuth Consent Screen ไม่ได้ setup หรือ Test users ไม่ได้เพิ่ม');
        showAutoFix('consent_screen_error', extensionId);
    } else if (error.includes('cancelled')) {
        console.error('⚠️ สาเหตุ: ผู้ใช้ยกเลิกการ login');
        console.log('💡 วิธีแก้: ลอง login อีกครั้งและอนุญาตสิทธิ์ทั้งหมด');
    } else if (error.includes('network')) {
        console.error('❌ สาเหตุ: ปัญหาการเชื่อมต่ออินเทอร์เน็ต');
        console.log('💡 วิธีแก้: ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
    } else {
        console.error('❌ สาเหตุ:', error);
        console.log('💡 วิธีแก้: ดูคู่มือ SETUP_OAUTH_STEP_BY_STEP.md');
    }
}

/**
 * Show auto-fix solutions
 */
function showAutoFix(errorType, extensionId, missingItems, missingPerms) {
    console.log('\n🛠️ วิธีแก้ไขอัตโนมัติ:');
    
    switch (errorType) {
        case 'oauth_client_error':
            console.log(`
🔧 OAuth Client ID Error - วิธีแก้:

1. ไปที่: https://console.cloud.google.com/apis/credentials
2. คลิก: + CREATE CREDENTIALS > OAuth client ID
3. Application type: เลือก "Chrome Extension" (ไม่ใช่ Web Application!)
4. Name: YouTube AI Optimizer
5. Application ID: ${extensionId}
6. คลิก: CREATE
7. คัดลอก Client ID ที่ได้
8. แก้ไข manifest.json:

{
  "oauth2": {
    "client_id": "YOUR_NEW_CLIENT_ID.apps.googleusercontent.com",
    "scopes": [
      "https://www.googleapis.com/auth/youtube.force-ssl",
      "https://www.googleapis.com/auth/youtube.upload"
    ]
  }
}

9. Reload Extension ที่ chrome://extensions/
10. Login ใหม่
            `);
            break;
            
        case 'consent_screen_error':
            console.log(`
🔧 OAuth Consent Screen Error - วิธีแก้:

1. ไปที่: https://console.cloud.google.com/apis/credentials/consent
2. User Type: เลือก "External"
3. App Information:
   - App name: YouTube AI Optimizer
   - User support email: [your-email@gmail.com]
   - Developer contact: [your-email@gmail.com]
4. คลิก: SAVE AND CONTINUE
5. Scopes: คลิก "ADD OR REMOVE SCOPES"
   - เลือก: https://www.googleapis.com/auth/youtube.force-ssl
   - เลือก: https://www.googleapis.com/auth/youtube.upload
   - คลิก: UPDATE
6. คลิก: SAVE AND CONTINUE
7. Test users: คลิก "+ ADD USERS"
   - ใส่: [your-email@gmail.com] (email ที่จะใช้ login)
   - คลิก: ADD
8. คลิก: SAVE AND CONTINUE
9. รอ 2-3 นาที
10. Login ใหม่ใน Extension
            `);
            break;
            
        case 'oauth_missing':
            console.log(`
🔧 OAuth Configuration Missing - วิธีแก้:

เพิ่มโค้ดนี้ใน manifest.json:

{
  "oauth2": {
    "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
    "scopes": [
      "https://www.googleapis.com/auth/youtube.force-ssl",
      "https://www.googleapis.com/auth/youtube.upload"
    ]
  }
}

แล้ว Reload Extension
            `);
            break;
            
        case 'permissions_missing':
            console.log(`
🔧 Permissions Missing - วิธีแก้:

เพิ่ม permissions เหล่านี้ใน manifest.json:

"permissions": [
  "identity",
  "storage",
  ${missingPerms?.map(p => `"${p}"`).join(',\n  ') || ''}
]

แล้ว Reload Extension
            `);
            break;
    }
    
    console.log('\n📖 คู่มือเพิ่มเติม:');
    console.log('- SETUP_OAUTH_STEP_BY_STEP.md - คู่มือแบบละเอียด');
    console.log('- QUICK_FIX_LOGIN.md - แก้ปัญหาแบบเร็ว');
}

/**
 * Clear OAuth cache and reset everything
 */
async function clearOAuthCache() {
    console.log('\n🧹 เริ่มล้าง OAuth Cache และ Reset ทุกอย่าง...');
    
    try {
        // Show loading status
        updateStatus('🧹 กำลังล้าง OAuth Cache...', 'info');
        
        // Step 1: Clear storage
        console.log('1️⃣ ล้าง Chrome Storage...');
        await new Promise(resolve => {
            chrome.storage.local.clear(() => {
                console.log('✅ ล้าง storage แล้ว');
                resolve();
            });
        });
        
        // Step 2: Clear cached auth tokens
        console.log('2️⃣ ล้าง Cached Auth Tokens...');
        await new Promise(resolve => {
            chrome.identity.clearAllCachedAuthTokens(() => {
                console.log('✅ ล้าง cached tokens แล้ว');
                resolve();
            });
        });
        
        // Step 3: Wait a moment
        console.log('3️⃣ รอให้ระบบอัพเดท...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('✅ ล้าง OAuth Cache เสร็จสิ้น!');
        updateStatus('✅ ล้าง Cache เสร็จแล้ว - พร้อม Login ใหม่', 'success');
        
        return true;
    } catch (error) {
        console.error('❌ Error clearing cache:', error);
        updateStatus('❌ เกิดข้อผิดพลาดในการล้าง Cache', 'error');
        return false;
    }
}

/**
 * Ultimate OAuth Fix - สร้าง OAuth Client ใหม่
 */
async function ultimateOAuthFix() {
    console.log('\n🔥 เริ่ม Ultimate OAuth Fix...');
    
    const extensionId = chrome.runtime.id;
    const currentClientId = chrome.runtime.getManifest().oauth2?.client_id;
    
    console.log('📋 ข้อมูลปัจจุบัน:');
    console.log('Extension ID:', extensionId);
    console.log('Current Client ID:', currentClientId);
    
    updateStatus('🔥 Ultimate OAuth Fix - ต้องสร้าง OAuth Client ใหม่', 'warning');
    
    showDetailedError(new Error(`🔥 Ultimate OAuth Fix Required!

ปัญหา: OAuth Client ID มีปัญหาหรือไม่ตรงกับ Extension ID

🔧 วิธีแก้ (ทำตามทีละขั้น):

1️⃣ ลบ OAuth Client เก่า:
   - ไปที่: https://console.cloud.google.com/apis/credentials
   - หา Client ID: ${currentClientId}
   - คลิก Delete

2️⃣ สร้าง OAuth Client ใหม่:
   - คลิก: + CREATE CREDENTIALS > OAuth client ID
   - Application type: Chrome Extension (ไม่ใช่ Web Application!)
   - Name: YouTube AI Optimizer New
   - Application ID: ${extensionId}
   - คลิก: CREATE

3️⃣ คัดลอก Client ID ใหม่:
   - คัดลอก Client ID ที่ได้ (จะลงท้ายด้วย .apps.googleusercontent.com)

4️⃣ อัพเดท manifest.json:
   - เปิดไฟล์ manifest.json
   - แก้ไข client_id เป็นค่าใหม่:
   
   "oauth2": {
     "client_id": "CLIENT_ID_ใหม่.apps.googleusercontent.com",
     "scopes": [
       "https://www.googleapis.com/auth/youtube.force-ssl",
       "https://www.googleapis.com/auth/youtube.upload"
     ]
   }

5️⃣ Reload Extension:
   - ไปที่: chrome://extensions/
   - คลิก reload (🔄)

6️⃣ ทดสอบ Login:
   - คลิก Force Login อีกครั้ง

⚠️ สำคัญ: Extension ID ต้องเป็น ${extensionId} เท่านั้น!`), 'Ultimate OAuth Fix');
}

/**
 * Force login with comprehensive error handling
 */
async function forceLogin() {
    console.log('\n🚀 เริ่ม Force Login...');
    
    try {
        // Show loading status
        updateStatus('🚀 กำลัง Force Login...', 'info');
        
        // Step 1: Clear cache first
        console.log('1️⃣ ล้าง Cache ก่อน...');
        const cacheCleared = await clearOAuthCache();
        if (!cacheCleared) {
            throw new Error('ไม่สามารถล้าง Cache ได้');
        }
        
        // Step 2: Try login with interactive mode
        console.log('2️⃣ ทดสอบ Login แบบ Interactive...');
        updateStatus('🔐 กำลัง Login... กรุณารอ OAuth popup', 'info');
        
        const result = await new Promise(resolve => {
            chrome.identity.getAuthToken({ interactive: true }, (token) => {
                resolve({
                    token: token,
                    error: chrome.runtime.lastError?.message
                });
            });
        });
        
        if (result.error) {
            console.error('❌ Force Login ล้มเหลว!');
            console.error('Error:', result.error);
            
            // Count failed attempts
            const failedAttempts = (localStorage.getItem('oauth_failed_attempts') || 0) + 1;
            localStorage.setItem('oauth_failed_attempts', failedAttempts);
            
            console.log(`🔢 Failed attempts: ${failedAttempts}`);
            
            // After 3 failed attempts, suggest ultimate fix
            if (failedAttempts >= 3) {
                console.log('🔥 หลังจากพยายาม 3 ครั้งแล้ว - แนะนำ Ultimate Fix');
                localStorage.removeItem('oauth_failed_attempts');
                ultimateOAuthFix();
                return;
            }
            
            // Analyze error and provide specific solutions
            if (result.error.includes('not granted') || result.error.includes('revoked')) {
                updateStatus('❌ OAuth ถูก revoke - ต้องลบ permission ใน Google Account', 'error');
                showDetailedError(new Error(`OAuth Permission ถูก Revoke

🔧 วิธีแก้:
1. ไปที่ https://myaccount.google.com/permissions
2. หา "YouTube AI Optimizer" หรือ "Banchert"
3. คลิก Remove access
4. กลับมาคลิก Force Login อีกครั้ง
5. อนุญาตสิทธิ์ทั้งหมด`), 'Force Login');
            } else if (result.error.includes('not signed in')) {
                updateStatus('❌ OAuth Consent Screen มีปัญหา', 'error');
                showDetailedError(new Error(`OAuth Consent Screen Error

🔧 วิธีแก้:
1. ไปที่ https://console.cloud.google.com/apis/credentials/consent
2. ตรวจสอบว่าเป็น Testing mode
3. ตรวจสอบว่า Test users มี email ที่ใช้ login
4. รอ 10-15 นาที แล้วลองใหม่
5. หรือคลิก "🔥 Ultimate Fix" ถ้ายังไม่ได้`), 'Force Login');
            } else {
                analyzeAndFixError(result.error, chrome.runtime.id);
            }
        } else if (result.token) {
            console.log('✅ Force Login สำเร็จ!');
            console.log('Token:', result.token.substring(0, 30) + '...');
            
            // Clear failed attempts
            localStorage.removeItem('oauth_failed_attempts');
            
            // Save token
            await new Promise(resolve => {
                chrome.storage.local.set({ youtube_auth_token: result.token }, () => {
                    console.log('✅ บันทึก Token แล้ว');
                    resolve();
                });
            });
            
            console.log('\n🎉 ทุกอย่างทำงานได้แล้ว!');
            console.log('คุณสามารถใช้ Extension ได้แล้ว');
            
            // Update UI
            updateStatus('✅ Login สำเร็จ! กำลังโหลดวิดีโอ...', 'success');
            showMainSection();
            await refreshVideoList();
        } else {
            console.log('⚠️ ไม่ได้รับ Token');
            updateStatus('⚠️ ไม่ได้รับ Token - ลองใหม่อีกครั้ง', 'warning');
        }
    } catch (error) {
        console.error('❌ Force Login Error:', error.message);
        updateStatus('❌ Force Login ล้มเหลว: ' + error.message, 'error');
        showDetailedError(error, 'Force Login');
    }
}

/**
 * Test login with detailed feedback
 */
async function testLoginNow() {
    console.log('\n🔐 ทดสอบ Login แบบ Interactive...');
    
    try {
        const result = await new Promise(resolve => {
            chrome.identity.getAuthToken({ interactive: true }, (token) => {
                resolve({
                    token: token,
                    error: chrome.runtime.lastError?.message
                });
            });
        });
        
        if (result.error) {
            console.error('❌ Login ล้มเหลว!');
            console.error('Error:', result.error);
            analyzeAndFixError(result.error, chrome.runtime.id);
        } else if (result.token) {
            console.log('✅ Login สำเร็จ!');
            console.log('Token:', result.token.substring(0, 30) + '...');
            
            // Save token
            chrome.storage.local.set({ youtube_auth_token: result.token }, () => {
                console.log('✅ บันทึก Token แล้ว');
            });
            
            console.log('\n🎉 ทุกอย่างทำงานได้แล้ว!');
            console.log('คุณสามารถใช้ Extension ได้แล้ว');
            
            // Update UI
            updateStatus('✅ Login สำเร็จ! กำลังโหลดวิดีโอ...', 'success');
            showMainSection();
            await refreshVideoList();
        } else {
            console.log('⚠️ ไม่ได้รับ Token');
        }
    } catch (error) {
        console.error('❌ Login Error:', error.message);
    }
}

// Make functions available globally
window.showDebugInfo = showDebugInfo;
window.diagnoseAndFix = diagnoseAndFix;
window.testLoginNow = testLoginNow;
window.clearOAuthCache = clearOAuthCache;
window.forceLogin = forceLogin;
window.ultimateOAuthFix = ultimateOAuthFix;

/**
 * Initialize on page load
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPopup);
} else {
    initPopup();
}

console.log('✅ Enhanced popup script loaded');
console.log('💡 Tip: พิมพ์ showDebugInfo() ใน Console เพื่อดูข้อมูล debug');
