# 📝 อัพเดท manifest.json หลังสร้าง OAuth Client

## Extension ID ของคุณ:
```
odiehjcbdhoickcekieefdhpkppaikan
```

## ขั้นตอนที่ต้องทำ:

### 1. สร้าง OAuth Client ใน Google Cloud Console

1. ไปที่: https://console.cloud.google.com/apis/credentials
2. คลิก **+ Create credentials** > **OAuth client ID**
3. กรอกข้อมูล:
   - **Application type:** Chrome Extension
   - **Name:** YouTube AI Optimizer Extension
   - **Item ID:** `odiehjcbdhoickcekieefdhpkppaikan`
4. คลิก **CREATE**
5. **คัดลอก Client ID** (ตัวอย่าง):
   ```
   123456789012-abc123def456ghi789jkl012mno345pq.apps.googleusercontent.com
   ```

---

### 2. แก้ไข manifest.json

เปิดไฟล์ `manifest.json` แล้วแก้ไขส่วน `oauth2`:

**จาก:**
```json
"oauth2": {
  "client_id": "862891517207-b5fvf13p9v4pnf534akio7ofh1cgv822.apps.googleusercontent.com",
  "scopes": [
    "https://www.googleapis.com/auth/youtube.force-ssl",
    "https://www.googleapis.com/auth/youtube.upload"
  ]
}
```

**เป็น:**
```json
"oauth2": {
  "client_id": "CLIENT_ID_ใหม่_ที่คุณคัดลอกมา.apps.googleusercontent.com",
  "scopes": [
    "https://www.googleapis.com/auth/youtube.force-ssl",
    "https://www.googleapis.com/auth/youtube.upload"
  ]
}
```

**บันทึกไฟล์** (Ctrl+S)

---

### 3. Reload Extension

1. ไปที่ `chrome://extensions/`
2. หา **YouTube AI Optimizer**
3. คลิก **Reload** (ไอคอนวงกลมลูกศร)

---

### 4. ทดสอบ Login

1. คลิกที่ Extension icon
2. คลิก **"Login with Google"**
3. เลือก Google account
4. อนุญาตการเข้าถึง
5. ✅ สำเร็จ! จะเห็นวิดีโอโหลดมา

---

## 🔗 ลิงก์ที่จำเป็น:

- **Google Cloud Console Credentials:**
  https://console.cloud.google.com/apis/credentials

- **Chrome Extensions:**
  chrome://extensions/

---

## ✅ Checklist:

- [ ] สร้าง OAuth Client (Chrome Extension type)
- [ ] ใส่ Item ID: `odiehjcbdhoickcekieefdhpkppaikan`
- [ ] คัดลอก Client ID ใหม่
- [ ] แก้ไข manifest.json
- [ ] บันทึกไฟล์
- [ ] Reload Extension
- [ ] ทดสอบ Login

---

## 📸 ตัวอย่าง Client ID ที่ถูกต้อง:

```
123456789012-abc123def456ghi789jkl012mno345pq.apps.googleusercontent.com
```

- ยาวประมาณ 70+ ตัวอักษร
- ลงท้ายด้วย `.apps.googleusercontent.com`
- มีเครื่องหมาย `-` ตรงกลาง

---

**เมื่อทำเสร็จแล้ว บอกผมว่าได้ Client ID ใหม่แล้วหรือยัง จะช่วยอัพเดทไฟล์ให้!** 🚀
