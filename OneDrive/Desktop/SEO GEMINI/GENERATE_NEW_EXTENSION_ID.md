# 🔥 สร้าง Extension ID ใหม่

## ปัญหา: Extension ID อาจจะไม่ตรงกับ OAuth Client

### 🔧 วิธีแก้ - สร้าง Extension ID ใหม่:

#### 1. สร้าง key ใหม่
```bash
openssl genrsa 2048 | openssl pkcs8 -topk8 -nocrypt -out key.pem
```

#### 2. เพิ่ม key ใน manifest.json
```json
{
  "key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----"
}
```

#### 3. Pack extension เพื่อได้ Extension ID ใหม่

### 🎯 หรือใช้ Extension ID ที่มีอยู่แล้ว

**Extension ID ปัจจุบัน:** `odiehjcbdhoickcekieefdhpkppaikan`

ไปที่ Google Cloud Console:
1. https://console.cloud.google.com/apis/credentials
2. แก้ไข OAuth Client ID
3. ใส่ Extension ID: `odiehjcbdhoickcekieefdhpkppaikan`
4. Save

### 🔍 ตรวจสอบ Extension ID ปัจจุบัน

ใน Extension popup พิมพ์:
```javascript
console.log('Extension ID:', chrome.runtime.id);
```

แล้วเอา Extension ID ที่ได้ไปใส่ใน OAuth Client ID