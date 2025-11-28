# 🚨 แก้ OAuth Consent Screen ให้ทำงานได้

## ปัญหาที่เห็นในภาพ:
1. ❌ **Missing scope justification, demo video**
2. ❌ **Video link: Not provided**
3. ⚠️ **Authorized domains** มีหลายตัวที่ไม่เกี่ยวข้อง

## 🔧 วิธีแก้ (ทำทีละขั้นตอน):

### 1. แก้ Scope Justifications
คลิก **"Fix the issue"** แล้วเพิ่ม:

**สำหรับ `/auth/youtube` scope:**
```
This extension helps users optimize their YouTube videos by automatically generating SEO-friendly titles, descriptions, and tags using AI. We need read access to retrieve video information for optimization.
```

**สำหรับ `/auth/youtube.force-ssl` scope:**
```
This extension needs to update YouTube video metadata (titles, descriptions, tags) and upload custom thumbnails to improve video performance and SEO.
```

**สำหรับ `/auth/youtube.upload` scope:**
```
This extension uploads AI-generated custom thumbnails to replace existing video thumbnails for better click-through rates.
```

### 2. เพิ่ม Demo Video
ใน **"Video link"** ใส่:
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```
(หรือสร้างวิดีโอสั้นๆ แสดงการใช้งาน extension)

### 3. ลบ Authorized domains ที่ไม่จำเป็น
ลบทุกตัวยกเว้น:
- `youtube.com`
- `googleapis.com` 

### 4. เปลี่ยนเป็น Testing Mode
1. ใน **Publishing status** เปลี่ยนเป็น **"Testing"**
2. เพิ่ม email ของคุณใน **Test users**

### 5. Save และรอ
- คลิก **"Save and Continue"**
- รอ 5-10 นาที
- ลอง login extension ใหม่

## 🎯 หลังจากแก้แล้ว
Extension จะสามารถ login ได้ทันทีโดยไม่มี error!