# 🔐 สร้าง OAuth Client ID สำหรับ Chrome Extension

## 📝 คู่มือสร้าง OAuth Client แบบละเอียด

### ⚠️ สำคัญ: ต้องมี Extension ID ก่อน!

---

## ขั้นตอนที่ 1: โหลด Extension เพื่อหา Extension ID

### 1.1 โหลด Extension
1. เปิด Chrome
2. ไปที่ `chrome://extensions/`
3. เปิด **Developer mode** (สวิตช์มุมขวาบน)
4. คลิก **Load unpacked**
5. เลือกโฟลเดอร์ `SEO GEMINI`
6. Extension จะปรากฏในรายการ

### 1.2 คัดลอก Extension ID
1. ดูที่ Extension card
2. จะเห็น **ID:** ด้านล่างชื่อ
3. คัดลอก ID (ตัวอักษร 32 ตัว)
4. ตัวอย่าง: `abcdefghijklmnopqrstuvwxyz123456`

**📋 เก็บ Extension ID ไว้ - จะใช้ในขั้นตอนถัดไป**

---

## ขั้นตอนที่ 2: ตั้งค่า Google Cloud Console

### 2.1 สร้าง/เลือก Project
1. ไปที่ https://console.cloud.google.com/
2. คลิก **Select a project** (มุมบนซ้าย)
3. เลือก Project ที่มีอยู่ หรือ คลิก **NEW PROJECT**
4. ถ้าสร้างใหม่:
   - Project name: `YouTube AI Optimizer`
   - คลิก **CREATE**
   - รอสักครู่

### 2.2 เปิดใช้งาน YouTube Data API v3
1. ไปที่ **APIs & Services > Library**
2. ค้นหา: `YouTube Data API v3`
3. คลิกที่ผลลัพธ์
4. คลิก **ENABLE**
5. รอจนกว่าจะเปิดใช้งานเสร็จ

---

## ขั้นตอนที่ 3: ตั้งค่า OAuth Consent Screen

### 3.1 เริ่มต้นตั้งค่า
1. ไปที่ **APIs & Services > OAuth consent screen**
2. เลือก **User Type**:
   - ✅ **External** (แนะนำ - ใช้ได้กับทุก Google account)
   - หรือ **Internal** (ถ้าเป็น Google Workspace)
3. คลิก **CREATE**

### 3.2 กรอกข้อมูล App
**หน้า "OAuth consent screen":**

1. **App information:**
   - App name: `YouTube AI Optimizer`
   - User support email: เลือกอีเมลของคุณ
   - App logo: (ไม่จำเป็น - ข้ามได้)

2. **App domain:** (ไม่จำเป็น - ข้ามได้)
   - Application home page: (ว่างไว้)
   - Application privacy policy link: (ว่างไว้)
   - Application terms of service link: (ว่างไว้)

3. **Authorized domains:** (ไม่จำเป็น - ข้ามได้)

4. **Developer contact information:**
   - Email addresses: อีเมลของคุณ

5. คลิก **SAVE AND CONTINUE**

### 3.3 เพิ่ม Scopes
**หน้า "Scopes":**

1. คลิก **ADD OR REMOVE SCOPES**
2. ค้นหาและเลือก:
   - ✅ `https://www.googleapis.com/auth/youtube.force-ssl`
     - Description: "View and manage your YouTube account"
   - ✅ `https://www.googleapis.com/auth/youtube.upload`
     - Description: "Upload YouTube videos and manage your YouTube videos"
3. คลิก **UPDATE**
4. คลิก **SAVE AND CONTINUE**

### 3.4 เพิ่ม Test Users (สำคัญ!)
**หน้า "Test users":**

1. คลิก **+ ADD USERS**
2. ใส่อีเมล Google account ที่จะใช้ทดสอบ
   - ตัวอย่าง: `your.email@gmail.com`
3. คลิก **SAVE**
4. คลิก **SAVE AND CONTINUE**

### 3.5 สรุป
**หน้า "Summary":**

1. ตรวจสอบข้อมูลทั้งหมด
2. คลิก **BACK TO DASHBOARD**

---

## ขั้นตอนที่ 4: สร้าง OAuth Client ID

### 4.1 สร้าง Credentials
1. ไปที่ **APIs & Services > Credentials**
2. คลิก **+ CREATE CREDENTIALS** (ด้านบน)
3. เลือก **OAuth client ID**

### 4.2 เลือก Application Type
1. **Application type:** เลือก **Chrome Extension**
2. **Name:** `YouTube AI Optimizer Extension`
3. **Item ID:** วาง **Extension ID** ที่คัดลอกไว้
   - ตัวอย่าง: `abcdefghijklmnopqrstuvwxyz123456`
4. คลิก **CREATE**

