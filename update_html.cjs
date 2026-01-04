const fs = require('fs');

// HTMLファイルを読み込む
const htmlContent = fs.readFileSync('improved_html.txt', 'utf8');

// TypeScriptファイルを読み込む
const tsContent = fs.readFileSync('src/index.tsx', 'utf8');

// HTMLを埋め込み
const escapedHtml = htmlContent
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$/g, '\\$');

const newTsContent = tsContent.replace(
  /const indexHtml = `[\s\S]*?`;/,
  `const indexHtml = \`${escapedHtml}\`;`
);

// ファイルに書き込む
fs.writeFileSync('src/index.tsx', newTsContent, 'utf8');
console.log('✅ HTML updated successfully!');
