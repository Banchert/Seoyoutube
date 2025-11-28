# 🚀 Quick Start Guide - YouTube AI Optimizer

## ขั้นตอนที่ 1: ตั้งค่า Google Cloud Console

### 1.1 สร้าง Project
1. ไปที่ https://console.cloud.google.com/
2. คลิก "Select a project" > "New Project"
3. ตั้งชื่อ project เช่น "YouTube AI Optimizer"
4. คลิก "Create"

### 1.2 เปิดใช้งาน APIs
1. ไปที่ **APIs & Services > Library**
2. ค้นหาและเปิดใช้งาน:
   - **YouTube Data API v3**
   - คลิก "Enable"

### 1.3 สร้าง OAuth 2.0 Client ID
1. ไปที่ **APIs & Services > Credentials**
2. คลิก **Create Credentials > OAuth client ID**
3. ถ้ายังไม่มี OAuth consent screen:
   - คลิก "Configure Consent Screen"
   - เลือก "External" > "Create"
   - กรอก:
     - App name: `YouTube AI Optimizer`
     - User support email: อีเมลของคุณ
     - Developer contact: อีเมลของคุณ
   - คลิก "Save and Continue"
   - ข้าม Scopes > "Save and Continue"
   - ข้าม Test users > "Save and Continue"
   - คลิก "Back to Dashboard"

4. กลับไปที่ **Credentials** > **Create Credentials > OAuth client ID**
5. เลือก Application type: **Chrome Extension**
6. ตั้งชื่อ: `YouTube AI Optimizer Extension`
7. **ยังไม่ต้องใส่ Extension ID** (จะได้หลังโหลด Extension)
8. คลิก "Create"
9. **คัดลอก Client ID** (เก็บไว้ใช้ในขั้นตอนถัดไป)

### 1.4 เพิ่ม Authorized Redirect URIs
1. คลิกที่ OAuth Client ID ที่สร้างไว้
2. เลื่อนลงไปที่ "Authorized redirect URIs"
3. คลิก "Add URI" และเพิ่ม:
   ```
   https://<EXTENSION_ID>.chromiumapp.org/
   ```
   (จะได้ Extension ID ในขั้นตอนถัดไป)

4. เพิ่ม URIs เหล่านี้ด้วย (สำหรับ development):
   ```
   http://localhost:3000
   http://localhost:5173
   http://127.0.0.1:3001
   ```

5. คลิก "Save"

---

## ขั้นตอนที่ 2: ติดตั้ง Extension

### 2.1 โหลด Extension ใน Chrome
1. เปิด Chrome
2. ไปที่ `chrome://extensions/`
3. เปิด **Developer mode** (มุมขวาบน)
4. คลิก **Load unpacked**
5. เลือกโฟลเดอร์ `SEO GEMINI`
6. Extension จะปรากฏในรายการ

### 2.2 คัดลอก Extension ID
1. ดูที่ Extension card
2. คัดลอก **ID** (ตัวอักษรยาวๆ ด้านล่างชื่อ)
   - ตัวอย่าง: `abcdefghijklmnopqrstuvwxyz123456`

### 2.3 อัพเดท OAuth Client ID
1. กลับไปที่ Google Cloud Console
2. ไปที่ **APIs & Services > Credentials**
3. คลิกที่ OAuth Client ID ที่สร้างไว้
4. แก้ไข "Application ID" ใส่ Extension ID ที่คัดลอกมา
5. แก้ไข "Authorized redirect URIs" เพิ่ม:
   ```
   https://<EXTENSION_ID>.chromiumapp.org/
   ```
   (แทนที่ `<EXTENSION_ID>` ด้วย ID จริง)
6. คลิก "Save"

### 2.4 อัพเดท manifest.json
1. เปิดไฟล์ `manifest.json`
2. แก้ไข `oauth2.client_id`:
   ```json
   "oauth2": {
     "client_id": "YOUR_CLIENT_ID_HERE.apps.googleusercontent.com",
     "scopes": [
       "https://www.googleapis.com/auth/youtube.force-ssl",
       "https://www.googleapis.com/auth/youtube.upload"
     ]
   }
   ```
3. บันทึกไฟล์
4. กลับไปที่ `chrome://extensions/`
5. คลิก **Reload** ที่ Extension

---

## ขั้นตอนที่ 3: ทดสอบ Extension

### 3.1 Login
1. คลิกที่ Extension icon (ใน toolbar)
2. คลิก **"Login with Google"**
3. เลือก Google account
4. อนุญาตการเข้าถึง:
   - ✅ View and manage your YouTube account
   - ✅ Upload videos to YouTube
5. คลิก "Allow"

