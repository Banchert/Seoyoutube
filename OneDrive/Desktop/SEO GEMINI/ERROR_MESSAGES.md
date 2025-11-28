# 📋 รายการข้อผิดพลาดและวิธีแก้

## ข้อผิดพลาดที่พบบ่อย

### 1. ❌ ยังไม่ได้เข้าสู่ระบบ
**ข้อความ:** "Not authenticated. Please login first" หรือ "The user is not signed in"

**สาเหตุ:**
- ยังไม่ได้คลิก Login with Google
- Token หมดอายุ
- Token ถูกลบออกจาก storage

**วิธีแก้:**
1. คลิกปุ่ม "Login with Google"
2. เลือก Google account ที่ต้องการ
3. อนุญาตสิทธิ์ทั้งหมด

---

### 2. ❌ ไม่พบ YouTube Channel
**ข้อความ:** "No channel found"

**สาเหตุ:**
- Google account ที่ login ไม่มี YouTube channel
- Channel ถูกลบหรือระงับ

**วิธีแก้:**
1. ไปที่ https://youtube.com
2. คลิกที่รูปโปรไฟล์
3. เลือก "Create a channel"
4. ตั้งชื่อ channel และสร้าง
5. กลับมา login ใหม่ใน Extension

---

### 3. ❌ Token หมดอายุ
**ข้อความ:** "401 Unauthorized" หรือ "Token expired"

**สาเหตุ:**
- Token หมดอายุ (โดยปกติหมดอายุหลัง 1 ชั่วโมง)
- Token ถูก revoke

**วิธีแก้:**
1. คลิกปุ่ม "Logout"
2. คลิกปุ่ม "Login with Google" อีกครั้ง
3. หรือใช้คำสั่ง:
```javascript
chrome.identity.clearAllCachedAuthTokens(() => {
    chrome.storage.local.clear();
    location.reload();
});
```

---

### 4. ❌ ไม่มีสิทธิ์เข้าถึง API
**ข้อความ:** "403 Forbidden" หรือ "Access denied"

**สาเหตุ:**
- YouTube Data API ไม่ได้เปิดใช้งานใน Google Cloud Console
- OAuth scopes ไม่ถูกต้อง
- Project ถูกระงับ

**วิธีแก้:**
1. ไปที่ https://console.cloud.google.com
2. เลือก Project ที่ใช้
3. ไปที่ "APIs & Services" > "Library"
4. ค้นหา "YouTube Data API v3"
5. คลิก "Enable"
6. รอ 1-2 นาที
7. Login ใหม่

---

### 5. ❌ ปัญหาการเชื่อมต่อ
**ข้อความ:** "Network error" หรือ "Failed to fetch"

**สาเหตุ:**
- ไม่มีอินเทอร์เน็ต
- Firewall block YouTube API
- DNS ไม่สามารถ resolve ได้

**วิธีแก้:**
1. ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
2. ลองเปิด youtube.com ดูว่าเข้าได้หรือไม่
3. ปิด VPN หรือ Proxy (ถ้ามี)
4. ลอง restart Chrome

---

### 6. ❌ API Quota เกิน
**ข้อความ:** "Quota exceeded" หรือ "Too many requests"

**สาเหตุ:**
- ใช้ YouTube API เกิน quota ที่กำหนด (10,000 units/day)
- เรียก API บ่อยเกินไป

**วิธีแก้:**
1. รอ 24 ชั่วโมง (quota จะ reset เที่ยงคืน Pacific Time)
2. หรือไปที่ Google Cloud Console เพื่อขอเพิ่ม quota
3. ลดการเรียก API โดยไม่จำเป็น

---

### 7. ❌ OAuth Configuration Error
**ข้อความ:** "OAuth2 error" หรือ "Invalid client"

**สาเหตุ:**
- Client ID ใน manifest.json ไม่ถูกต้อง
- OAuth consent screen ไม่ได้ setup
- Extension ID ไม่ตรงกับที่ลงทะเบียน

**วิธีแก้:**
1. ตรวจสอบ Client ID ใน manifest.json
2. ตรวจสอบ OAuth consent screen ใน Google Cloud Console
3. ตรวจสอบว่า Extension ID ตรงกับที่ลงทะเบียน
4. ดูคู่มือ CREATE_OAUTH_CLIENT.md

---

### 8. ❌ ไม่พบวิดีโอ
**ข้อความ:** "No videos found" หรือ "Videos = []"

**สาเหตุ:**
- Channel ไม่มีวิดีโอ
- วิดีโอทั้งหมดเป็น private หรือ unlisted
- API ไม่สามารถเข้าถึงวิดีโอได้

