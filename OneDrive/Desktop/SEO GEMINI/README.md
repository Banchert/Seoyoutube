# 🎬 YouTube AI Optimizer - Chrome Extension

## 🚀 **Chrome Extension for YouTube SEO Automation**

### **Features:**
- ✅ **YouTube Integration** - ทำงานใน YouTube โดยตรง
- ✅ **Gemini Chat Integration** - วางข้อมูลใน Gemini อัตโนมัติ
- ✅ **AI Content Generation** - สร้าง title, description, tags
- ✅ **Auto-fill** - กรอกข้อมูลอัตโนมัติ
- ✅ **Bulk Processing** - จัดการหลาย videos พร้อมกัน

---

## 📦 **Installation:**

### **1. เปิด Chrome Extensions:**
```
chrome://extensions/
```

### **2. เปิด Developer Mode:**
- คลิก toggle **"Developer mode"** (มุมขวาบน)

### **3. Load Extension:**
- คลิก **"Load unpacked"**
- เลือกโฟลเดอร์ `extension-package`
- Extension จะติดตั้งทันที

---

## 🎯 **Usage:**

### **1. YouTube Integration:**
- ไปที่ YouTube Studio หรือ YouTube
- คลิกไอคอน Extension
- เลือก videos ที่ต้องการ optimize

### **2. Gemini Chat Integration:**
- ไปที่ Gemini Chat
- Extension จะ inject ข้อมูลอัตโนมัติ
- AI จะสร้าง content ให้

### **3. Auto-fill:**
- Extension จะกรอกข้อมูลใน forms อัตโนมัติ
- รองรับ YouTube Studio interface

---

## 🔧 **Configuration:**

### **OAuth Setup:**
1. ไปที่: https://console.cloud.google.com/apis/credentials
2. สร้าง OAuth Client ID
3. **Application type:** Chrome Extension
4. **Extension ID:** จะได้หลัง install extension
5. Enable YouTube Data API v3

### **Extension Files:**
```
extension-package/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── styles.css            # Styling
├── assets/               # Icons
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── src/
    ├── background.js     # Background service worker
    ├── content-youtube.js # YouTube page integration
    ├── content-gemini.js # Gemini chat integration
    ├── popup.js          # Popup functionality
    └── utils.js          # Utility functions
```

---

## 🛡️ **Security:**

### **Permissions:**
- `activeTab` - เข้าถึง tab ปัจจุบัน
- `scripting` - inject scripts
- `storage` - เก็บข้อมูล
- `identity` - OAuth authentication
- `notifications` - แจ้งเตือน

### **Host Permissions:**
- `https://www.youtube.com/*`
- `https://gemini.google.com/*`
- `https://*.googleapis.com/*`

---

## 🎬 **How It Works:**

### **1. YouTube Page:**
- Content script ตรวจจับ YouTube interface
- ดึงข้อมูล videos ผ่าน DOM
- แสดง optimization options

### **2. Gemini Integration:**
- Content script inject ข้อมูลเข้า Gemini chat
- ส่งคำสั่ง AI เพื่อสร้าง content
- รับผลลัพธ์กลับมา

### **3. Auto-fill:**
- กรอกข้อมูลใน YouTube Studio forms
- อัพเดท title, description, tags อัตโนมัติ

---

## 🔥 **Chrome Extension Only - No Web App!**

**Extension ทำงานได้เต็มรูปแบบ:**
- ✅ เข้าถึง YouTube โดยตรง
- ✅ Inject code เข้าหน้าเว็บ
- ✅ Auto-fill forms
- ✅ Cross-site integration
- ✅ Browser privileges

**Install จากโฟลเดอร์ `extension-package` ได้เลย!** 🚀