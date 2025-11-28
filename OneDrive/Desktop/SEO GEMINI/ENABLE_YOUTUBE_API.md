# 🚨 Enable YouTube Data API v3

## ปัญหาที่เป็นไปได้:
YouTube Data API v3 ยังไม่ได้ enable ใน Google Cloud Project

## 🔧 วิธีแก้:

### 1. Enable YouTube Data API v3
1. ไปที่: https://console.cloud.google.com/apis/library
2. ค้นหา: **"YouTube Data API v3"**
3. คลิกเข้าไป
4. คลิก **"ENABLE"**

### 2. หรือไปที่ APIs & Services
1. ไปที่: https://console.cloud.google.com/apis/dashboard
2. คลิก **"+ ENABLE APIS AND SERVICES"**
3. ค้นหา: **"YouTube Data API v3"**
4. คลิก **"ENABLE"**

### 3. ตรวจสอบ Enabled APIs
ไปที่: https://console.cloud.google.com/apis/dashboard
ต้องเห็น **"YouTube Data API v3"** ในรายการ Enabled APIs

## 🎯 หลังจาก Enable แล้ว:
1. รอ 2-3 นาที
2. Reload extension
3. ลอง login ใหม่

---

## 🔍 ตรวจสอบเพิ่มเติม:

### ถ้ายังไม่ได้ ให้ตรวจสอบ:
1. **Project ID** ใน Google Cloud Console ตรงกับที่ใช้สร้าง OAuth Client หรือไม่
2. **Extension ID** ใน OAuth Client ตรงกับ Extension ID จริงหรือไม่
3. **Scopes** ใน OAuth Consent Screen มี YouTube scopes หรือไม่

### Extension ID ปัจจุบัน:
`odiehjcbdhoickcekieefdhpkppaikan`

### Client ID ปัจจุบัน:
`862891517207-47ds5n9cbqssschcsbtt12fg66egki69.apps.googleusercontent.com`