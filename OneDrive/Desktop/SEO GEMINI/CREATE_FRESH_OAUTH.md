# 🔥 สร้าง OAuth Client ID ใหม่หมด

## Extension ID ปัจจุบัน: dpennnnmfhehamnefjogecggdapdkgfb

### 🔧 ขั้นตอนสร้างใหม่:

#### 1. สร้าง OAuth Client ID ใหม่
1. ไปที่: https://console.cloud.google.com/apis/credentials
2. คลิก **"+ CREATE CREDENTIALS"**
3. เลือก **"OAuth client ID"**
4. **Application type: Chrome extension** ⚠️ สำคัญ!
5. **Name:** `YouTube AI Optimizer New`
6. **Item ID:** `dpennnnmfhehamnefjogecggdapdkgfb`
7. คลิก **"CREATE"**

#### 2. คัดลอก Client ID ใหม่
- จะได้ Client ID ใหม่ (เช่น `862891517207-xxxxxxx.apps.googleusercontent.com`)
- **คัดลอกทั้งหมด**

#### 3. อัพเดท manifest.json
```json
{
  "oauth2": {
    "client_id": "CLIENT_ID_ใหม่_ที่ได้",
    "scopes": [
      "https://www.googleapis.com/auth/youtube.force-ssl",
      "https://www.googleapis.com/auth/youtube.upload"
    ]
  }
}
```

#### 4. ทดสอบ
- Reload extension
- ลอง login ใหม่

### 🎯 หรือลองวิธีง่ายๆ

**ลบ OAuth Client ID เก่าแล้วสร้างใหม่:**
1. ลบ: `862891517207-47ds5n9cbqssschcsbtt12fg66egki69.apps.googleusercontent.com`
2. สร้างใหม่ด้วย Extension ID: `dpennnnmfhehamnefjogecggdapdkgfb`
3. OAuth Consent Screen จะใช้ร่วมกันได้

### 📋 ข้อมูลสำคัญ:
- Extension ID: `dpennnnmfhehamnefjogecggdapdkgfb` (ล็อคแล้ว)
- OAuth Consent Screen: setup แล้ว (Testing mode)
- YouTube API: enable แล้ว
- Test users: เพิ่มแล้ว