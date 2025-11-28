// วางโค้ดนี้ใน Console ของ Extension popup
// เพื่อดู Extension ID

console.log('=== Extension Information ===');
console.log('Extension ID:', chrome.runtime.id);
console.log('Extension Name:', chrome.runtime.getManifest().name);
console.log('Extension Version:', chrome.runtime.getManifest().version);
console.log('OAuth Client ID:', chrome.runtime.getManifest().oauth2.client_id);
console.log('============================');

// คัดลอก Extension ID ไปใส่ใน Google Cloud Console
alert('Extension ID: ' + chrome.runtime.id + '\n\nคัดลอก ID นี้ไปใส่ใน Google Cloud Console');
