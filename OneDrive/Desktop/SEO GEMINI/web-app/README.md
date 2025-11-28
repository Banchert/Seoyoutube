# YouTube AI Optimizer - Web App

## 🚀 Quick Deploy

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd web-app
vercel --prod
```

### Deploy to Netlify
1. Drag & drop `web-app` folder to https://app.netlify.com/drop
2. Or connect GitHub repo

### Deploy to GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source: `web-app` folder

## 🔧 Configuration

### 1. Create Web Application OAuth Client
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "CREATE CREDENTIALS" → "OAuth client ID"
3. Application type: **Web application**
4. Name: `YouTube AI Optimizer Web`
5. Authorized redirect URIs: `https://your-domain.com/callback`

### 2. Update Client ID
Edit `index.html` line 120:
```javascript
const CLIENT_ID = 'YOUR_WEB_APP_CLIENT_ID_HERE';
```

### 3. Test OAuth
1. Visit your deployed URL
2. Click "Login with Google"
3. Should redirect to Google OAuth

## 🎯 Features
- ✅ Responsive design
- ✅ OAuth authentication
- ✅ YouTube API integration
- ✅ Modern UI/UX

## 📱 Mobile Friendly
Works perfectly on desktop, tablet, and mobile devices.

## 🔒 Security
- Secure OAuth 2.0 flow
- HTTPS required
- No sensitive data storage