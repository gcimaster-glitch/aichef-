const fs = require('fs');
const path = require('path');

// public/landing.htmlを読み込み
const landingPath = path.join(__dirname, '../public/landing.html');
const landingContent = fs.readFileSync(landingPath, 'utf-8');

// index.tsxを読み込み
const indexPath = path.join(__dirname, '../src/index.tsx');
let indexContent = fs.readFileSync(indexPath, 'utf-8');

// landingHtml変数の内容を置換 (開始から次のconst/\n\nまで)
const pattern = /(const landingHtml = `)[\s\S]*?(`\s*\n\nconst appHtml)/;
const escLanding = landingContent.replace(/`/g, '\\`').replace(/\$/g, '\\$');
indexContent = indexContent.replace(pattern, `$1${escLanding}$2`);

// 書き込み
fs.writeFileSync(indexPath, indexContent);
console.log('✅ landingHtml updated successfully!');
