import { Sequelize } from 'sequelize';
import { Category } from './category';
import { Vendor } from './vendor';
import { VendorProduct } from './vendorProduct';

// Initialize Sequelize instance (adjust connection URI / options as needed)
const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  logging: false,
});

// Initialize all models
Category.initialize(sequelize);
Vendor.initialize(sequelize);
VendorProduct.initialize(sequelize);

// Set up model associations
Category.associate({ Category, VendorProduct });
Vendor.associate({ VendorProduct });
VendorProduct.associate({ Vendor, Category });

export { sequelize, Category, Vendor, VendorProduct };