# 🔧 แก้ไข OAuth Error - "bad client id"

## ❌ Error ที่เจอ:
```
OAuth2 request failed: Service responded with error: 
'bad client id: 862891517207-b5fvf13p9v4pnf534akio7ofh1cgv822.apps.googleusercontent.com'
```

## 🔍 สาเหตุ:
Client ID ที่ใช้อาจเป็น:
1. **Web Application** Client (ไม่ใช่ Chrome Extension)
2. Client ID ที่ยังไม่ได้ตั้งค่า Extension ID
3. Client ID ที่ถูกลบหรือ disabled

---

## ✅ วิธีแก้ไข (ทำตามทีละขั้นตอน)

### ขั้นตอนที่ 1: ตรวจสอบ OAuth Client Type

1. ไปที่ https://console.cloud.google.com/
2. เลือก Project ของคุณ
3. ไปที่ **APIs & Services > Credentials**
4. ดูที่ **OAuth 2.0 Client IDs**
5. ตรวจสอบว่า Client ID: `862891517207-b5fvf13p9v4pnf534akio7ofh1cgv822` เป็น:
   - ✅ **Chrome Extension** (ถูกต้อง)
   - ❌ **Web application** (ผิด - ต้องสร้างใหม่)

---

### ขั้นตอนที่ 2: สร้าง Chrome Extension OAuth Client ใหม่

#### 2.1 สร้าง OAuth Client ID
1. ไปที่ **APIs & Services > Credentials**
2. คลิก **+ CREATE CREDENTIALS**
3. เลือก **OAuth client ID**
4. Application type: เลือก **Chrome Extension**
5. Name: `YouTube AI Optimizer Extension`
6. Item ID: **ใส่ Extension ID ของคุณ**
   
   **วิธีหา Extension ID:**
   - เปิด `chrome://extensions/`
   - เปิด Developer mode
   - คลิก Load unpacked > เลือกโฟลเดอร์ SEO GEMINI
   - คัดลอก **ID** ที่แสดงใต้ชื่อ Extension
   - ตัวอย่าง: `abcdefghijklmnopqrstuvwxyz123456`

7. คลิก **CREATE**
8. **คัดลอก Client ID ใหม่** (จะขึ้น popup แสดง)
   - ตัวอย่าง: `123456789-abc123def456.apps.googleusercontent.com`

#### 2.2 อัพเดท manifest.json
1. เปิดไฟล์ `manifest.json`
2. แก้ไข `oauth2.client_id`:
   ```json
   "oauth2": {
     "client_id": "YOUR_NEW_CLIENT_ID.apps.googleusercontent.com",
     "scopes": [
       "https://www.googleapis.com/auth/youtube.force-ssl",
       "https://www.googleapis.com/auth/youtube.upload"
     ]
   }
   ```
3. บันทึกไฟล์

#### 2.3 Reload Extension
1. กลับไปที่ `chrome://extensions/`
2. คลิก **Reload** ที่ Extension
3. ลอง Login อีกครั้ง

---

### ขั้นตอนที่ 3: ถ้ายังไม่ได้ - ตั้งค่า OAuth Consent Screen

#### 3.1 ตรวจสอบ OAuth Consent Screen
1. ไปที่ **APIs & Services > OAuth consent screen**
2. ตรวจสอบว่ามี:
   - ✅ App name
   - ✅ User support email
   - ✅ Developer contact information
3. ถ้ายังไม่มี ให้กรอกข้อมูล:
   - App name: `YouTube AI Optimizer`
   - User support email: อีเมลของคุณ
   - Developer contact: อีเมลของคุณ
4. คลิก **SAVE AND CONTINUE**

#### 3.2 เพิ่ม Scopes
1. ที่หน้า **Scopes** คลิก **ADD OR REMOVE SCOPES**
2. เลือก:
   - ✅ `https://www.googleapis.com/auth/youtube.force-ssl`
   - ✅ `https://www.googleapis.com/auth/youtube.upload`
