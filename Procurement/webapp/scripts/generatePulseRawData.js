const fs = require('fs');
const path = require('path');

// Paths for raw and aggregate data
const dataDir = path.resolve(__dirname, '../public/data');
const rawDir = path.join(dataDir, 'pulse', 'raw-data');
const aggDir = path.join(dataDir, 'pulse', 'aggregate');
// Ensure pulse directories exist
fs.mkdirSync(rawDir, { recursive: true });
fs.mkdirSync(aggDir, { recursive: true });

// Copy all raw_*.csv into pulse/raw-data
const files = fs.readdirSync(dataDir).filter(f => f.startsWith('raw_') && f.endsWith('.csv'));
files.forEach(file => {
  const src = path.join(dataDir, file);
  const dest = path.join(rawDir, file);
  try {
    fs.copyFileSync(src, dest);
  } catch (err) {
    console.warn(`Failed to copy ${file}:`, err);
  }
});
console.log(`Pulse raw data: copied ${files.length} files to ${rawDir}`);