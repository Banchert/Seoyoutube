# 🔒 ล็อค Extension ID แบบถาวร

## Extension ID ปัจจุบัน: `odiehjcbdhoickcekieefdhpkppaikan`

## 🎯 วิธีล็อค Extension ID ให้ใช้ ID เดิมตลอด:

### วิธีที่ 1: ใช้ Extension ID ปัจจุบัน (แนะนำ)

**ข้อดี:**
- ไม่ต้องเปลี่ยนอะไร
- OAuth Client ที่มีอยู่ใช้ได้เลย
- ง่ายและรวดเร็ว

**ขั้นตอน:**
1. **ใช้ Extension ID ปัจจุบัน:** `odiehjcbdhoickcekieefdhpkppaikan`
2. **อัพเดท OAuth Client ใน Google Cloud Console:**
   - ไปที่: https://console.cloud.google.com/apis/credentials
   - แก้ไข OAuth Client
   - Application ID: `odiehjcbdhoickcekieefdhpkppaikan`
   - Save

### วิธีที่ 2: สร้าง Extension Key (ซับซ้อน)

**ข้อดี:**
- ควบคุม Extension ID ได้เต็มที่
- ID จะไม่เปลี่ยนแม้ reinstall

**ข้อเสีย:**
- ซับซ้อน
- ต้องจัดการ private key
- ต้องสร้าง OAuth Client ใหม่

---

## 🚀 แนะนำ: ใช้วิธีที่ 1

เพราะ Extension ID ปัจจุบันคือ `odiehjcbdhoickcekieefdhpkppaikan` แล้ว

**แค่อัพเดท OAuth Client ให้ตรงกัน:**

1. **ไปที่:** https://console.cloud.google.com/apis/credentials
2. **หา OAuth Client:** `862891517207-n1teon7k1u0si4k4pa65q38g9ffn3pfr`
3. **คลิกแก้ไข**
4. **Application ID:** ใส่ `odiehjcbdhoickcekieefdhpkppaikan`
5. **Save**
6. **รอ 2-3 นาที**
7. **ทดสอบ login**

---

## 📋 ตรวจสอบ Extension ID ปัจจุบัน:

```javascript
// วางใน Console ของ Extension popup
console.log('Extension ID:', chrome.runtime.id);
```

---

## ✅ หลังจากอัพเดท OAuth Client:

Extension จะใช้ ID เดิม `odiehjcbdhoickcekieefdhpkppaikan` ตลอดไป
และ OAuth จะทำงานได้เพราะ Application ID ตรงกัน

---

## 🔧 ถ้าต้องการสร้าง Extension Key:

1. **รัน:** `node generate-extension-key.js`
2. **คัดลอก public key** จากไฟล์ที่สร้าง
3. **เพิ่มใน manifest.json:**
   ```json
   {
     "key": "PUBLIC_KEY_HERE",
     ...
   }
   ```
4. **Reload Extension**
5. **สร้าง OAuth Client ใหม่** ด้วย Extension ID ใหม่

---

## 💡 สรุป:

**ใช้วิธีที่ 1** - แค่อัพเดท OAuth Client ให้ตรงกับ Extension ID ปัจจุบัน

Extension ID: `odiehjcbdhoickcekieefdhpkppaikan`