# คู่มือการทดสอบ YouTube AI Optimizer Extension

## 📋 Checklist การทดสอบ

### 1. ติดตั้ง Extension
- [ ] โหลด Extension ใน chrome://extensions/
- [ ] เห็น icon ของ Extension ใน toolbar
- [ ] ไม่มี error ใน Console

### 2. ทดสอบ Login
- [ ] คลิก Extension icon
- [ ] เห็นหน้า popup แสดง "Login with Google"
- [ ] กดปุ่ม Login
- [ ] เปิดหน้า OAuth consent screen
- [ ] เลือก Google account
- [ ] อนุญาตการเข้าถึง YouTube
- [ ] กลับมาที่ popup แสดงหน้า main section

### 3. ทดสอบดึงวิดีโอ
- [ ] หลัง login เห็นข้อความ "Loading videos..."
- [ ] วิดีโอโหลดมาแสดง (50 คลิปแรก)
- [ ] แต่ละวิดีโอแสดง:
  - Thumbnail รูปภาพ
  - ชื่อวิดีโอ
  - Video ID
  - วันที่อัพโหลด
  - Checkbox
- [ ] แสดงจำนวนวิดีโอทั้งหมด "Your Videos (X)"

### 4. ทดสอบ Search
- [ ] พิมพ์ชื่อวิดีโอใน Search box
- [ ] วิดีโอที่ไม่ตรงถูกซ่อน
- [ ] วิดีโอที่ตรงแสดงอยู่
- [ ] ลบข้อความใน Search box แล้ววิดีโอกลับมาแสดงทั้งหมด

### 5. ทดสอบ Select/Deselect
- [ ] กด checkbox วิดีโอ 1 คลิป
- [ ] แสดง "1 video selected"
- [ ] ปุ่ม "Optimize Selected (1)" เปิดใช้งาน
- [ ] กด "Select All"
- [ ] checkbox ทุกคลิปถูกติ๊ก
- [ ] แสดง "X videos selected"
- [ ] กด "Deselect All"
- [ ] checkbox ทุกคลิปถูกยกเลิก
- [ ] แสดง "0 videos selected"
- [ ] ปุ่ม Optimize ถูก disable

### 6. ทดสอบ Load More
- [ ] เลื่อนลงล่างสุดของ video list
- [ ] เห็นปุ่ม "Load More Videos"
- [ ] กดปุ่ม Load More
- [ ] แสดง "Loading..."
- [ ] วิดีโอเพิ่มเติม 50 คลิปโหลดมา
- [ ] จำนวนวิดีโอเพิ่มขึ้น "Your Videos (100)"
- [ ] ถ้าโหลดครบแล้ว ปุ่ม Load More หายไป

### 7. ทดสอบ Optimization (ขั้นตอนสำคัญ)
- [ ] เลือกวิดีโอ 1-2 คลิป (ทดสอบก่อน)
- [ ] กดปุ่ม "Optimize Selected (X)"
- [ ] แสดง Status: "Starting optimization..."
- [ ] เปิด Gemini tab ใหม่
- [ ] รอ 2-3 วินาที
- [ ] เห็นคำสั่ง SEO ถูกวางใน Gemini input box
- [ ] Gemini เริ่มตอบกลับ
- [ ] รอจนกว่า Gemini ตอบเสร็จ (ประมาณ 30-60 วินาที)
- [ ] Extension ดึงข้อมูล JSON จาก Gemini
- [ ] อัพเดทวิดีโอผ่าน YouTube API
- [ ] แสดง Status: "Processing thumbnail..."
- [ ] วางคำสั่งสร้างรูปใน Gemini
- [ ] รอจนกว่า Gemini สร้างรูปเสร็จ
- [ ] ดาวน์โหลดรูปและอัพโหลดผ่าน YouTube API
- [ ] แสดง Status: "✓ Video optimized successfully"
- [ ] ทำซ้ำกับวิดีโอถัดไป

### 8. ทดสอบ Progress Tracking
- [ ] เห็น Progress bar แสดงความคืบหน้า
- [ ] แสดง "X/Y videos completed"
- [ ] Progress bar เพิ่มขึ้นเมื่อแต่ละวิดีโอเสร็จ
- [ ] เมื่อเสร็จทั้งหมด แสดง "All videos optimized successfully!"

### 9. ทดสอบ Settings
- [ ] เปิด/ปิด "Auto-close Gemini tabs"
- [ ] เปิด/ปิด "Notify when optimization is complete"
- [ ] Settings ถูกบันทึก (reload extension แล้วยังคงอยู่)

