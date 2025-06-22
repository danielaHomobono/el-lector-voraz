// build.js - Script to minify CSS files for production
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'public', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

console.log('🔄 Minifying CSS files...');

// Minify main CSS files
try {
  // Minify variables.css
  execSync(`npx cleancss -o ${path.join(distDir, 'variables.min.css')} ${path.join(__dirname, 'public', 'css', 'variables.css')}`);
  
  // Minify styles.css
  execSync(`npx cleancss -o ${path.join(distDir, 'styles.min.css')} ${path.join(__dirname, 'public', 'styles.css')}`);
  
  // Minify common.css
  execSync(`npx cleancss -o ${path.join(distDir, 'common.min.css')} ${path.join(__dirname, 'public', 'css', 'common.css')}`);
  
  // Minify theme-switcher.css
  execSync(`npx cleancss -o ${path.join(distDir, 'theme-switcher.min.css')} ${path.join(__dirname, 'public', 'css', 'theme-switcher.css')}`);
  
  // Minify all other CSS files in the css directory
  const cssDir = path.join(__dirname, 'public', 'css');
  fs.readdirSync(cssDir).forEach(file => {
    if (file.endsWith('.css') && 
        file !== 'variables.css' && 
        file !== 'common.css' && 
        file !== 'theme-switcher.css') {
      execSync(`npx cleancss -o ${path.join(distDir, file.replace('.css', '.min.css'))} ${path.join(cssDir, file)}`);
    }
  });
  
  console.log('✅ CSS minification completed successfully!');
} catch (error) {
  console.error('❌ Error during CSS minification:', error.message);
  process.exit(1);
}