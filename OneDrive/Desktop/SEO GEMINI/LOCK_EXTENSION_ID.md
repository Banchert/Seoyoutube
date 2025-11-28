# 🔒 Lock Extension ID ให้คงที่

## ปัญหา:
Extension ID จะเปลี่ยนทุกครั้งที่ลบและโหลด Extension ใหม่

## วิธีแก้:
เพิ่ม `key` ใน manifest.json เพื่อ lock Extension ID

---

## ขั้นตอนที่ 1: สร้าง Private Key

### วิธีที่ 1: ใช้ Chrome สร้าง (แนะนำ)

1. โหลด Extension ครั้งแรก (unpacked)
2. ไปที่ `chrome://extensions/`
3. คลิก **Pack extension**
4. **Extension root directory:** เลือกโฟลเดอร์ `SEO GEMINI`
5. **Private key file:** ปล่อยว่าง (ครั้งแรก)
6. คลิก **Pack Extension**
7. จะได้ไฟล์ 2 ไฟล์:
   - `SEO GEMINI.crx` (ไฟล์ Extension)
   - `SEO GEMINI.pem` (Private key) **เก็บไว้ดีๆ!**

### วิธีที่ 2: ดึง key จาก Extension ที่โหลดแล้ว

1. โหลด Extension (unpacked)
2. ไปที่ `chrome://extensions/`
3. เปิด Developer mode
4. คลิก **Pack extension**
5. **Extension root directory:** เลือกโฟลเดอร์
6. คลิก **Pack Extension**
7. เก็บไฟล์ `.pem` ไว้

---

## ขั้นตอนที่ 2: แปลง .pem เป็น key string

### วิธีที่ 1: ใช้ Online Tool
1. เปิดไฟล์ `.pem` ด้วย text editor
2. คัดลอกเนื้อหาทั้งหมด
3. ไปที่: https://developer.chrome.com/docs/extensions/mv3/manifest/key/
4. ใช้ tool แปลง PEM เป็น key string

### วิธีที่ 2: ใช้ Command Line (ถ้ามี OpenSSL)
```bash
openssl rsa -in SEO\ GEMINI.pem -pubout -outform DER | openssl base64 -A
```

### วิธีที่ 3: ดึงจาก Extension ที่ Pack แล้ว
1. Pack extension ด้วย .pem file
2. ติดตั้ง .crx file
3. ไปที่ `chrome://extensions/`
4. เปิด Developer mode
5. คลิก **Inspect views: service worker**
6. ใน Console พิมพ์:
   ```javascript
   chrome.runtime.getManifest().key
   ```
7. คัดลอก key ที่แสดง

---

## ขั้นตอนที่ 3: เพิ่ม key ใน manifest.json

เปิดไฟล์ `manifest.json` แล้วเพิ่ม `key`:

```json
{
  "manifest_version": 3,
  "name": "YouTube AI Optimizer",
  "version": "1.0.0",
  "key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...(key ยาวมาก)...IDAQAB",
  "description": "Automate YouTube video SEO and thumbnail generation using AI",
  ...
}
```

**หมายเหตุ:** key จะยาวมาก (300+ ตัวอักษร)

---

## ขั้นตอนที่ 4: ทดสอบ

1. บันทึก manifest.json
2. ลบ Extension เดิม
3. โหลด Extension ใหม่ (Load unpacked)
4. ตรวจสอบ Extension ID
5. ✅ ID ควรเป็น: `odiehjcbdhoickcekieefdhpkppaikan`

---

## 🎯 วิธีที่ง่ายที่สุด (แนะนำ)

### ใช้ Extension ID ปัจจุบัน:

เนื่องจากคุณมี Extension ID แล้ว: `odiehjcbdhoickcekieefdhpkppaikan`

**ทำแบบนี้:**

1. **อย่าลบ Extension** ที่โหลดอยู่
2. **Pack Extension** เพื่อสร้าง .pem file:
   - `chrome://extensions/`
   - คลิก **Pack extension**
   - เลือกโฟลเดอร์ `SEO GEMINI`
   - คลิก **Pack Extension**
   - เก็บไฟล์ `.pem` ไว้ดีๆ

3. **ดึง key จาก Extension:**
   - คลิก **Inspect views: service worker** (ใน Extension card)
   - ใน Console พิมพ์:
     ```javascript
     chrome.runtime.getManifest().key
     ```
   - คัดลอก key ที่แสดง

4. **เพิ่ม key ใน manifest.json:**
   ```json
   {
     "manifest_version": 3,
     "name": "YouTube AI Optimizer",
     "version": "1.0.0",
     "key": "KEY_ที่คัดลอกมา",
     ...
   }
   ```

5. **บันทึกและ Reload:**
   - บันทึก manifest.json
   - Reload Extension
   - Extension ID จะยังคงเป็น `odiehjcbdhoickcekieefdhpkppaikan`

---

## ⚠️ สำคัญมาก!

1. **เก็บไฟล์ .pem ไว้ดีๆ** - ถ้าหายจะไม่สามารถใช้ Extension ID เดิมได้
2. **อย่า commit .pem ลง Git** - เป็นความลับ
3. **Backup .pem file** - เก็บไว้หลายที่
4. **key ใน manifest.json เป็น public key** - ไม่เป็นความลับ

---

## 📁 โครงสร้างไฟล์

```
SEO GEMINI/
├── manifest.json (มี key)
├── SEO GEMINI.pem (เก็บไว้ดีๆ - อย่า commit)
├── src/
├── assets/
└── ...
```

---

## ✅ ผลลัพธ์

เมื่อเพิ่ม key แล้ว:
- ✅ Extension ID จะคงที่: `odiehjcbdhoickcekieefdhpkppaikan`
- ✅ ลบและโหลดใหม่ ID ไม่เปลี่ยน
- ✅ ไม่ต้องอัพเดท OAuth Client ใหม่
- ✅ ใช้ Client ID เดิมได้ตลอด

---

## 🔧 ถ้าต้องการความช่วยเหลือ

บอกผมว่าคุณอยู่ขั้นตอนไหน:
1. ยังไม่มี .pem file?
2. มี .pem แล้วแต่ไม่รู้จะแปลงเป็น key?
3. มี key แล้วแต่ไม่รู้จะใส่ใน manifest?

ผมจะช่วยแนะนำต่อครับ! 🚀
