# 🎯 สรุปวิธีแก้ปัญหา "The user is not signed in"

## ปัญหา
❌ **OAuth error: The user is not signed in**

## สาเหตุ
OAuth Client ID ที่ใช้เป็นแบบ **Web Application** แทนที่จะเป็น **Chrome Extension**

---

## ✅ วิธีแก้ (5 ขั้นตอน)

### 1️⃣ หา Extension ID
```
chrome://extensions/ → คัดลอก ID
```

### 2️⃣ สร้าง OAuth Client ID ใหม่
```
https://console.cloud.google.com/apis/credentials
→ CREATE CREDENTIALS
→ OAuth client ID
→ Application type: Chrome Extension ⚠️
→ Application ID: [วาง Extension ID]
→ CREATE
→ คัดลอก Client ID
```

### 3️⃣ อัพเดท manifest.json
```json
"oauth2": {
  "client_id": "YOUR_NEW_CLIENT_ID.apps.googleusercontent.com"
}
```

### 4️⃣ Reload Extension
```
chrome://extensions/ → คลิก reload (🔄)
```

### 5️⃣ Login ใหม่
```
เปิด popup → Login with Google
```

---

## 📖 คู่มือละเอียด

- **QUICK_FIX_LOGIN.md** - แก้ปัญหาแบบเร็ว (5 นาที) ⭐ แนะนำ
- **FIX_LOGIN_ISSUE.md** - คู่มือแก้ปัญหาแบบละเอียด
- **check-oauth-config.html** - เครื่องมือตรวจสอบ OAuth config

---

## 🔍 ตรวจสอบว่าแก้สำเร็จ

เปิด Console ใน popup ควรเห็น:
```
✅ Token received: ya29.a0...
✅ Login successful
📺 Loading videos...
✅ Found X videos
```

---

## ⚠️ สิ่งสำคัญที่ต้องจำ

1. ✅ ต้องเป็น **Chrome Extension** type
2. ✅ Extension ID ต้องตรงกัน
3. ✅ Client ID ต้องถูกต้อง
4. ✅ ต้อง Reload Extension หลังแก้ manifest.json
5. ✅ ต้อง Setup OAuth Consent Screen

---

## 🆘 ยังแก้ไม่ได้?

ดูคู่มือ **QUICK_FIX_LOGIN.md** หรือ **FIX_LOGIN_ISSUE.md**
