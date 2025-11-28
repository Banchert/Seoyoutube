@echo off
echo 🚀 Deploying YouTube AI Optimizer Web App...
echo.

echo 📦 Installing Vercel CLI...
npm install -g vercel

echo.
echo 🌐 Deploying to Vercel...
cd /d "%~dp0"
vercel --prod

echo.
echo ✅ Deployment complete!
echo 📋 Next steps:
echo 1. Copy the deployment URL
echo 2. Setup OAuth with the new domain
echo 3. Update CLIENT_ID in index.html
echo.
pause