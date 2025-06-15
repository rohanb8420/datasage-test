#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import XLSX from 'xlsx';

const inputPath = path.resolve(process.cwd(), 'public/data/vendor_database_with_categories.xlsx');
const outputPath = path.resolve(process.cwd(), 'public/data/vendors.json');

console.log(`Reading vendor data from ${inputPath}`);
const workbook = XLSX.readFile(inputPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

// Build unique vendors map (dedupe by vendorNumber)
const vendorMap = new Map();
rows.forEach(row => {
  const vendorNumber = row['Vendor Number']?.toString() || '';
  const name = row['Name']?.toString() || '';
  const city = row['City']?.toString() || '';
  const country = row['Country']?.toString() || '';
  const status = row['Status']?.toString() || 'ACTIVE';
  const emails = [1,2,3,4].map(i => row[`Email${i}`]?.toString()).filter(Boolean);
  const address = [1,2,3,4].map(i => row[`AddressLine${i}`]?.toString()).filter(Boolean);
  const postalCode = row['PostalCode']?.toString() || '';
  const rawCats = row['Product Categories']?.toString() || '';
  const categories = rawCats.split(/[;|]/)
    .flatMap(part => part.split(/›|»|>/))
    .map(s => s.trim())
    .filter(Boolean);
  const rawProds = row['Product Catalogue (Sample)']?.toString() || '';
  const products = rawProds.split(/[;|]/).map(s => s.trim()).filter(Boolean);
  if (!vendorMap.has(vendorNumber)) {
    vendorMap.set(vendorNumber, { vendorNumber, name, city, country, status, emails, address, postalCode, categories, products });
  } else {
    const existing = vendorMap.get(vendorNumber);
    existing.categories = Array.from(new Set(existing.categories.concat(categories)));
    existing.products = Array.from(new Set(existing.products.concat(products)));
  }
});
const vendors = Array.from(vendorMap.values());

console.log(`Writing ${vendors.length} vendors to ${outputPath}`);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(vendors, null, 2));
console.log('Export complete.');