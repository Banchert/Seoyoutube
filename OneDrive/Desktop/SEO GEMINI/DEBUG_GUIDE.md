# 🐛 คู่มือ Debug - YouTube AI Optimizer Extension

## ปัญหา: Login ได้แต่ไม่แสดงวิดีโอ

### ขั้นตอนการ Debug

#### 1. เปิด DevTools ของ Extension Popup
```
1. คลิกขวาที่ Extension popup
2. เลือก "Inspect" หรือ "ตรวจสอบ"
3. ดูที่แท็บ "Console"
```

#### 2. ตรวจสอบ Console Logs
หลังจากคลิก Login ควรเห็น logs ดังนี้:

```javascript
Starting login process...
Login response: {success: true, message: "..."}
Login successful, showing main section
Calling refreshVideoList...
refreshVideoList called
Sending GET_CHANNEL_VIDEOS message...
GET_CHANNEL_VIDEOS response: {...}
```

#### 3. ตรวจสอบ Background Service Worker
```
1. ไปที่ chrome://extensions/
2. หา "YouTube AI Optimizer"
3. คลิก "service worker" (สีฟ้า)
4. ดู Console logs
```

ควรเห็น logs:
```javascript
getChannelVideos called, pageToken: null
No authToken, checking storage...
Token found in storage
Fetching channel info...
Channel response status: 200
Channel data: {...}
Uploads playlist ID: UU...
Fetching videos from: https://...
Videos response status: 200
Videos data: {...}
Mapped X videos
```

#### 4. ตรวจสอบ Auth Token
เปิด Console ใน popup แล้วพิมพ์:

```javascript
chrome.storage.local.get('youtube_auth_token', (result) => {
    console.log('Token:', result.youtube_auth_token);
});
```

ถ้าไม่มี token หรือ token เป็น null = ยังไม่ได้ login

#### 5. ทดสอบ YouTube API โดยตรง
เปิด Console ใน popup แล้วพิมพ์:

```javascript
chrome.runtime.sendMessage({ action: 'GET_CHANNEL_VIDEOS' }, (response) => {
    console.log('Response:', response);
    if (response.error) {
        console.error('Error:', response.error);
    } else {
        console.log('Videos:', response.videos);
    }
});
```

---

## ปัญหาที่พบบ่อยและวิธีแก้

### ❌ ปัญหา 1: "Not authenticated. Please login first"
**สาเหตุ:** Token ไม่ถูกบันทึกหรือหมดอายุ

**วิธีแก้:**
```javascript
// ล้าง storage และ login ใหม่
chrome.storage.local.clear(() => {
    console.log('Storage cleared');
    // คลิก Login อีกครั้ง
});
```

### ❌ ปัญหา 2: "No channel found"
**สาเหตุ:** Account ที่ login ไม่มี YouTube channel

**วิธีแก้:**
1. ตรวจสอบว่า account มี YouTube channel
2. ไปที่ youtube.com และสร้าง channel
3. Login ใหม่

### ❌ ปัญหา 3: API Error 401 (Unauthorized)
**สาเหตุ:** Token หมดอายุหรือไม่ถูกต้อง

**วิธีแก้:**
```javascript
// ลบ token และ login ใหม่
chrome.identity.removeCachedAuthToken({ token: 'YOUR_TOKEN' }, () => {
    chrome.storage.local.remove('youtube_auth_token');
    // คลิก Login อีกครั้ง
});
```

### ❌ ปัญหา 4: API Error 403 (Forbidden)
**สาเหตุ:** YouTube Data API ไม่ได้เปิดใช้งานใน Google Cloud Console

**วิธีแก้:**
1. ไปที่ https://console.cloud.google.com
2. เลือก Project
3. ไปที่ "APIs & Services" > "Library"
4. ค้นหา "YouTube Data API v3"
5. คลิก "Enable"

### ❌ ปัญหา 5: Videos = [] (ว่างเปล่า)
**สาเหตุ:** Channel ไม่มีวิดีโอ หรือ API ไม่สามารถเข้าถึงได้

**วิธีแก้:**
1. ตรวจสอบว่า channel มีวิดีโอ public
2. ตรวจสอบ OAuth scopes ใน manifest.json
3. ตรวจสอบว่า API quota ไม่เกิน

---

## คำสั่ง Debug ที่มีประโยชน์

