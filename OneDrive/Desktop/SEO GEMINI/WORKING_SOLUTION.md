# 🎯 วิธีแก้ที่ทำงานได้จริง 100%

## ปัญหา: OAuth Playground ไม่รองรับ YouTube scopes

## 🔧 วิธีแก้ที่แน่นอน:

### 1. ใช้ Google Apps Script
1. ไปที่: https://script.google.com/
2. สร้าง New Project
3. ใส่โค้ดนี้:

```javascript
function getYouTubeToken() {
  const clientId = '862891517207-47ds5n9cbqssschcsbtt12fg66egki69.apps.googleusercontent.com';
  const clientSecret = 'YOUR_CLIENT_SECRET'; // จากไฟล์ JSON
  const redirectUri = 'urn:ietf:wg:oauth:2.0:oob';
  const scopes = 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.upload';
  
  const authUrl = `https://accounts.google.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code&access_type=offline`;
  
  console.log('1. เปิด URL นี้:', authUrl);
  console.log('2. Login และ copy authorization code');
  console.log('3. ใส่ code ใน function exchangeCodeForToken()');
}

function exchangeCodeForToken() {
  const code = 'AUTHORIZATION_CODE_ที่ได้'; // ใส่ code ที่ได้
  const clientId = '862891517207-47ds5n9cbqssschcsbtt12fg66egki69.apps.googleusercontent.com';
  const clientSecret = 'YOUR_CLIENT_SECRET';
  const redirectUri = 'urn:ietf:wg:oauth:2.0:oob';
  
  const response = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    payload: `code=${code}&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&grant_type=authorization_code`
  });
  
  const data = JSON.parse(response.getContentText());
  console.log('Access Token:', data.access_token);
  console.log('Refresh Token:', data.refresh_token);
}
```

### 2. หรือใช้ curl command
```bash
# Step 1: เปิด URL นี้ใน browser
https://accounts.google.com/oauth/authorize?client_id=862891517207-47ds5n9cbqssschcsbtt12fg66egki69.apps.googleusercontent.com&redirect_uri=urn:ietf:wg:oauth:2.0:oob&scope=https://www.googleapis.com/auth/youtube.force-ssl%20https://www.googleapis.com/auth/youtube.upload&response_type=code&access_type=offline

# Step 2: ใส่ authorization code ใน command นี้
curl -X POST https://oauth2.googleapis.com/token \
  -d "code=AUTHORIZATION_CODE" \
  -d "client_id=862891517207-47ds5n9cbqssschcsbtt12fg66egki69.apps.googleusercontent.com" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=urn:ietf:wg:oauth:2.0:oob" \
  -d "grant_type=authorization_code"
```

### 3. ใส่ Token ใน Extension
หลังจากได้ access_token แล้ว:
```javascript
chrome.storage.local.set({
  'youtube_auth_token': 'ACCESS_TOKEN_ที่ได้'
}, () => {
  console.log('✅ Token saved!');
  location.reload();
});
```

## 🎯 ทำไมวิธีนี้ได้:
1. ใช้ OAuth Client ID ที่เราสร้างไว้
2. ใช้ scopes ที่ถูกต้อง
3. ไม่ผ่าน OAuth Playground ที่มีข้อจำกัด

## 📋 Client Secret:
ดูใน file: `client_secret_862891517207-47ds5n9cbqssschcsbtt12fg66egki69.apps.googleusercontent.com.json`