### 3.2 ดูวิดีโอ
- Extension จะดึงวิดีโอล่าสุด 50 คลิปมาแสดง
- ถ้าไม่มีวิดีโอ แสดงว่าช่องยังไม่มีวิดีโอ

### 3.3 ทดสอบ SEO (1 วิดีโอก่อน)
1. เลือก checkbox วิดีโอ 1 คลิป
2. คลิก **"Optimize Selected (1)"**
3. รอดู:
   - ✅ Gemini tab เปิดขึ้นมา
   - ✅ คำสั่ง SEO ถูกวางใน input box
   - ✅ Gemini เริ่มตอบกลับ
   - ✅ รอจนกว่า Gemini ตอบเสร็จ (30-60 วินาที)
   - ✅ Extension อัพเดทวิดีโอ
   - ✅ Gemini สร้างรูป thumbnail
   - ✅ Extension อัพโหลดรูป
   - ✅ แสดง "✓ Video optimized successfully"

---

## 🐛 แก้ปัญหาที่พบบ่อย

### ❌ "Not authenticated" error
**สาเหตุ:** ยังไม่ได้ login หรือ token หมดอายุ

**วิธีแก้:**
1. คลิก Extension icon
2. ถ้าเห็นปุ่ม "Login" แสดงว่ายังไม่ได้ login
3. คลิก "Login with Google"
4. ถ้ายัง error ให้:
   - เปิด `chrome://extensions/`
   - คลิก "Remove" Extension
   - โหลด Extension ใหม่
   - Login อีกครั้ง

### ❌ "OAuth client ID not found"
**สาเหตุ:** Client ID ใน manifest.json ไม่ถูกต้อง

**วิธีแก้:**
1. ตรวจสอบ Client ID ใน Google Cloud Console
2. คัดลอก Client ID ที่ถูกต้อง
3. แก้ไขใน `manifest.json`
4. Reload Extension

### ❌ "Redirect URI mismatch"
**สาเหตุ:** Authorized redirect URIs ไม่ตรงกับ Extension ID

**วิธีแก้:**
1. คัดลอก Extension ID จาก `chrome://extensions/`
2. ไปที่ Google Cloud Console > Credentials
3. แก้ไข OAuth Client ID
4. เพิ่ม redirect URI:
   ```
   https://<EXTENSION_ID>.chromiumapp.org/
   ```
5. Save และ Reload Extension

### ❌ "YouTube API quota exceeded"
**สาเหตุ:** ใช้ API เกิน quota วันละ 10,000 units

**วิธีแก้:**
1. รอวันถัดไป (quota reset เที่ยงคืน Pacific Time)
2. หรือขอเพิ่ม quota ที่ Google Cloud Console

### ❌ Gemini ไม่ตอบกลับ
**สาเหตุ:** Selector ใน content-gemini.js อาจเปลี่ยน

**วิธีแก้:**
1. เปิด Gemini tab
2. กด F12 เปิด DevTools
3. ดู Console มี error อะไร
4. ตรวจสอบ selector ใน `src/content-gemini.js`
5. อัพเดท selector ถ้าจำเป็น

---

## 📊 ตรวจสอบว่าทำงานได้

### ✅ Checklist:
- [ ] Extension โหลดได้ (ไม่มี error)
- [ ] Login สำเร็จ
- [ ] ดึงวิดีโอมาแสดงได้
- [ ] Search ทำงาน
- [ ] Select/Deselect ทำงาน
- [ ] Optimize 1 วิดีโอสำเร็จ
- [ ] SEO อัพเดทใน YouTube
- [ ] Thumbnail อัพโหลดสำเร็จ

### 🎉 ถ้าผ่านทุกข้อ = พร้อมใช้งาน!

---

## 💡 Tips

1. **ทดสอบ 1 วิดีโอก่อน** - อย่าเลือกหลายวิดีโอในครั้งแรก
2. **ดู Console** - เปิด DevTools ดู log เพื่อ debug
3. **Backup วิดีโอ** - เก็บ title/description เดิมไว้ก่อนทำ SEO
4. **ตรวจสอบผลลัพธ์** - ดูว่า Gemini สร้าง SEO ได้ดีหรือไม่
5. **API Quota** - ระวังใช้ API เกิน quota (1 วิดีโอ ≈ 50-100 units)

---

## 📞 ต้องการความช่วยเหลือ?

1. ดู **TESTING.md** สำหรับ debug tips
2. ดู **README.md** สำหรับข้อมูลเพิ่มเติม
3. เปิด DevTools ดู Console logs
4. ตรวจสอบ Google Cloud Console > APIs & Services > Credentials

---

**สำเร็จแล้ว! 🎊**

ตอนนี้คุณสามารถใช้ Extension ทำ SEO วิดีโอ YouTube อัตโนมัติได้แล้ว!
