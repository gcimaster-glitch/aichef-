const fs = require('fs');

const htmlContent = fs.readFileSync('improved_html.txt', 'utf8');
const tsContent = fs.readFileSync('src/index.tsx', 'utf8');

// エスケープ処理
function escapeForTemplate(str) {
  return str
    .replace(/\\/g, '\\\\')    // バックスラッシュ
    .replace(/`/g, '\\`')      // バックティック
    .replace(/\${/g, '\\${');  // テンプレート文字列
}

const escaped = escapeForTemplate(htmlContent);

// 既存のindexHtml定義を見つけて置換
const startMarker = '// ========================================\n// index.html の内容をインライン化';
const endMarker = 'const app = new Hono';

const startIdx = tsContent.indexOf(startMarker);
const endIdx = tsContent.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('❌ Markers not found!');
  process.exit(1);
}

const before = tsContent.substring(0, startIdx);
const after = tsContent.substring(endIdx);

const newContent = before + 
  startMarker + '\n' +
  '// ========================================\n' +
  'const indexHtml = `' + escaped + '`;\n\n' +
  after;

fs.writeFileSync('src/index.tsx', newContent, 'utf8');
console.log('✅ HTML embedded successfully!');
