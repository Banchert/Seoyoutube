# 🚨 สร้าง OAuth Client ID ใหม่ทันที

## Extension ID ปัจจุบัน: dpennnnmfhehamnefjogecggdapdkgfb

### 🔧 ขั้นตอนที่ต้องทำ:

#### 1. สร้าง OAuth Client ID ใหม่
1. ไปที่: https://console.cloud.google.com/apis/credentials
2. คลิก **"+ CREATE CREDENTIALS"**
3. เลือก **"OAuth client ID"**
4. **Application type: Chrome extension** ⚠️ สำคัญมาก!
5. **Name:** `YouTube AI Optimizer Final`
6. **Item ID:** `dpennnnmfhehamnefjogecggdapdkgfb`
7. คลิก **"CREATE"**

#### 2. คัดลอก Client ID ใหม่
- จะได้ Client ID ใหม่ที่ขึ้นต้นด้วย `862891517207-` หรือตัวเลขอื่น
- **คัดลอกทั้งหมด** (รวม `.apps.googleusercontent.com`)

#### 3. อัพเดท manifest.json
แทนที่ Client ID เก่า:
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

#### 4. ทดสอบทันที
- Reload extension
- ลอง login ใหม่

### ⚠️ สำคัญ:
- OAuth Consent Screen ที่ setup ไว้จะใช้ได้กับ Client ID ใหม่
- ไม่ต้อง setup Consent Screen ใหม่
- YouTube API ยัง enable อยู่
- Test users ยังมีอยู่

### 🎯 ผลลัพธ์:
OAuth Client ID ใหม่จะตรงกับ Extension ID แล้ว ควรจะ login ได้ทันที!

---

**หมายเหตุ:** ถ้ายังไม่ได้ อาจจะต้องรอ 5-10 นาทีให้ OAuth propagate