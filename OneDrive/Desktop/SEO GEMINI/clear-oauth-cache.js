// วางโค้ดนี้ใน Console ของ Extension popup เพื่อล้าง OAuth cache

console.log('🧹 ล้าง OAuth Cache...');

// ล้าง storage
chrome.storage.local.clear(() => {
    console.log('✅ ล้าง storage แล้ว');
});

// ล้าง cached auth tokens
chrome.identity.clearAllCachedAuthTokens(() => {
    console.log('✅ ล้าง cached tokens แล้ว');
    
    // รอ 2 วินาที แล้วทดสอบ login ใหม่
    setTimeout(() => {
        console.log('🔐 ทดสอบ login ใหม่...');
        
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError) {
                console.error('❌ Error:', chrome.runtime.lastError.message);
                
                // วิเคราะห์ error
                const error = chrome.runtime.lastError.message;
                if (error.includes('not granted') || error.includes('revoked')) {
                    console.log(`
🔧 OAuth ถูก revoke หรือไม่ได้ grant

วิธีแก้:
1. ไปที่ https://myaccount.google.com/permissions
2. หา "YouTube AI Optimizer" หรือ "Banchert"
3. ลบ permission ออก
4. กลับมา login ใหม่ใน Extension
5. อนุญาตสิทธิ์ทั้งหมด
                    `);
                } else if (error.includes('not signed in')) {
                    console.log(`
🔧 ปัญหา OAuth Consent Screen

ตรวจสอบ:
1. https://console.cloud.google.com/apis/credentials/consent
2. ตรวจสอบว่า Test users มี email ที่ใช้ login
3. ตรวจสอบว่า Publishing status เป็น Testing
4. ลอง Publish app เป็น Production
                    `);
                }
            } else if (token) {
                console.log('✅ Login สำเร็จ!');
                console.log('Token:', token.substring(0, 30) + '...');
                
                // บันทึก token
                chrome.storage.local.set({ youtube_auth_token: token }, () => {
                    console.log('✅ บันทึก token แล้ว');
                    console.log('🎉 Extension พร้อมใช้งาน!');
                });
            } else {
                console.log('⚠️ ไม่ได้รับ token');
            }
        });
    }, 2000);
});