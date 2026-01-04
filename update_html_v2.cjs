const fs = require('fs');

// TypeScriptファイルを読み込む
let tsContent = fs.readFileSync('src/index.tsx', 'utf8');

// improved_html.txt を読み込んで Base64 エンコード
const htmlContent = fs.readFileSync('improved_html.txt', 'utf8');
const base64Html = Buffer.from(htmlContent, 'utf8').toString('base64');

// TypeScriptファイル内のindexHtml定義を探して置き換え
const htmlDecodeCode = `
// ========================================
// index.html の内容をインライン化
// ========================================
const indexHtml = Buffer.from('${base64Html}', 'base64').toString('utf8');
`;

// 既存のindexHtml定義を置換
tsContent = tsContent.replace(
  /\/\/ ========================================\n\/\/ index\.html の内容をインライン化\n\/\/ ========================================\nconst indexHtml = `[\s\S]*?`;/,
  htmlDecodeCode.trim()
);

// ファイルに書き込む
fs.writeFileSync('src/index.tsx', tsContent, 'utf8');
console.log('✅ HTML updated successfully with Base64 encoding!');