### 4.3 คัดลอก Client ID
1. จะมี popup แสดง **OAuth client created**
2. **คัดลอก Client ID** (ตัวอย่าง):
   ```
   123456789012-abc123def456ghi789jkl012mno345pq.apps.googleusercontent.com
   ```
3. คลิก **OK**

**📋 เก็บ Client ID ไว้ - จะใช้ในขั้นตอนถัดไป**

---

## ขั้นตอนที่ 5: อัพเดท Extension

### 5.1 แก้ไข manifest.json
1. เปิดไฟล์ `manifest.json` ในโฟลเดอร์ Extension
2. หาส่วน `oauth2`:
   ```json
   "oauth2": {
     "client_id": "OLD_CLIENT_ID",
     "scopes": [...]
   }
   ```
3. แทนที่ด้วย Client ID ใหม่:
   ```json
   "oauth2": {
     "client_id": "123456789012-abc123def456ghi789jkl012mno345pq.apps.googleusercontent.com",
     "scopes": [
       "https://www.googleapis.com/auth/youtube.force-ssl",
       "https://www.googleapis.com/auth/youtube.upload"
     ]
   }
   ```
4. **บันทึกไฟล์**

### 5.2 Reload Extension
1. กลับไปที่ `chrome://extensions/`
2. หา Extension **YouTube AI Optimizer**
3. คลิก **Reload** (ไอคอนวงกลมลูกศร)
4. ตรวจสอบว่าไม่มี error

---

## ขั้นตอนที่ 6: ทดสอบ Login

### 6.1 เปิด Extension
1. คลิกที่ Extension icon ใน Chrome toolbar
2. จะเห็นหน้า popup

### 6.2 Login
1. คลิก **"Login with Google"**
2. จะเปิดหน้าต่าง OAuth consent
3. เลือก Google account (ต้องเป็น Test User ที่เพิ่มไว้)
4. จะเห็นหน้า:
   ```
   YouTube AI Optimizer wants to access your Google Account
   
   This will allow YouTube AI Optimizer to:
   - View and manage your YouTube account
   - Upload YouTube videos and manage your YouTube videos
   ```
5. คลิก **Continue** หรือ **Allow**

### 6.3 ตรวจสอบผลลัพธ์
**ถ้าสำเร็จ:**
- ✅ หน้า popup จะเปลี่ยนเป็น main section
- ✅ แสดงข้อความ "Loading videos..."
- ✅ วิดีโอจะโหลดมาแสดง (ถ้ามีวิดีโอในช่อง)
- ✅ พร้อมใช้งาน!

**ถ้า error:**
- ❌ เปิด DevTools (F12) ดู Console
- ❌ ดู error message
- ❌ ทำตามคู่มือ FIX_OAUTH_ERROR.md

---

## 📋 Checklist สรุป

### Google Cloud Console:
- [ ] สร้าง/เลือก Project
- [ ] เปิดใช้งาน YouTube Data API v3
- [ ] ตั้งค่า OAuth Consent Screen
  - [ ] กรอก App information
  - [ ] เพิ่ม Scopes (youtube.force-ssl, youtube.upload)
  - [ ] เพิ่ม Test Users
- [ ] สร้าง OAuth Client ID (Chrome Extension type)
  - [ ] ใส่ Extension ID
  - [ ] คัดลอก Client ID

### Extension:
- [ ] โหลด Extension ใน Chrome
- [ ] คัดลอก Extension ID
- [ ] แก้ไข manifest.json ใส่ Client ID
- [ ] Reload Extension
- [ ] ทดสอบ Login

---

## 🎯 Expected Result

เมื่อทำครบทุกขั้นตอน:

```
✅ Extension loaded successfully
✅ No errors in chrome://extensions/
✅ Login button appears in popup
✅ Click Login > OAuth consent screen appears
✅ Select account > Allow permissions
✅ Login successful!
✅ Videos loaded
✅ Ready to optimize!
```

---

## 💡 Tips

1. **Extension ID จะเปลี่ยน** ถ้าคุณลบและโหลด Extension ใหม่
   - ต้องอัพเดท OAuth Client ด้วย

2. **Test Users จำเป็น** ถ้า OAuth Consent Screen เป็น Testing mode
   - เฉพาะ Test Users เท่านั้นที่ login ได้

3. **Scopes ต้องตรงกัน** ระหว่าง:
   - OAuth Consent Screen
   - manifest.json
   - OAuth Client

4. **API ต้องเปิดใช้งาน** ก่อนใช้งาน
   - YouTube Data API v3

---

## 🆘 ต้องการความช่วยเหลือ?

ถ้ามีปัญหา:
1. ดู **FIX_OAUTH_ERROR.md** สำหรับแก้ไข error
2. ดู **QUICKSTART.md** สำหรับคู่มือทั่วไป
3. เปิด DevTools ดู Console logs
4. ตรวจสอบ Google Cloud Console settings

---

**Good luck! 🚀**