3. คลิก **UPDATE**
4. คลิก **SAVE AND CONTINUE**

#### 3.3 เพิ่ม Test Users (ถ้าเป็น Testing mode)
1. ที่หน้า **Test users** คลิก **+ ADD USERS**
2. ใส่อีเมล Google account ที่จะใช้ทดสอบ
3. คลิก **SAVE**
4. คลิก **SAVE AND CONTINUE**

---

### ขั้นตอนที่ 4: เปิดใช้งาน YouTube Data API v3

1. ไปที่ **APIs & Services > Library**
2. ค้นหา **YouTube Data API v3**
3. คลิก **ENABLE** (ถ้ายังไม่ได้เปิด)
4. รอสักครู่ให้ API เปิดใช้งาน

---

## 🧪 ทดสอบอีกครั้ง

### ขั้นตอนทดสอบ:
1. ✅ Reload Extension: `chrome://extensions/` > Reload
2. ✅ เปิด Extension popup
3. ✅ คลิก "Login with Google"
4. ✅ เลือก Google account
5. ✅ อนุญาตการเข้าถึง YouTube
6. ✅ ดูว่า login สำเร็จหรือไม่

### ถ้าสำเร็จ:
- ✅ จะเห็นหน้า main section
- ✅ วิดีโอจะโหลดมาแสดง
- ✅ พร้อมใช้งาน!

### ถ้ายัง error:
- เปิด DevTools (F12) ดู Console
- บอก error message ที่เห็น

---

## 🔍 Debug Tips

### ตรวจสอบ Extension ID
```javascript
// ใน Console ของ Extension popup
chrome.runtime.id
```

### ตรวจสอบ Client ID ใน manifest
```javascript
// ใน Console ของ Extension popup
fetch(chrome.runtime.getURL('manifest.json'))
  .then(r => r.json())
  .then(m => console.log(m.oauth2.client_id))
```

### ตรวจสอบ OAuth Client ใน Google Cloud
1. ไปที่ Credentials
2. คลิกที่ OAuth Client ID
3. ดูว่า:
   - Type = Chrome Extension ✅
   - Item ID = Extension ID ของคุณ ✅

---

## 📋 Checklist

- [ ] สร้าง OAuth Client ID แบบ **Chrome Extension**
- [ ] ใส่ Extension ID ใน Item ID
- [ ] คัดลอก Client ID ใหม่
- [ ] อัพเดท manifest.json
- [ ] Reload Extension
- [ ] ตั้งค่า OAuth Consent Screen
- [ ] เพิ่ม Scopes ที่จำเป็น
- [ ] เพิ่ม Test Users (ถ้าเป็น Testing mode)
- [ ] เปิดใช้งาน YouTube Data API v3
- [ ] ทดสอบ Login

---

## 💡 Tips

1. **Extension ID จะเปลี่ยน** ถ้าคุณลบและโหลด Extension ใหม่
2. **Client ID ต้องเป็น Chrome Extension type** ไม่ใช่ Web Application
3. **Test Users** จำเป็นถ้า OAuth Consent Screen เป็น Testing mode
4. **API ต้องเปิดใช้งาน** ก่อนใช้งาน

---

## 🆘 ยังไม่ได้?

ถ้าทำทุกขั้นตอนแล้วยังไม่ได้ ให้:

1. **ลบ Extension** และโหลดใหม่
2. **สร้าง OAuth Client ใหม่** ด้วย Extension ID ใหม่
3. **ตรวจสอบ Project** ว่าเป็น Project เดียวกัน
4. **ลอง Browser ใหม่** (Incognito mode)
5. **Clear cache** ของ Chrome

---

## ✅ Expected Result

เมื่อทำถูกต้อง:
```
✅ Login successful
✅ Loading videos...
✅ Loaded 50 videos
✅ Ready to optimize!
```

---

**Good luck! 🍀**
