# 🔐 VictorSign Multi-User Secure System - Deploy Guide

## 🎉 อัพเดทเสร็จแล้ว!

### 📁 **ไฟล์ที่อัพเดท:**
- `web-app/index.html` - **VictorSign Multi-User Secure System**

### 🚀 **Deploy ไปที่ GitHub Pages:**

#### **1. Commit & Push:**
```bash
git add .
git commit -m "🔐 Add VictorSign Multi-User Secure System with Auto-Reset Keys"
git push origin main
```

#### **2. GitHub Pages Settings:**
- ไปที่: https://github.com/Banchert/Seoyoutube/settings/pages
- **Source:** Deploy from a branch
- **Branch:** main
- **Folder:** / (root) หรือ /web-app
- คลิก **Save**

#### **3. URL ที่ใช้งาน:**
```
https://banchert.github.io/Seoyoutube/web-app/
```

---

## 🔐 **VictorSign Security Features:**

### **1. VictorSign Authentication:**
- **รหัสผ่าน:** `Victorsign`
- ระบบจดจำผู้ใช้เดิม/ใหม่
- Session Management แบบปลอดภัย

### **2. Auto-Reset Security System:**
- ✅ **Auto-reset เมื่อปิดหน้าต่าง/browser**
- ✅ **Auto-reset เมื่อออกจากระบบ**
- ✅ **Auto-reset ทุก 5 นาที (อัตโนมัติ)**
- ✅ **Auto-reset เมื่อ switch tab นาน (1 นาที)**
- ✅ **Session timeout 30 นาที**

### **3. User Management:**
- จดจำผู้ใช้เดิม (Returning User)
- ต้อนรับผู้ใช้ใหม่ (New User)
- เก็บประวัติการ login
- แสดงสถานะ session แบบ real-time

### **4. Data Protection:**
- เข้ารหัสข้อมูลใน sessionStorage
- ใช้ sessionStorage (หายเมื่อปิด browser)
- Clear ข้อมูลอัตโนมัติ
- Security timer แสดงเวลาที่เหลือ

### **5. Multi-User Support:**
- แต่ละคนใช้ OAuth Client ID ของตัวเอง
- ข้อมูลแยกกันตาม User
- บันทึกประวัติการ Optimize
- ปลอดภัย - ไม่มี Client Secret

---

## 🚀 **การใช้งาน:**

### **Step 1: VictorSign Login**
1. เข้าไปที่ https://banchert.github.io/Seoyoutube/web-app/
2. ใส่รหัสผ่าน: `Victorsign`
3. ใส่ชื่อของคุณ
4. คลิก "🔓 Login with VictorSign"

### **Step 2: Setup OAuth Client**
1. คลิก "🔧 Setup Your OAuth Client"
2. ใส่ Google OAuth Client ID ของคุณ
3. คลิก "🔐 Save & Login"

### **Step 3: Connect YouTube**
1. คลิก "🔐 Login with Google"
2. อนุญาต YouTube permissions
3. รอให้ redirect กลับมา

### **Step 4: Optimize Videos**
1. คลิก "🔄 Load Videos"
2. เลือก videos ที่ต้องการ optimize
3. คลิก "✨ Optimize Selected Videos"

### **Step 5: Security Monitoring**
- คลิก "⏰ Security Timer" เพื่อดูเวลาที่เหลือ
- คลิก "🔄 Reset Keys" เพื่อรีเซ็ตด้วยตนเอง
- คลิก "🚪 Logout" เพื่อออกจากระบบ

---

## 🛡️ **Security Features ที่เพิ่มเข้าไป:**

### **Real-time Security Timer:**
- แสดงเวลา session ที่เหลือ (30 นาที)
- แสดงเวลา auto-reset ถัดไป (5 นาที)

### **Force Reset Keys:**
- ปุ่มรีเซ็ตคีย์ด้วยตนเอง
- ล้างข้อมูลทั้งหมดทันที

### **Encrypted Storage:**
- เข้ารหัสข้อมูลด้วย Base64 + JSON
- ใช้ sessionStorage (หายเมื่อปิด browser)

### **Tab Switch Protection:**
- ตรวจจับการ switch tab
- รีเซ็ตคีย์หากออกจาก tab นาน 1 นาที

### **Session Timeout:**
- หมดเวลา session อัตโนมัติหลัง 30 นาที
- แจ้งเตือนก่อนออกจากระบบ

---

## 🎯 **ผลลัพธ์:**

**✅ Web App ที่ปลอดภัยสูงสุดพร้อม VictorSign Authentication และ Multi-User Support!**

### **URL สำหรับใช้งาน:**
```
https://banchert.github.io/Seoyoutube/web-app/
```

### **รหัสผ่าน VictorSign:**
```
Victorsign
```

---

## 📝 **หมายเหตุ:**

1. **OAuth Client ID:** แต่ละคนต้องสร้าง Client ID ของตัวเอง
2. **ความปลอดภัย:** ระบบจะรีเซ็ตคีย์อัตโนมัติเพื่อป้องกันการรั่วไหล
3. **Multi-User:** รองรับผู้ใช้หลายคนพร้อมกัน
4. **Session Management:** จดจำผู้ใช้เดิมและต้อนรับผู้ใช้ใหม่

**🛡️ ระบบความปลอดภัยระดับสูงพร้อมใช้งาน!**