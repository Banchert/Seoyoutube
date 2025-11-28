@echo off
echo 🚀 Deploying YouTube AI Optimizer to GitHub Pages...
echo.

echo 📂 Cloning repository...
git clone https://github.com/Banchert/Seoyoutube.git temp-repo
cd temp-repo

echo 📁 Copying web-app files...
copy ..\web-app\index.html .
copy ..\web-app\package.json .
copy ..\web-app\vercel.json .
copy ..\web-app\netlify.toml .
copy ..\web-app\README.md .

echo 📝 Creating GitHub Pages specific files...
echo # YouTube AI Optimizer > README.md
echo. >> README.md
echo Web App: https://banchert.github.io/Seoyoutube/ >> README.md
echo Chrome Extension: Coming soon to Chrome Web Store >> README.md

echo 📤 Pushing to GitHub...
git add .
git commit -m "Deploy YouTube AI Optimizer Web App"
git push origin main

echo.
echo ✅ Deployment complete!
echo 🌐 Web App will be available at: https://banchert.github.io/Seoyoutube/
echo 📋 Next steps:
echo 1. Enable GitHub Pages in repository settings
echo 2. Setup OAuth Client with redirect URI
echo 3. Update CLIENT_ID in index.html
echo.

cd ..
rmdir /s /q temp-repo

pause