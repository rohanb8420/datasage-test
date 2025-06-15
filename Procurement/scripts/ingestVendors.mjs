#!/usr/bin/env node
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import XLSX from 'xlsx';
import slugify from 'slugify';
import chalk from 'chalk';
import cliProgress from 'cli-progress';

// Database connection
const dbUrl = process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/mydb';
const sequelize = new Sequelize(dbUrl, { dialect: 'postgres', logging: false });

// Define models inline
const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.TEXT, allowNull: false },
  slug: { type: DataTypes.TEXT, allowNull: false, unique: true },
  parentId: { type: DataTypes.INTEGER, allowNull: true },
}, { tableName: 'categories', timestamps: true });

const Vendor = sequelize.define('Vendor', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  vendorNumber: { type: DataTypes.TEXT, allowNull: false, unique: true },
  name: { type: DataTypes.TEXT, allowNull: false },
  city: { type: DataTypes.TEXT, allowNull: false },
  country: { type: DataTypes.STRING(2), allowNull: false },
  phone: { type: DataTypes.TEXT, allowNull: true },
  email1: { type: DataTypes.TEXT, allowNull: true },
  email2: { type: DataTypes.TEXT, allowNull: true },
  email3: { type: DataTypes.TEXT, allowNull: true },
  email4: { type: DataTypes.TEXT, allowNull: true },
  addressLine1: { type: DataTypes.TEXT, allowNull: true },
  addressLine2: { type: DataTypes.TEXT, allowNull: true },
  addressLine3: { type: DataTypes.TEXT, allowNull: true },
  addressLine4: { type: DataTypes.TEXT, allowNull: true },
  postalCode: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('ACTIVE', 'SUSPENDED'), allowNull: false, defaultValue: 'ACTIVE' },
}, { tableName: 'vendors', timestamps: true });

const VendorProduct = sequelize.define('VendorProduct', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  vendorId: { type: DataTypes.INTEGER, allowNull: false },
  categoryId: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  sku: { type: DataTypes.TEXT, allowNull: true },
  uom: { type: DataTypes.TEXT, allowNull: true },
  active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: 'vendor_products', timestamps: true });

// Associations
Category.hasMany(Category, { as: 'children', foreignKey: 'parentId' });
Category.hasMany(VendorProduct, { foreignKey: 'categoryId' });
Vendor.hasMany(VendorProduct, { foreignKey: 'vendorId' });
VendorProduct.belongsTo(Vendor, { foreignKey: 'vendorId' });
VendorProduct.belongsTo(Category, { foreignKey: 'categoryId' });

// Main ingestion logic
async function main() {
  const filePath = path.resolve(process.cwd(), 'data/vendor_database_with_categories.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  console.log(chalk.blue('Truncating tables...'));
  await sequelize.transaction(async (t) => {
    await sequelize.query('TRUNCATE TABLE vendor_products CASCADE', { transaction: t });
    await sequelize.query('TRUNCATE TABLE categories CASCADE', { transaction: t });
    await sequelize.query('TRUNCATE TABLE vendors CASCADE', { transaction: t });
  });

  console.log(chalk.blue('Importing vendors...'));
  const bar = new cliProgress.SingleBar({ format: 'Progress |' + '{bar}' + '| {value}/{total}' });
  bar.start(rows.length, 0);

  for (const row of rows) {
    // Upsert vendor
    const [vendor] = await Vendor.upsert({
      vendorNumber: row['Vendor Number'],
      name: row['Name'],
      city: row['City'],
      country: row['Country'],
      phone: row['Phone'],
      email1: row['Email1'], email2: row['Email2'], email3: row['Email3'], email4: row['Email4'],
      addressLine1: row['AddressLine1'], addressLine2: row['AddressLine2'],
      addressLine3: row['AddressLine3'], addressLine4: row['AddressLine4'],
      postalCode: row['PostalCode'], status: row['Status'] || 'ACTIVE',
    }, { returning: true });
    const vendorId = vendor.id;

    // Process category paths
    const rawPaths = row['Product Categories'] || '';
    const categoryPaths = rawPaths.split(';').map(s => s.split(/›|»|>/).map(x => x.trim()));
    for (const pathArr of categoryPaths) {
      let parentId = null;
      for (const name of pathArr) {
        if (!name) continue;
        const slug = slugify(name, { lower: true });
        const [category] = await Category.findOrCreate({ where: { slug }, defaults: { name, parentId } });
        if (category.parentId !== parentId) { category.parentId = parentId; await category.save(); }
        parentId = category.id;
      }

      // Process products
      const rawProd = row['Product Catalogue (Sample)'] || '';
      const descriptions = rawProd.split(/\||;/).map(x => x.trim()).filter(x => x);
      for (const desc of descriptions) {
        await VendorProduct.findOrCreate({ where: { vendorId, categoryId: parentId, description: desc } });
      }
    }

    bar.increment();
  }
  bar.stop();
  console.log(chalk.green('Ingestion complete.'));
  await sequelize.close();
}

main().catch(err => { console.error(chalk.red(err)); process.exit(1); });