const fs = require('fs');
const path = require('path');

const landingHtml = fs.readFileSync(path.join(__dirname, '../public/landing.html'), 'utf8');
const escapedHtml = landingHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$');

const output = `export const LANDING_HTML = \`${escapedHtml}\`;
`;

fs.writeFileSync(path.join(__dirname, '../src/landing-content.ts'), output);
console.log('✅ landing-content.ts generated');
