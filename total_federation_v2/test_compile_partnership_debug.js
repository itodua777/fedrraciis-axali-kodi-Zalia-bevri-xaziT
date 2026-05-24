const fs = require('fs');
const path = require('path');
const Babel = require('./scratch/babel.min.js');

const componentPath = path.join(__dirname, 'src', 'components', 'management', 'PartnershipManagement.tsx');
const code = fs.readFileSync(componentPath, 'utf8');

// The replacement in index.html:
const replacedCode = code
  .replace(/export\s+default\s+/g, 'window.PartnershipsDashboard = ')
  .replace(/import\s+.*\s+from\s+['"].*['"];?/g, '');

const compiled = Babel.transform(replacedCode, {
  presets: ['react', 'typescript'],
  filename: 'PartnershipManagement.tsx',
}).code;

// Write compiled code to inspect
fs.writeFileSync(path.join(__dirname, 'scratch', 'compiled_partnership_debug.js'), compiled);

// Search for 'export' in compiled code
const lines = compiled.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('export')) {
    console.log(`Line ${idx + 1} contains export: ${line}`);
  }
});