### ตรวจสอบ Extension Status
```javascript
// ใน popup console
chrome.runtime.getManifest();
chrome.runtime.id;
```

### ตรวจสอบ Storage
```javascript
chrome.storage.local.get(null, (data) => {
    console.log('All storage:', data);
});
```

### ทดสอบ Message Passing
```javascript
chrome.runtime.sendMessage({ action: 'GET_AUTH_STATUS' }, (response) => {
    console.log('Auth status:', response);
});
```

### ตรวจสอบ Permissions
```javascript
chrome.permissions.getAll((permissions) => {
    console.log('Permissions:', permissions);
});
```

### ทดสอบ YouTube API โดยตรง
```javascript
// ใน background service worker console
fetch('https://www.googleapis.com/youtube/v3/channels?part=id&mine=true', {
    headers: { 'Authorization': 'Bearer YOUR_TOKEN_HERE' }
})
.then(r => r.json())
.then(d => console.log(d))
.catch(e => console.error(e));
```

---

## ขั้นตอนการแก้ปัญหาแบบเป็นระบบ

### Step 1: ตรวจสอบ Extension ติดตั้งถูกต้อง
- [ ] Extension แสดงใน chrome://extensions/
- [ ] สถานะเป็น "เปิดใช้งาน"
- [ ] ไม่มี error ใน Extension details

### Step 2: ตรวจสอบ OAuth Configuration
- [ ] Client ID ถูกต้องใน manifest.json
- [ ] OAuth consent screen setup เรียบร้อย
- [ ] Test users ถูกเพิ่มแล้ว (ถ้าเป็น Testing mode)
- [ ] YouTube Data API เปิดใช้งานแล้ว

### Step 3: ทดสอบ Login
- [ ] คลิก Login with Google
- [ ] เลือก account ที่มี YouTube channel
- [ ] อนุญาตสิทธิ์ทั้งหมด
- [ ] ตรวจสอบว่ามี token ใน storage

### Step 4: ทดสอบ API
- [ ] เปิด background service worker console
- [ ] ดู logs ตอนเรียก GET_CHANNEL_VIDEOS
- [ ] ตรวจสอบ response status
- [ ] ตรวจสอบ response data

### Step 5: ตรวจสอบ UI
- [ ] Popup แสดง main section (ไม่ใช่ auth section)
- [ ] Video list ไม่แสดง "Loading..."
- [ ] มี error message หรือไม่
- [ ] Console มี error หรือไม่

---

## ถ้ายังแก้ไม่ได้

### วิธีที่ 1: Reload Extension
```
1. ไปที่ chrome://extensions/
2. คลิกปุ่ม reload (🔄) ที่ Extension
3. ปิด popup และเปิดใหม่
4. Login อีกครั้ง
```

### วิธีที่ 2: Clear All Data
```javascript
// ใน popup console
chrome.storage.local.clear();
chrome.identity.clearAllCachedAuthTokens(() => {
    console.log('All cleared');
    location.reload();
});
```

### วิธีที่ 3: Reinstall Extension
```
1. ลบ Extension
2. ปิด Chrome
3. เปิด Chrome ใหม่
4. ติดตั้ง Extension อีกครั้ง
5. Login ใหม่
```

---

## ติดต่อขอความช่วยเหลือ

ถ้าทำตามทุกขั้นตอนแล้วยังไม่ได้ กรุณาส่งข้อมูลต่อไปนี้:

1. **Console logs** จาก popup
2. **Console logs** จาก background service worker
3. **Storage data** (ลบ token ออกก่อนส่ง)
4. **Error messages** ทั้งหมด
5. **Chrome version**
6. **Extension version**

---

## เพิ่มเติม: Enable Verbose Logging

เพิ่มโค้ดนี้ใน background.js เพื่อดู logs เพิ่มเติม:

```javascript
// เพิ่มที่บรรทัดแรกของ background.js
console.log('Background service worker started');

// Log ทุก message ที่เข้ามา
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 Message received:', request);
    // ... existing code
});
```

เพิ่มโค้ดนี้ใน popup.js:

```javascript
// เพิ่มที่บรรทัดแรกของ popup.js
console.log('Popup script loaded');

// Log ทุก message ที่ส่งออก
const originalSendMessage = sendMessage;
sendMessage = function(message) {
    console.log('📤 Sending message:', message);
    return originalSendMessage(message);
};
```
