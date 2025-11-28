# 🚀 Deploy ด้วย GitHub Pages

## Repository: https://github.com/Banchert/Seoyoutube.git

### 🎯 ขั้นตอน Deploy:

#### 1. Push web-app ไป GitHub
```bash
# Clone repository
git clone https://github.com/Banchert/Seoyoutube.git
cd Seoyoutube

# Copy web-app files
cp -r ../web-app/* .

# Add and commit
git add .
git commit -m "Deploy YouTube AI Optimizer Web App"
git push origin main
```

#### 2. Enable GitHub Pages
1. ไปที่: https://github.com/Banchert/Seoyoutube/settings/pages
2. **Source:** Deploy from a branch
3. **Branch:** main
4. **Folder:** / (root)
5. **Save**

#### 3. Web App URL จะเป็น:
```
https://banchert.github.io/Seoyoutube/
```

### 🔧 Setup OAuth สำหรับ GitHub Pages:

#### 1. สร้าง Web Application OAuth Client
- ไปที่: https://console.cloud.google.com/apis/credentials
- CREATE CREDENTIALS → OAuth client ID
- **Type:** Web application
- **Name:** YouTube AI Optimizer GitHub
- **Authorized redirect URIs:**
  ```
  https://banchert.github.io/Seoyoutube/
  https://banchert.github.io/Seoyoutube/callback
  ```

#### 2. อัพเดท index.html
แก้บรรทัดที่ 120-121:
```javascript
const CLIENT_ID = 'YOUR_NEW_WEB_CLIENT_ID';
const REDIRECT_URI = 'https://banchert.github.io/Seoyoutube/';
```

#### 3. Push อัพเดท
```bash
git add index.html
git commit -m "Update OAuth configuration"
git push origin main
```

### 🎉 ผลลัพธ์:
- **Web App URL:** https://banchert.github.io/Seoyoutube/
- **OAuth ทำงานได้จริง**
- **ใช้งานได้ทันที**

### 📋 Files ที่ต้อง push:
- index.html (main web app)
- package.json
- vercel.json
- netlify.toml
- README.md

### 🔄 ขั้นตอนถัดไป:
1. ✅ Push files ไป GitHub
2. ✅ Enable GitHub Pages
3. 🔄 Setup OAuth Client
4. 🔄 Test web app
5. 🔄 Submit Chrome Extension