### 10. ทดสอบ Logout
- [ ] กดปุ่ม "Logout"
- [ ] กลับไปหน้า Login
- [ ] ข้อมูลถูกล้าง

## 🐛 การแก้ปัญหาที่พบบ่อย

### ปัญหา: Login ไม่ได้
**วิธีแก้:**
1. ตรวจสอบ Client ID ใน manifest.json
2. ตรวจสอบ Authorized redirect URIs ใน Google Cloud Console
3. เปิด DevTools ของ popup (คลิกขวา > Inspect) ดู error

### ปัญหา: ดึงวิดีโอไม่ได้
**วิธีแก้:**
1. ตรวจสอบว่า login สำเร็จแล้ว
2. ตรวจสอบ YouTube Data API เปิดใช้งานแล้ว
3. ตรวจสอบ API quota ยังเหลืออยู่
4. เปิด DevTools ของ background (chrome://extensions/ > Service Worker) ดู error

### ปัญหา: Gemini ไม่ตอบกลับ
**วิธีแก้:**
1. ตรวจสอบว่า Gemini tab เปิดสำเร็จ
2. เปิด DevTools ของ Gemini tab ดู Console
3. ตรวจสอบ selector ใน content-gemini.js ยังใช้ได้หรือไม่
4. Gemini อาจเปลี่ยน UI - ต้องอัพเดท selector

### ปัญหา: JSON parsing error
**วิธีแก้:**
1. ตรวจสอบ prompt ใน config.js
2. ตรวจสอบว่า Gemini ตอบกลับเป็น JSON format หรือไม่
3. อาจต้องปรับ prompt ให้ชัดเจนขึ้น

### ปัญหา: Thumbnail ไม่อัพโหลด
**วิธีแก้:**
1. ตรวจสอบว่ารูปดาวน์โหลดสำเร็จ
2. ตรวจสอบขนาดรูปไม่เกิน 2MB
3. ตรวจสอบ YouTube API quota
4. ตรวจสอบ permission ใน OAuth scope

## 📊 Expected Results

### ผลลัพธ์ที่คาดหวัง:
- Login สำเร็จภายใน 5 วินาที
- ดึงวิดีโอ 50 คลิปภายใน 3-5 วินาที
- Search ทำงานแบบ real-time
- Select/Deselect ทำงานทันที
- Optimization 1 วิดีโอใช้เวลา 2-3 นาที:
  - SEO: 30-60 วินาที
  - Thumbnail: 60-90 วินาที
  - API upload: 10-20 วินาที

### Performance:
- Popup เปิดภายใน 1 วินาที
- Video list scroll ลื่นไหล
- Search ไม่ lag
- Memory usage < 100MB

## 🔍 Debug Tips

### เปิด DevTools:
1. **Popup**: คลิกขวาที่ popup > Inspect
2. **Background**: chrome://extensions/ > Service Worker > Inspect
3. **Content Script**: เปิด DevTools ของ tab ที่ inject (Gemini/YouTube)

### ดู Logs:
```javascript
// ใน popup.js
console.log('Popup action:', action);

// ใน background.js
console.log('Background received:', request);

// ใน content-gemini.js
console.log('Gemini content script:', message);
```

### ตรวจสอบ Storage:
```javascript
// ใน Console
chrome.storage.local.get(null, (data) => console.log(data));
```

### ตรวจสอบ Auth Token:
```javascript
// ใน Console
chrome.identity.getAuthToken({interactive: false}, (token) => console.log(token));
```

## ✅ Success Criteria

Extension ถือว่าทำงานสำเร็จเมื่อ:
- [ ] Login ได้
- [ ] ดึงวิดีโอมาแสดงได้
- [ ] เลือกวิดีโอได้
- [ ] Search ทำงาน
- [ ] Load More ทำงาน
- [ ] Optimize วิดีโอได้สำเร็จ (SEO + Thumbnail)
- [ ] Progress tracking แสดงถูกต้อง
- [ ] Settings บันทึกได้
- [ ] Logout ได้

## 📝 Test Report Template

```
วันที่ทดสอบ: [DATE]
ผู้ทดสอบ: [NAME]
Browser: Chrome [VERSION]
Extension Version: 1.0.0

✅ ผ่าน:
- Login
- ดึงวิดีโอ
- Search
- Select/Deselect

❌ ไม่ผ่าน:
- Optimization timeout

🐛 Bugs พบ:
1. [BUG DESCRIPTION]
2. [BUG DESCRIPTION]

💡 ข้อเสนอแนะ:
- [SUGGESTION]
```
