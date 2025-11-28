/**
 * Quick Test Script - วางใน Console ของ Extension Popup
 * เพื่อทดสอบว่าแต่ละส่วนทำงานหรือไม่
 */

console.log('🧪 Starting Quick Test...\n');

// Test 1: ตรวจสอบ Extension
console.log('Test 1: Extension Check');
console.log('Extension ID:', chrome.runtime.id);
console.log('Manifest:', chrome.runtime.getManifest().name, 'v' + chrome.runtime.getManifest().version);
console.log('✅ Extension OK\n');

// Test 2: ตรวจสอบ Storage
console.log('Test 2: Storage Check');
chrome.storage.local.get(null, (data) => {
    console.log('Storage data:', data);
    if (data.youtube_auth_token) {
        console.log('✅ Token found:', data.youtube_auth_token.substring(0, 20) + '...');
    } else {
        console.log('❌ No token found - Need to login');
    }
    console.log('');
});

// Test 3: ตรวจสอบ Auth Status
console.log('Test 3: Auth Status Check');
chrome.runtime.sendMessage({ action: 'GET_AUTH_STATUS' }, (response) => {
    if (chrome.runtime.lastError) {
        console.log('❌ Error:', chrome.runtime.lastError.message);
    } else {
        console.log('Response:', response);
        if (response.isAuthenticated) {
            console.log('✅ Authenticated');
        } else {
            console.log('❌ Not authenticated - Need to login');
        }
    }
    console.log('');
});

// Test 4: ทดสอบ Get Videos (รอ 2 วินาที)
setTimeout(() => {
    console.log('Test 4: Get Videos Check');
    chrome.runtime.sendMessage({ action: 'GET_CHANNEL_VIDEOS', pageToken: null }, (response) => {
        if (chrome.runtime.lastError) {
            console.log('❌ Error:', chrome.runtime.lastError.message);
        } else {
            console.log('Response:', response);
            if (response && response.success) {
                console.log('✅ Videos loaded:', response.videos.length, 'videos');
                if (response.videos.length > 0) {
                    console.log('First video:', response.videos[0]);
                }
            } else {
                console.log('❌ Failed to load videos');
                console.log('Error:', response.error);
            }
        }
        console.log('');
        console.log('🏁 Quick Test Complete!');
    });
}, 2000);

console.log('⏳ Running tests... (wait 2 seconds)\n');
