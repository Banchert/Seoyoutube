# 🚀 Setup OAuth แบบ Step-by-Step (ทำตามได้เลย)

## ข้อมูลที่คุณมีแล้ว ✅

```
Extension ID: odiehjcbdhoickcekie efdhpkppaikan
Client ID: 862891517207-n1teon7k1u0si4k4pa65q38g9ffn3pfr.apps.googleusercontent.com
```

---

## ⚠️ ปัญหาปัจจุบัน

Error: **"OAuth error: The user is not signed in"**

**สาเหตุ:** OAuth Consent Screen ยังไม่ได้ setup หรือ Test users ยังไม่ได้เพิ่ม

---

## 📝 ขั้นตอนที่ต้องทำ (ทำตามทีละขั้น)

### ขั้นตอนที่ 1: Setup OAuth Consent Screen

#### 1.1 เปิดหน้า OAuth Consent Screen
```
🔗 คลิกลิงก์นี้: https://console.cloud.google.com/apis/credentials/consent
```

#### 1.2 เลือก User Type
- ถ้ายังไม่เคยเลือก → เลือก **"External"**
- คลิก **"CREATE"**

#### 1.3 กรอกข้อมูล App Information (หน้า 1)

**คัดลอกข้อมูลนี้ไปวาง:**

```
App name: YouTube AI Optimizer

User support email: [เลือก email ของคุณจาก dropdown]

App logo: [ข้าม - ไม่จำเป็น]

Application home page: [ข้าม - ไม่จำเป็น]

Application privacy policy link: [ข้าม - ไม่จำเป็น]

Application terms of service link: [ข้าม - ไม่จำเป็น]

Authorized domains: [ข้าม - ไม่จำเป็น]

Developer contact information:
[ใส่ email ของคุณ]
```

**คลิก:** `SAVE AND CONTINUE`

---

### ขั้นตอนที่ 2: เพิ่ม Scopes (หน้า 2)

#### 2.1 คลิก "ADD OR REMOVE SCOPES"

#### 2.2 ค้นหาและเลือก Scopes เหล่านี้:

**วิธีค้นหา:** พิมพ์ใน Filter box

1. **Scope ที่ 1:**
   ```
   ค้นหา: youtube.force-ssl
   เลือก: https://www.googleapis.com/auth/youtube.force-ssl
   ```

2. **Scope ที่ 2:**
   ```
   ค้นหา: youtube.upload
   เลือก: https://www.googleapis.com/auth/youtube.upload
   ```

#### 2.3 คลิก "UPDATE"

#### 2.4 คลิก "SAVE AND CONTINUE"

---

### ขั้นตอนที่ 3: เพิ่ม Test Users (หน้า 3) ⚠️ สำคัญมาก!

#### 3.1 คลิก "+ ADD USERS"

#### 3.2 ใส่ email ที่จะใช้ login

**ใส่ Gmail ของคุณ** (email ที่จะใช้ login ใน Extension)

```
ตัวอย่าง: yourname@gmail.com
```

#### 3.3 คลิก "ADD"

#### 3.4 คลิก "SAVE AND CONTINUE"

---

### ขั้นตอนที่ 4: Review (หน้า 4)

#### 4.1 ตรวจสอบข้อมูลทั้งหมด

ควรเห็น:
- ✅ App name: YouTube AI Optimizer
- ✅ Scopes: 2 scopes
- ✅ Test users: 1 user (email ของคุณ)

#### 4.2 คลิก "BACK TO DASHBOARD"

---

### ขั้นตอนที่ 5: กลับไปที่ OAuth Client

#### 5.1 ไปที่ Credentials
```
🔗 คลิกลิงก์นี้: https://console.cloud.google.com/apis/credentials
```

#### 5.2 หา OAuth Client ของคุณ
- ชื่อ: "Chrome YOUTUBE" หรือชื่อที่คุณตั้ง
- Client ID: 862891517207-n1teon7k1u0si4k4pa65q38g9ffn3pfr

#### 5.3 คลิกที่ชื่อ OAuth Client

#### 5.4 ตรวจสอบข้อมูล

ควรเห็น:
```
Application type: Chrome Extension ✅
Item ID: odiehjcbdhoickcekie efdhpkppaikan ✅
```

#### 5.5 คลิก "SAVE" (ถ้ามี)

---

### ขั้นตอนที่ 6: รอให้ Configuration Propagate

⏰ **รอ 2-3 นาที** ให้ Google อัพเดทการตั้งค่า

---

### ขั้นตอนที่ 7: Reload Extension

#### 7.1 เปิด Chrome Extensions
```
🔗 พิมพ์ใน address bar: chrome://extensions/
```

#### 7.2 หา "YouTube AI Optimizer"

#### 7.3 คลิกปุ่ม Reload (🔄)

---

### ขั้นตอนที่ 8: ล้างข้อมูลเก่า

#### 8.1 เปิด Extension Popup

#### 8.2 คลิกขวาที่ Popup → เลือก "Inspect"

