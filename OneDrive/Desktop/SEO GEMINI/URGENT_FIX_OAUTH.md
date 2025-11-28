# 🚨 URGENT: สร้าง OAuth Client ID ใหม่ทันที!

## ปัญหา:
Client ID `862891517207-n1teon7k1u0si4k4pa65q38g9ffn3pfr.apps.googleusercontent.com` 
**ไม่ใช่ Chrome Extension type!** ทำให้ "Authorization page could not be loaded"

## 🔧 ขั้นตอนแก้ (ทำทันที):

### 1. สร้าง OAuth Client ID ใหม่
1. ไปที่: https://console.cloud.google.com/apis/credentials
2. คลิก **"+ CREATE CREDENTIALS"**
3. เลือก **"OAuth client ID"**
4. **Application type: เลือก "Chrome extension"** ⚠️ สำคัญมาก!
5. **Name:** `YouTube AI Optimizer Extension`
6. **Item ID:** `odiehjcbdhoickcekieefdhpkppaikan`
7. คลิก **"CREATE"**

### 2. คัดลอก Client ID ใหม่
- จะได้ Client ID ใหม่ (เช่น `862891517207-xxxxxxx.apps.googleusercontent.com`)
- **คัดลอกทั้งหมด**

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

## ⚠️ สำคัญ:
- **ต้องเป็น "Chrome extension" type เท่านั้น!**
- OAuth Consent Screen ที่ setup ไว้จะใช้ได้กับ Client ID ใหม่
- ไม่ต้อง setup Consent Screen ใหม่

## 🎯 ผลลัพธ์:
หลังจากเปลี่ยน Client ID ใหม่ Extension จะ login ได้ทันที!

---

**หมายเหตุ:** การ setup scopes ใน OAuth Consent Screen ที่ทำไปแล้วจะใช้ได้กับ Client ID ใหม่ ไม่ต้องทำใหม่