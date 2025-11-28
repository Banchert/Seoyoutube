# 🔧 Setup OAuth สำหรับ Web App

## ขั้นตอนที่ 1: สร้าง Web Application OAuth Client

### 1. ไปที่ Google Cloud Console
https://console.cloud.google.com/apis/credentials

### 2. สร้าง OAuth Client ID ใหม่
1. คลิก **"+ CREATE CREDENTIALS"**
2. เลือก **"OAuth client ID"**
3. **Application type:** Web application ⚠️ สำคัญ!
4. **Name:** `YouTube AI Optimizer Web App`

### 3. เพิ่ม Authorized Redirect URIs
เพิ่ม URLs เหล่านี้:
```
http://localhost:3000
http://localhost:3000/callback
https://your-app-name.vercel.app
https://your-app-name.vercel.app/callback
https://your-app-name.netlify.app
https://your-app-name.netlify.app/callback
```

### 4. คัดลอก Client ID
- จะได้ Client ID ใหม่ เช่น: `862891517207-xxxxxxx.apps.googleusercontent.com`
- **คัดลอกทั้งหมด**

## ขั้นตอนที่ 2: อัพเดท Web App

### 1. แก้ไข index.html
เปิดไฟล์ `web-app/index.html` แก้บรรทัดที่ 120:

**เปลี่ยนจาก:**
```javascript
const CLIENT_ID = '862891517207-NEW_WEB_APP_CLIENT_ID.apps.googleusercontent.com';
```

**เป็น:**
```javascript
const CLIENT_ID = 'CLIENT_ID_ใหม่_ที่ได้จากขั้นตอน_4';
```

### 2. อัพเดท Redirect URI
แก้บรรทัดที่ 121:
```javascript
const REDIRECT_URI = 'https://your-actual-domain.com';
```

### 3. Deploy ใหม่
```bash
cd web-app
vercel --prod
```

## ขั้นตอนที่ 3: ทดสอบ

### 1. เปิด Web App
- ไปที่ URL ที่ deploy แล้ว
- คลิก "Login with Google"

### 2. ควรเห็น:
- ✅ หน้า Google OAuth
- ✅ ขออนุญาต YouTube access
- ✅ Redirect กลับมา Web App

### 3. ถ้า Error:
- ตรวจสอบ Redirect URI ใน OAuth Client
- ตรวจสอบ CLIENT_ID ใน index.html
- ตรวจสอบว่า domain ตรงกัน

## 🎯 ผลลัพธ์:
Web App จะทำงานได้เต็มรูปแบบ พร้อม OAuth ที่ใช้งานได้จริง!

## 📋 Checklist:
- [ ] สร้าง Web Application OAuth Client
- [ ] เพิ่ม Redirect URIs
- [ ] อัพเดท CLIENT_ID ใน index.html
- [ ] Deploy ใหม่
- [ ] ทดสอบ OAuth flow