**วิธีแก้:**
1. ตรวจสอบว่า channel มีวิดีโอ public
2. ไปที่ YouTube Studio > Content
3. ตรวจสอบ visibility ของวิดีโอ
4. ลอง upload วิดีโอใหม่แบบ public
5. คลิก Refresh ใน Extension

---

### 9. ❌ Extension ไม่แสดงอะไร
**ข้อความ:** Popup เปิดแล้วว่างเปล่า

**สาเหตุ:**
- JavaScript error ใน popup.js
- DOM elements ไม่โหลด
- CSS ไม่โหลด

**วิธีแก้:**
1. คลิกขวาที่ popup > Inspect
2. ดู Console มี error อะไร
3. ตรวจสอบ Network tab ว่าไฟล์โหลดครบหรือไม่
4. ลอง reload extension
5. ลอง reinstall extension

---

### 10. ❌ Background Service Worker ไม่ทำงาน
**ข้อความ:** "Could not establish connection"

**สาเหตุ:**
- Background service worker crash
- Background script มี error
- Chrome ปิด service worker เพื่อประหยัดทรัพยากร

**วิธีแก้:**
1. ไปที่ chrome://extensions/
2. หา Extension
3. คลิก "service worker" เพื่อเปิด console
4. ดู error messages
5. คลิก reload extension
6. ลอง restart Chrome

---

## วิธีตรวจสอบข้อผิดพลาด

### ขั้นตอนที่ 1: เปิด Console
```
1. คลิกขวาที่ Extension popup
2. เลือก "Inspect" หรือ "ตรวจสอบ"
3. ดูที่แท็บ Console
```

### ขั้นตอนที่ 2: ดู Error Messages
```
- สีแดง = Error (ต้องแก้)
- สีเหลือง = Warning (อาจมีปัญหา)
- สีฟ้า = Info (ข้อมูลทั่วไป)
```

### ขั้นตอนที่ 3: ทดสอบแต่ละส่วน
```javascript
// ทดสอบ Extension
chrome.runtime.id

// ทดสอบ Storage
chrome.storage.local.get(null, console.log)

// ทดสอบ Auth
chrome.runtime.sendMessage({action: 'GET_AUTH_STATUS'}, console.log)

// ทดสอบ API
chrome.runtime.sendMessage({action: 'GET_CHANNEL_VIDEOS'}, console.log)
```

---

## คำสั่งแก้ปัญหาด่วน

### ล้างข้อมูลทั้งหมด
```javascript
chrome.storage.local.clear();
chrome.identity.clearAllCachedAuthTokens(() => {
    console.log('Cleared');
    location.reload();
});
```

### ตรวจสอบ Token
```javascript
chrome.storage.local.get('youtube_auth_token', (result) => {
    console.log('Token:', result.youtube_auth_token);
});
```

### ทดสอบ YouTube API
```javascript
chrome.runtime.sendMessage({
    action: 'GET_CHANNEL_VIDEOS'
}, (response) => {
    console.log('Response:', response);
    if (response.error) {
        console.error('Error:', response.error);
    }
});
```

### Reload Extension
```
1. ไปที่ chrome://extensions/
2. หา "YouTube AI Optimizer"
3. คลิกปุ่ม reload (🔄)
```

---

## ติดต่อขอความช่วยเหลือ

ถ้าทำตามทุกวิธีแล้วยังแก้ไม่ได้ กรุณาส่งข้อมูลต่อไปนี้:

### 1. Console Logs
- จาก popup (คลิกขวา > Inspect)
- จาก background (chrome://extensions/ > service worker)

### 2. Storage Data
```javascript
chrome.storage.local.get(null, (data) => {
    console.log(JSON.stringify(data, null, 2));
});
```
(ลบ token ออกก่อนส่ง)

### 3. Extension Info
- Extension version (ดูใน manifest.json)
- Chrome version (chrome://version/)
- Operating System

### 4. Error Messages
- คัดลอก error messages ทั้งหมดจาก Console
- Screenshot ของ error (ถ้ามี)

### 5. Steps to Reproduce
- อธิบายขั้นตอนที่ทำให้เกิด error
- บอกว่าเกิดเมื่อไหร่ (login, load videos, etc.)

---

## เอกสารเพิ่มเติม

- [DEBUG_GUIDE.md](DEBUG_GUIDE.md) - คู่มือ debug แบบละเอียด
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - วิธีแก้ปัญหาทั่วไป
- [CREATE_OAUTH_CLIENT.md](CREATE_OAUTH_CLIENT.md) - วิธีสร้าง OAuth Client
- [TESTING.md](TESTING.md) - วิธีทดสอบ Extension
