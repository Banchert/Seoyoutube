# 🚨 FINAL OAUTH DEBUG - ตรวจสอบทุกอย่าง

## ปัญหา: "Authorization page could not be loaded"

### 🔍 ตรวจสอบ Extension ID vs OAuth Client

**Extension ID ปัจจุบัน:** `odiehjcbdhoickcekieefdhpkppaikan`
**Client ID ปัจจุบัน:** `862891517207-47ds5n9cbqssschcsbtt12fg66egki69.apps.googleusercontent.com`

### 🔧 ขั้นตอนตรวจสอบ:

#### 1. ตรวจสอบ OAuth Client ID ใน Google Cloud Console
1. ไปที่: https://console.cloud.google.com/apis/credentials
2. คลิกที่ Client ID: `862891517207-47ds5n9cbqssschcsbtt12fg66egki69.apps.googleusercontent.com`
3. ตรวจสอบว่า **Application type** เป็น **"Chrome extension"**
4. ตรวจสอบว่า **Item ID** เป็น **"odiehjcbdhoickcekieefdhpkppaikan"**

#### 2. ถ้า Item ID ไม่ตรงกัน
- แก้ไข OAuth Client ID
- ใส่ Extension ID ที่ถูกต้อง: `odiehjcbdhoickcekieefdhpkppaikan`
- Save

#### 3. ถ้า Application type ไม่ใช่ Chrome extension
- ลบ OAuth Client ID เก่า
- สร้างใหม่แบบ "Chrome extension"
- ใส่ Extension ID: `odiehjcbdhoickcekieefdhpkppaikan`

#### 4. ตรวจสอบ OAuth Consent Screen
1. ไปที่: https://console.cloud.google.com/apis/credentials/consent
2. ตรวจสอบว่าเป็น **"Testing"** mode
3. ตรวจสอบว่ามี **Test users** (email ของคุณ)
4. ตรวจสอบว่ามี **YouTube scopes**

### 🎯 วิธีแก้ชั่วคราว - ใช้ Testing URL

ลองเปิด URL นี้ใน browser ดู:
```
https://accounts.google.com/oauth/authorize?client_id=862891517207-47ds5n9cbqssschcsbtt12fg66egki69.apps.googleusercontent.com&response_type=token&redirect_uri=https%3A%2F%2Fodiehjcbdhoickcekieefdhpkppaikan.chromiumapp.org%2F&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.force-ssl%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.upload
```

**ถ้า URL นี้ขึ้น error page** = OAuth Client ID ไม่ถูกต้อง
**ถ้า URL นี้ขึ้นหน้า login** = OAuth Client ID ถูกต้อง แต่มีปัญหาอื่น

### 🔥 วิธีแก้สุดท้าย - สร้าง Project ใหม่

ถ้าทุกอย่างไม่ได้:
1. สร้าง Google Cloud Project ใหม่
2. Enable YouTube Data API v3
3. สร้าง OAuth Consent Screen ใหม่
4. สร้าง OAuth Client ID ใหม่ (Chrome extension type)
5. ใส่ Extension ID: `odiehjcbdhoickcekieefdhpkppaikan`