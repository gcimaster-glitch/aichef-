const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const outputFile = path.join(__dirname, '../src/static-html.ts');

const files = {
  about: fs.readFileSync(path.join(publicDir, 'about.html'), 'utf8'),
  pricing: fs.readFileSync(path.join(publicDir, 'pricing.html'), 'utf8'),
  legal: fs.readFileSync(path.join(publicDir, 'legal.html'), 'utf8')
};

const content = `// Auto-generated file - do not edit
export const ABOUT_HTML = ${JSON.stringify(files.about)};
export const PRICING_HTML = ${JSON.stringify(files.pricing)};
export const LEGAL_HTML = ${JSON.stringify(files.legal)};
`;

fs.writeFileSync(outputFile, content);
console.log('✅ static-html.ts generated');
