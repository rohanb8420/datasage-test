import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

// Attributes interface
interface VendorAttributes {
  id: number;
  vendorNumber: string;
  name: string;
  city: string;
  country: string;
  phone?: string;
  email1?: string;
  email2?: string;
  email3?: string;
  email4?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  postalCode?: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

// Creation attributes
interface VendorCreationAttributes extends Optional<VendorAttributes, 'id' | 
  'phone' | 'email1' | 'email2' | 'email3' | 'email4' | 
  'addressLine1' | 'addressLine2' | 'addressLine3' | 'addressLine4' | 
  'postalCode'> {}

// Vendor model
export class Vendor extends Model<VendorAttributes, VendorCreationAttributes>
  implements VendorAttributes {
  public id!: number;
  public vendorNumber!: string;
  public name!: string;
  public city!: string;
  public country!: string;
  public phone?: string;
  public email1?: string;
  public email2?: string;
  public email3?: string;
  public email4?: string;
  public addressLine1?: string;
  public addressLine2?: string;
  public addressLine3?: string;
  public addressLine4?: string;
  public postalCode?: string;
  public status!: 'ACTIVE' | 'SUSPENDED';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // initialize model
  public static initialize(sequelize: Sequelize) {
    Vendor.init(
      {
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
      },
      {
        sequelize,
        tableName: 'vendors',
        modelName: 'Vendor',
      }
    );
  }

  // associations
  public static associate(models: any) {
    Vendor.hasMany(models.VendorProduct, { foreignKey: 'vendorId' });
  }
}