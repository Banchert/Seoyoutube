# 🚨 FINAL FIX - OAuth Client ID ไม่ถูกต้อง

## ปัญหาหลัก
OAuth Client ID `862891517207-n1teon7k1u0si4k4pa65q38g9ffn3pfr.apps.googleusercontent.com` 
**ไม่ได้สร้างสำหรับ Chrome Extension!**

## 🔧 วิธีแก้ (ทำตามขั้นตอนนี้เท่านั้น):

### 1. สร้าง OAuth Client ID ใหม่
1. ไปที่: https://console.cloud.google.com/apis/credentials
2. คลิก **"+ CREATE CREDENTIALS"**
3. เลือก **"OAuth client ID"**
4. Application type: เลือก **"Chrome extension"** (ไม่ใช่ Web application!)
5. Name: `YouTube AI Optimizer Extension`
6. Item ID: `odiehjcbdhoickcekieefdhpkppaikan` (Extension ID ปัจจุบัน)
7. คลิก **"CREATE"**

### 2. คัดลอก Client ID ใหม่
- จะได้ Client ID ใหม่ที่ขึ้นต้นด้วย `862891517207-` หรือตัวเลขอื่น
- **คัดลอกทั้งหมด** (รวม `.apps.googleusercontent.com`)

### 3. อัพเดท manifest.json
```json
{
  "oauth2": {
    "client_id": "CLIENT_ID_ใหม่_ที่ได้จากขั้นตอน_2",
    "scopes": [
      "https://www.googleapis.com/auth/youtube.force-ssl",
      "https://www.googleapis.com/auth/youtube.upload"
    ]
  }
}
```

### 4. Reload Extension
- ไปที่ `chrome://extensions/`
- คลิก reload ที่ YouTube AI Optimizer
- ลอง Login ใหม่

## ⚠️ สำคัญ!
- **ต้องเป็น "Chrome extension" type เท่านั้น!**
- **ต้องใส่ Extension ID ที่ถูกต้อง**
- OAuth Consent Screen ต้องอยู่ใน Testing mode และมี Test users

## 🎯 หลังจากแก้แล้ว
Extension จะสามารถ login ได้ทันที โดยไม่ต้องรอ verification