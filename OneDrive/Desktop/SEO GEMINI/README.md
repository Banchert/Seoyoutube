# YouTube AI Optimizer Extension

Extension สำหรับทำ SEO วิดีโอ YouTube และสร้าง Thumbnail อัตโนมัติด้วย Gemini AI

## 🚀 ฟีเจอร์

1. **ดึงวิดีโอจากช่อง YouTube** - แสดงวิดีโอทั้งหมดจากช่องพร้อม thumbnail (ไม่จำกัดจำนวน)
2. **Load More** - โหลดวิดีโอเพิ่มเติมแบบ pagination (50 วิดีโอต่อครั้ง)
3. **ค้นหาวิดีโอ** - Search box สำหรับค้นหาวิดีโอตามชื่อหรือ Video ID
4. **เลือกวิดีโอที่ต้องการ** - Checkbox เลือกได้หลายวิดีโอพร้อมกัน (ไม่จำกัดจำนวน)
5. **Select All / Deselect All** - เลือกหรือยกเลิกทั้งหมดได้ในคลิกเดียว
6. **แสดงจำนวนที่เลือก** - เห็นจำนวนวิดีโอที่เลือกแบบ real-time
7. **ทำ SEO อัตโนมัติ** - ส่งลิงก์วิดีโอไปยัง Gemini เพื่อสร้าง Title, Description, Tags
8. **อัพเดท SEO ผ่าน API** - นำข้อมูลจาก Gemini ไปอัพเดทวิดีโอผ่าน YouTube API
9. **สร้าง Thumbnail** - ใช้ Gemini Nano Banana Pro สร้างรูปหน้าปก
10. **อัพโหลด Thumbnail** - ดาวน์โหลดรูปจาก Gemini แล้วอัพโหลดผ่าน YouTube API

## 📋 ขั้นตอนการติดตั้ง

### 1. ตั้งค่า Google Cloud Console

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้าง Project ใหม่หรือเลือก Project ที่มีอยู่
3. เปิดใช้งาน APIs:
   - YouTube Data API v3
   - Google Identity API

4. สร้าง OAuth 2.0 Client ID:
   - ไปที่ **APIs & Services > Credentials**
   - คลิก **Create Credentials > OAuth client ID**
   - เลือก **Chrome Extension**
   - ใส่ Extension ID (จะได้หลังจากโหลด Extension ครั้งแรก)

5. เพิ่ม Authorized redirect URIs:
   ```
   http://localhost:3000
   http://localhost:5173
   http://127.0.0.1:3001
   http://127.0.0.1:5173
   http://localhost:3001
   http://localhost:3002
   http://localhost:5174
   http://127.0.0.1:3000
   http://127.0.0.1:3002
   ```

