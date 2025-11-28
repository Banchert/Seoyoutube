# 🧪 ทดสอบ Debug Tools

## ขั้นตอนการทดสอบ:

### 1. Reload Extension
```
1. ไปที่ chrome://extensions/
2. หา "YouTube AI Optimizer"
3. คลิกปุ่ม reload (🔄)
```

### 2. เปิด Extension Popup
```
1. คลิกที่ Extension icon
2. ควรเห็นหน้า Login with Google
3. ควรเห็น Debug Tools ด้านล่าง:
   🔍 วินิจฉัยปัญหา
   🔐 ทดสอบ Login  
   📊 Debug Info
```

### 3. เปิด Console
```
1. คลิกขวาที่ popup
2. เลือก "Inspect" หรือ "ตรวจสอบ"
3. ไปที่แท็บ "Console"
```

### 4. ทดสอบ Debug Tools

#### 4.1 ทดสอบ Debug Info
```
1. คลิกปุ่ม "📊 Debug Info"
2. ดู Console ควรเห็น:
   === DEBUG INFO ===
   Extension ID: odiehjcbdhoickcekie efdhpkppaikan
   Manifest: {...}
   Storage: {...}
   Auth Status: {...}
```

#### 4.2 ทดสอบวินิจฉัยปัญหา
```
1. คลิกปุ่ม "🔍 วินิจฉัยปัญหา"
2. ดู Console ควรเห็น:
   🔍 เริ่มวินิจฉัยและแก้ไขปัญหา OAuth...
   📋 Test 1: Extension Information
   ✅ Extension ID: ...
   🔐 Test 2: OAuth Configuration
   ✅ Client ID: ...
   ... (และอื่นๆ)
```

#### 4.3 ทดสอบ Login
```
1. คลิกปุ่ม "🔐 ทดสอบ Login"
2. ดู Console และรอ OAuth popup
3. ดูผลลัพธ์ใน Console
```

---

## ถ้า Debug Tools ไม่แสดง:

### วิธีแก้ที่ 1: ตรวจสอบ HTML
เปิด DevTools > Elements > ค้นหา "debug-section"

### วิธีแก้ที่ 2: ทดสอบฟังก์ชันโดยตรง
วางโค้ดนี้ใน Console:

```javascript
// ทดสอบว่าฟังก์ชันมีหรือไม่
console.log('diagnoseAndFix:', typeof diagnoseAndFix);
console.log('testLoginNow:', typeof testLoginNow);
console.log('showDebugInfo:', typeof showDebugInfo);

// ถ้ามี ให้เรียกใช้
if (typeof diagnoseAndFix === 'function') {
    diagnoseAndFix();
} else {
    console.error('ฟังก์ชัน diagnoseAndFix ไม่พบ');
}
```

### วิธีแก้ที่ 3: เรียกใช้ฟังก์ชันโดยตรง
```javascript
// วินิจฉัยปัญหา
diagnoseAndFix();

// ทดสอบ login
testLoginNow();

// แสดง debug info
showDebugInfo();
```

---

## ผลลัพธ์ที่คาดหวัง:

### ถ้าทุกอย่างปกติ:
```
✅ Extension ID: odiehjcbdhoickcekie efdhpkppaikan
✅ Client ID: 862891517207-n1teon7k1u0si4k4pa65q38g9ffn3pfr.apps.googleusercontent.com
✅ Scopes: [youtube.force-ssl, youtube.upload]
✅ Permissions ครบถ้วน
⚠️ ไม่มี Token (ยังไม่เคย login สำเร็จ)
❌ Identity API Error: The user is not signed in
```

### แล้วจะเห็นวิธีแก้:
```
🔧 OAuth Consent Screen Error - วิธีแก้:
1. ไปที่: https://console.cloud.google.com/apis/credentials/consent
2. User Type: เลือก "External"
3. เพิ่ม Test users: [your-email@gmail.com]
...
```

---

## หากยังไม่เห็น Debug Tools:

### Manual Debug (วางใน Console):

```javascript
// === Manual Debug Script ===
console.log('🔍 Manual Debug Started...\n');

// Test Extension
console.log('Extension ID:', chrome.runtime.id);
console.log('Manifest:', chrome.runtime.getManifest());

// Test OAuth Config
const oauth = chrome.runtime.getManifest().oauth2;
console.log('OAuth Config:', oauth);

// Test Storage
chrome.storage.local.get(null, (data) => {
    console.log('Storage:', data);
});

// Test Identity API
chrome.identity.getAuthToken({ interactive: false }, (token) => {
    if (chrome.runtime.lastError) {
        console.error('❌ Error:', chrome.runtime.lastError.message);
        
        const error = chrome.runtime.lastError.message;
        if (error.includes('not signed in')) {
            console.log('\n🔧 วิธีแก้:');
            console.log('1. ไปที่ https://console.cloud.google.com/apis/credentials/consent');
            console.log('2. ตรวจสอบ OAuth Consent Screen');
            console.log('3. เพิ่ม Test users (email ของคุณ)');
            console.log('4. รอ 2-3 นาที แล้วลองใหม่');
        }
    } else {
        console.log('✅ Token:', token);
    }
});

console.log('\n✅ Manual Debug Complete');
```

---

## สรุป:

1. **Reload Extension** ก่อน
2. **เปิด popup** และ **Console**
3. **คลิก Debug Tools** หรือ **วางโค้ด manual**
4. **ดูผลลัพธ์** และ **ทำตามวิธีแก้**

ระบบจะบอกปัญหาที่แท้จริงและวิธีแก้ให้เลยครับ! 🚀