// Simple extension packager without dependencies
const fs = require('fs');
const path = require('path');

// Files to include in extension package
const includeFiles = [
    'manifest.json',
    'popup.html', 
    'styles.css',
    'README.md'
];

const includeDirs = [
    'src',
    'assets'
];

// Files to exclude
const excludePatterns = [
    /\.md$/,
    /package.*\.js$/,
    /DEPLOY/,
    /TEST_/,
    /DEBUG_/,
    /FINAL_/,
    /CREATE_/,
    /URGENT_/,
    /WORKING_/,
    /MANUAL_/,
    /SIMPLE_/,
    /STEP_/,
    /ENABLE_/,
    /GENERATE_/,
    /\.pem$/,
    /\.txt$/,
    /diagnose-.*\.html$/,
    /check-.*\.html$/,
    /test-.*\.html$/,
    /test-.*\.js$/,
    /quick-.*\.js$/,
    /web-app/,
    /store-assets/
];

function shouldExclude(filename) {
    return excludePatterns.some(pattern => pattern.test(filename));
}

function copyFiles() {
    const outputDir = 'extension-package';
    
    // Create output directory
    if (fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, { recursive: true });
    }
    fs.mkdirSync(outputDir);
    
    console.log('📦 Creating extension package...');
    
    // Copy individual files
    includeFiles.forEach(file => {
        if (fs.existsSync(file) && !shouldExclude(file)) {
            fs.copyFileSync(file, path.join(outputDir, file));
            console.log(`✅ Copied: ${file}`);
        }
    });
    
    // Copy directories
    includeDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
            copyDirectory(dir, path.join(outputDir, dir));
            console.log(`✅ Copied directory: ${dir}`);
        }
    });
    
    console.log('\n🎉 Extension package created in: extension-package/');
    console.log('📋 Next steps:');
    console.log('1. Zip the extension-package folder');
    console.log('2. Upload to Chrome Web Store');
    console.log('3. Fill in store listing details');
}

function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    
    files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        
        if (shouldExclude(file)) {
            return;
        }
        
        const stat = fs.statSync(srcPath);
        
        if (stat.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

copyFiles();