6. สร้าง API Key สำหรับ Gemini:
   - ไปที่ [Google AI Studio](https://makersuite.google.com/app/apikey)
   - สร้าง API Key

### 2. ตั้งค่า Extension

1. Clone หรือดาวน์โหลดโปรเจค
2. แก้ไขไฟล์ `.env`:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   GEMINI_API_KEY=your_gemini_api_key
   VITE_GOOGLE_CLOUD_API_KEY=your_youtube_api_key
   VITE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   VITE_CLIENT_SECRET=your_client_secret
   ```

3. โหลด Extension ใน Chrome:
   - เปิด `chrome://extensions/`
   - เปิด **Developer mode**
   - คลิก **Load unpacked**
   - เลือกโฟลเดอร์โปรเจค

### 3. อัพเดท Client ID

1. หลังจากโหลด Extension แล้ว คัดลอก Extension ID
2. กลับไปที่ Google Cloud Console
3. แก้ไข OAuth Client ID ใส่ Extension ID
4. Reload Extension

## 🎯 วิธีใช้งาน

1. **Login**
   - คลิกที่ Extension icon
   - กดปุ่ม "LOGIN WITH GOOGLE"
   - อนุญาตการเข้าถึง YouTube

2. **ดูและเลือกวิดีโอ**
   - Extension จะดึงวิดีโอล่าสุด 50 วิดีโอมาแสดงพร้อม thumbnail
   - ใช้ Search box ค้นหาวิดีโอที่ต้องการ
   - กด "Load More Videos" เพื่อโหลดวิดีโอเพิ่มเติม (ไม่จำกัดจำนวน)
   - เลือก checkbox วิดีโอที่ต้องการทำ SEO (เลือกได้หลายคลิป)
   - ใช้ปุ่ม "Select All" เพื่อเลือกทั้งหมด หรือ "Deselect All" เพื่อยกเลิก
   - ดูจำนวนวิดีโอที่เลือกได้ที่ "X videos selected"

3. **เริ่มทำ SEO**
   - กดปุ่ม "OPTIMIZE SELECTED (X)" โดย X คือจำนวนวิดีโอที่เลือก
   - Extension จะทำงานอัตโนมัติ:
     - เปิด Gemini ใน tab ใหม่
     - วางคำสั่ง SEO พร้อมลิงก์วิดีโอ
     - รอรับคำตอบจาก Gemini (Title, Description, Tags)
     - อัพเดทข้อมูลผ่าน YouTube API
     - วางคำสั่งสร้างรูป Thumbnail
     - ดาวน์โหลดรูปและอัพโหลดผ่าน YouTube API
     - ทำซ้ำกับวิดีโอถัดไปจนครบทุกคลิปที่เลือก

4. **ติดตามความคืบหน้า**
   - ดู Progress bar แสดงเปอร์เซ็นต์ความคืบหน้า
   - ดู "X/Y videos completed" แสดงจำนวนที่เสร็จแล้ว
   - ดู Status message แสดงวิดีโอที่กำลังประมวลผล

## 📁 โครงสร้างไฟล์

```
SEO GEMINI/
├── manifest.json           # Chrome Extension manifest
├── popup.html             # UI ของ Extension popup
├── styles.css             # CSS สำหรับ popup
├── .env                   # API Keys (ห้าม commit)
├── .gitignore            # Git ignore file
├── assets/
│   ├── icon-16.png       # Icon 16x16
│   ├── icon-48.png       # Icon 48x48
│   └── icon-128.png      # Icon 128x128
└── src/
    ├── popup.js          # Logic สำหรับ popup UI
    ├── background.js     # Service worker (background process)
    ├── content-gemini.js # Content script สำหรับ Gemini
    ├── content-youtube.js # Content script สำหรับ YouTube
    ├── config.js         # Configuration และ constants
    └── utils.js          # Utility functions
```

## ⚙️ การทำงานของ Extension

### Flow การทำ SEO:

1. **Popup** → ผู้ใช้เลือกวิดีโอและกด "Optimize"
2. **Background** → รับคำสั่งและเริ่ม optimization queue
3. **Background** → เปิด Gemini tab
4. **Content Script (Gemini)** → วางคำสั่ง SEO + ลิงก์วิดีโอ
5. **Content Script (Gemini)** → รอรับคำตอบ (JSON format)
6. **Background** → รับข้อมูล SEO และอัพเดทผ่าน YouTube API
7. **Content Script (Gemini)** → วางคำสั่งสร้างรูป Thumbnail
8. **Content Script (Gemini)** → รอรับรูปและดาวน์โหลด
9. **Background** → อัพโหลด Thumbnail ผ่าน YouTube API
10. **Background** → ทำซ้ำกับวิดีโอถัดไป

### คำสั่ง Prompt:

**SEO Prompt:**
```
วิเคราะห์วิดีโอ YouTube ที่ลิงก์นี้: {video_url} และทำ SEO ให้วิดีโอนี้ 
โดยให้ผลลัพธ์เป็น JSON format เท่านั้น ประกอบด้วย:
1. "title": ชื่อวิดีโอใหม่ที่น่าสนใจและดึงดูด (ไม่เกิน 100 ตัวอักษร)
2. "description": คำอธิบายวิดีโอที่ละเอียดและมีคีย์เวิร์ด (ไม่เกิน 5000 ตัวอักษร)
3. "tags": รายการแฮชแท็กที่เกี่ยวข้องสูงสุด 15 รายการ
4. "summary": สรุปเนื้อหาวิดีโอสั้นๆ
```

**Thumbnail Prompt:**
```
สร้างรูปหน้าปกวิดีโอ YouTube คุณภาพสูงด้วย Gemini 3 Pro (Nano Banana) 
ขนาด 1280x720 พิกเซล สำหรับวิดีโอชื่อ: '{video_title}' 
รูปแบบเป็นสไตล์ที่ดึงดูดสายตาและเกี่ยวข้องกับเนื้อหาของวิดีโอ
```

## 🔒 ความปลอดภัย

- ไฟล์ `.env` ถูกเพิ่มใน `.gitignore` แล้ว
- **ห้าม commit API Keys** ลง Git
- ควรสร้าง API Keys ใหม่หากโค้ดถูกแชร์สาธารณะ
- ใช้ OAuth 2.0 สำหรับการ login ที่ปลอดภัย

## 🐛 การแก้ปัญหา

### ปุ่ม Login ไม่ทำงาน
- ตรวจสอบว่าเพิ่ม `identity` permission ใน manifest.json แล้ว
- ตรวจสอบ Client ID ใน manifest.json ถูกต้อง
- เปิด DevTools ของ popup (คลิกขวา > Inspect) ดู Console

### ไม่สามารถดึงวิดีโอได้
- ตรวจสอบว่า login สำเร็จแล้ว
- ตรวจสอบ YouTube Data API เปิดใช้งานแล้ว
- ตรวจสอบ API Key ถูกต้อง

### Gemini ไม่ตอบกลับ
- ตรวจสอบว่าเปิด Gemini tab สำเร็จ
- ตรวจสอบ selector ใน content-gemini.js ยังใช้ได้
- เปิด DevTools ของ Gemini tab ดู Console

### Thumbnail ไม่อัพโหลด
- ตรวจสอบว่ารูปดาวน์โหลดสำเร็จ
- ตรวจสอบขนาดรูปไม่เกิน 2MB
- ตรวจสอบ YouTube API quota

## 📝 License

MIT License - ใช้งานได้อย่างอิสระ

## 👨‍💻 Developer

สร้างโดย AI Assistant (Kiro) สำหรับการทำ SEO วิดีโอ YouTube อัตโนมัติ
