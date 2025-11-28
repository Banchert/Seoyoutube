// Script สำหรับ package extension สำหรับ Chrome Web Store
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// ไฟล์ที่ต้องรวมใน extension package
const includeFiles = [
    'manifest.json',
    'popup.html',
    'styles.css',
    'src/',
    'assets/',
    'README.md'
];

// ไฟล์ที่ไม่ต้องรวม
const excludeFiles = [
    '*.md',
    'package-extension.js',
    'DEPLOY_GUIDE.md',
    'TEST_*.md',
    'DEBUG_*.md',
    'FINAL_*.md',
    'CREATE_*.md',
    'URGENT_*.md',
    'WORKING_*.md',
    'MANUAL_*.md',
    'SIMPLE_*.md',
    'STEP_*.md',
    'ENABLE_*.md',
    'GENERATE_*.md',
    '*.pem',
    '*.txt',
    'diagnose-*.html',
    'check-*.html',
    'test-*.html',
    'test-*.js',
    'quick-*.js'
];

function createExtensionPackage() {
    const output = fs.createWriteStream('youtube-ai-optimizer.zip');
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    output.on('close', () => {
        console.log('✅ Extension package created: youtube-ai-optimizer.zip');
        console.log(`📦 Total size: ${archive.pointer()} bytes`);
        console.log('\n🚀 Ready for Chrome Web Store upload!');
    });

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(output);

    // เพิ่มไฟล์ที่จำเป็น
    includeFiles.forEach(file => {
        if (fs.existsSync(file)) {
            if (fs.statSync(file).isDirectory()) {
                archive.directory(file, file);
            } else {
                archive.file(file, { name: file });
            }
        }
    });

    archive.finalize();
}

console.log('📦 Creating Chrome Extension package...');
createExtensionPackage();