#### 8.3 ไปที่แท็บ "Console"

#### 8.4 วางโค้ดนี้แล้วกด Enter:

```javascript
chrome.storage.local.clear();
chrome.identity.clearAllCachedAuthTokens(() => {
    console.log('✅ Cleared all data');
    location.reload();
});
```

---

### ขั้นตอนที่ 9: Login ใหม่

#### 9.1 คลิกปุ่ม "Login with Google"

#### 9.2 เลือก Google account (ต้องเป็น email ที่เพิ่มใน Test users)

#### 9.3 คลิก "Continue" / "อนุญาต"

#### 9.4 อนุญาตสิทธิ์ทั้งหมด

---

## ✅ ตรวจสอบว่าสำเร็จ

### เปิด Console ใน Popup ควรเห็น:

```
🔐 handleLogin called
🔓 No cached token, starting interactive login...
✅ Token received: ya29.a0...
✅ Token saved to storage
✅ Login successful
📺 Loading videos...
✅ Found X videos
```

### ถ้าเห็นแบบนี้ = สำเร็จ! 🎉

---

## ❌ ถ้ายังไม่ได้

### ตรวจสอบสิ่งเหล่านี้:

#### 1. OAuth Consent Screen
- [ ] User Type: External
- [ ] App name: YouTube AI Optimizer
- [ ] Scopes: มี 2 scopes (youtube.force-ssl, youtube.upload)
- [ ] Test users: มี email ของคุณ

#### 2. OAuth Client
- [ ] Application type: Chrome Extension (ไม่ใช่ Web Application)
- [ ] Item ID: odiehjcbdhoickcekie efdhpkppaikan

#### 3. Extension
- [ ] Reload แล้ว
- [ ] ล้าง storage แล้ว
- [ ] Login ด้วย email ที่อยู่ใน Test users

---

## 🔍 Debug Commands

### ตรวจสอบ Extension ID
```javascript
console.log('Extension ID:', chrome.runtime.id);
```

### ตรวจสอบ Client ID
```javascript
console.log('Client ID:', chrome.runtime.getManifest().oauth2.client_id);
```

### ตรวจสอบ Token
```javascript
chrome.storage.local.get('youtube_auth_token', (result) => {
    console.log('Token:', result.youtube_auth_token);
});
```

### ทดสอบ OAuth
```javascript
chrome.identity.getAuthToken({ interactive: true }, (token) => {
    if (chrome.runtime.lastError) {
        console.error('❌ Error:', chrome.runtime.lastError.message);
    } else {
        console.log('✅ Token:', token);
    }
});
```

---

## 📸 ภาพประกอบ (ตำแหน่งที่ต้องคลิก)

### OAuth Consent Screen
```
APIs & Services → OAuth consent screen
↓
User Type: ⚪ Internal  ⚫ External  [CREATE]
↓
App information
  App name: [YouTube AI Optimizer]
  User support email: [your-email@gmail.com]
↓
[SAVE AND CONTINUE]
↓
Scopes
  [ADD OR REMOVE SCOPES]
  ☑ https://www.googleapis.com/auth/youtube.force-ssl
  ☑ https://www.googleapis.com/auth/youtube.upload
  [UPDATE]
↓
[SAVE AND CONTINUE]
↓
Test users
  [+ ADD USERS]
  Email: [your-email@gmail.com]
  [ADD]
↓
[SAVE AND CONTINUE]
↓
[BACK TO DASHBOARD]
```

---

## 💡 Tips สำคัญ

1. **ต้องเพิ่ม Test users** - ถ้าไม่เพิ่ม จะ login ไม่ได้
2. **ต้องใช้ email เดียวกัน** - email ที่เพิ่มใน Test users ต้องตรงกับที่ login
3. **รอให้ propagate** - หลัง setup เสร็จ รอ 2-3 นาที
4. **ล้าง cache** - ต้องล้าง storage และ cached tokens ก่อน login ใหม่
5. **Reload Extension** - ต้อง reload หลังแก้ไข manifest.json

---

## 🆘 ยังไม่ได้?

### ลองวิธีนี้:

1. **ลบ OAuth Client เก่า**
2. **สร้าง OAuth Client ใหม่**
3. **อัพเดท Client ID ใน manifest.json**
4. **Reload Extension**
5. **Login ใหม่**

---

## 📞 ติดต่อขอความช่วยเหลือ

ถ้าทำตามทุกขั้นตอนแล้วยังไม่ได้ ส่งข้อมูลเหล่านี้:

1. Screenshot ของ OAuth Consent Screen (แสดง Scopes และ Test users)
2. Screenshot ของ OAuth Client settings
3. Console logs จาก popup
4. Console logs จาก background service worker
5. Error messages ทั้งหมด

---

**หมายเหตุ:** ขั้นตอนที่สำคัญที่สุดคือ **เพิ่ม Test users** ถ้าไม่เพิ่ม จะ login ไม่ได้แน่นอน!
