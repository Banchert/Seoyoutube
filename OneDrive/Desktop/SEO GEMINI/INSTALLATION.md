# YouTube AI Optimizer - Installation & Setup Guide

This guide will walk you through the complete setup process for the YouTube AI Optimizer Chrome Extension.

## Prerequisites

Before you begin, ensure you have:

1. **Google Account**: Required for YouTube API access
2. **Chrome Browser**: Version 88 or later
3. **YouTube Channel**: With access to YouTube Studio
4. **Google Cloud Project**: For OAuth2 credentials

## Step 1: Create Google Cloud Project

### 1.1 Create a new project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click **NEW PROJECT**
4. Enter project name: `YouTube AI Optimizer`
5. Click **CREATE**

### 1.2 Enable YouTube Data API v3

1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for `YouTube Data API v3`
3. Click on it and click **ENABLE**

### 1.3 Create OAuth2 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. If prompted, configure the OAuth consent screen first:
   - User Type: **External**
   - Fill in required fields (App name, User support email, etc.)
   - Add scopes:
     - `https://www.googleapis.com/auth/youtube.force-ssl`
     - `https://www.googleapis.com/auth/youtube.upload`
   - Save and continue
4. Back to creating credentials:
   - Application type: **Desktop application**
   - Name: `YouTube AI Optimizer`
   - Click **CREATE**
5. Copy your **Client ID** (format: `xxxxx.apps.googleusercontent.com`)

## Step 2: Configure Extension

### 2.1 Update manifest.json

1. Open the `manifest.json` file in the extension directory
2. Find the `oauth2` section:
   ```json
   "oauth2": {
       "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
       "scopes": [...]
   }
   ```
3. Replace `YOUR_CLIENT_ID` with your actual Client ID from Step 1.3
4. Save the file

### 2.2 Choose Implementation

The extension includes two versions of key files:

**Option A: Basic Implementation** (Recommended for beginners)
- `src/background.js` - Core background service worker
- `src/content-gemini.js` - Gemini automation
- `src/popup.js` - Popup UI logic

**Option B: Enhanced Implementation** (Recommended for production)
- `src/background-enhanced.js` - Enhanced with better error handling
- `src/content-gemini-enhanced.js` - Enhanced with retry logic
- `src/popup-enhanced.js` - Enhanced with better UI updates

To use the enhanced version:

```bash
# Backup original files
cp src/background.js src/background.js.bak
cp src/content-gemini.js src/content-gemini.js.bak
cp src/popup.js src/popup.js.bak

# Copy enhanced versions (remove -enhanced suffix)
cp src/background-enhanced.js src/background.js
cp src/content-gemini-enhanced.js src/content-gemini.js
cp src/popup-enhanced.js src/popup.js
```

## Step 3: Load Extension in Chrome

### 3.1 Open Extensions Page

1. Open Chrome browser
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right corner)

### 3.2 Load Unpacked Extension

1. Click **Load unpacked**
2. Navigate to and select the `youtube-seo-extension` directory
3. The extension should now appear in your extensions list

### 3.3 Verify Installation

1. You should see "YouTube AI Optimizer" in your extensions list
2. Click the extension icon to open the popup
3. You should see the login screen

## Step 4: Authorize with YouTube

### 4.1 First-Time Login

1. Click the extension icon in Chrome toolbar
2. Click **Login with Google**
3. A new window will open for Google authentication
4. Select your Google account
5. Review and accept the requested permissions
6. You should be redirected back to the extension

### 4.2 Verify Authentication

1. After successful login, you should see the main interface
2. The popup should display "Ready to optimize videos"
3. You're now ready to use the extension!

## Step 5: First-Time Usage

### 5.1 Go to YouTube Studio

1. Open [YouTube Studio](https://studio.youtube.com/)
2. Navigate to the **Videos** section
3. You should see an "🚀 Optimize Videos" button injected by the extension

### 5.2 Select and Optimize Videos

1. Click the "🚀 Optimize Videos" button
2. The extension popup will appear
3. Selected videos will be listed
4. Click **Optimize All Videos**
5. Monitor the progress in the popup

## Troubleshooting

### Issue: Extension doesn't appear after loading

**Solution**: 
- Refresh Chrome
- Check that you're in Developer mode
- Verify the manifest.json is valid JSON

### Issue: "Login failed" or "Not authenticated"

**Solution**:
- Verify your Client ID is correct in manifest.json
- Check that YouTube Data API v3 is enabled in Google Cloud Console
- Clear Chrome cache and try again
- Ensure OAuth consent screen is properly configured

### Issue: "Could not find Gemini input field"

**Solution**:
- Gemini UI structure may have changed
- Try refreshing the Gemini page
- Check browser console for specific selector errors
- Update selectors in `src/content-gemini.js` if needed

### Issue: Videos not showing in popup

**Solution**:
- Ensure you're on YouTube Studio (studio.youtube.com)
- Refresh the page
- Check that you have videos in your channel
- Click the "Refresh" button in the extension popup

### Issue: "Failed to update video" or API errors

**Solution**:
- Check your YouTube API quota at [Google Cloud Console](https://console.cloud.google.com/apis/dashboard)
- YouTube provides 10,000 units/day; each video uses ~101 units
- Wait for quota to reset (daily at midnight PT)
- Verify your OAuth token hasn't expired (re-login if needed)

### Issue: Thumbnail not uploading

**Solution**:
- Ensure image is in JPEG/PNG format
- Verify image dimensions are 1280x720
- Check YouTube API quota
- Try uploading manually to verify permissions

## Advanced Configuration

### Custom Prompts

Edit `src/config.js` to customize AI prompts:

```javascript
PROMPTS: {
    SEO: `Your custom SEO prompt here...`,
    THUMBNAIL: `Your custom thumbnail prompt here...`
}
```

### Adjust Timeouts

For slow connections, increase timeouts in `src/config.js`:

```javascript
GEMINI: {
    RESPONSE_TIMEOUT: 180000,  // 3 minutes instead of 2
    IMAGE_GENERATION_TIMEOUT: 180000
}
```

### Disable Auto-Close Tabs

In the extension popup, uncheck "Auto-close Gemini tabs after completion" to keep tabs open for debugging.

## Security Notes

1. **OAuth Tokens**: Stored securely in Chrome's local storage
2. **API Keys**: Never exposed in client-side code
3. **CORS**: Extension permissions bypass CORS restrictions safely
4. **Data Privacy**: No data is sent to external servers except YouTube API and Gemini

## Support & Debugging

### Enable Debug Mode

1. Right-click extension icon → **Inspect popup**
2. Open DevTools console to see logs
3. Check **Service Worker** logs in chrome://extensions/

### Common Debug Commands

```javascript
// Check stored auth token
chrome.storage.local.get('youtube_auth_token', console.log);

// Check optimization queue
chrome.storage.local.get('optimization_queue', console.log);

// Clear all storage
chrome.storage.local.clear();
```

## Next Steps

1. Review the [README.md](README.md) for usage instructions
2. Check [Design Plan](../youtube_seo_extension_plan_final.md) for architecture details
3. Explore advanced features in the settings

## Getting Help

- Check the troubleshooting section above
- Review browser console logs for error messages
- Check Google Cloud Console for API quota and errors
- Verify YouTube API scopes are correct

---

**Version**: 1.0.0  
**Last Updated**: November 28, 2024
