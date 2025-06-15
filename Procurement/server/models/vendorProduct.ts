import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

// Attributes interface
interface VendorProductAttributes {
  id: number;
  vendorId: number;
  categoryId: number;
  description: string;
  sku?: string;
  uom?: string;
  active: boolean;
}

// Creation attributes
interface VendorProductCreationAttributes extends Optional<VendorProductAttributes, 'id' | 'sku' | 'uom'> {}

// VendorProduct model
export class VendorProduct extends Model<VendorProductAttributes, VendorProductCreationAttributes>
  implements VendorProductAttributes {
  public id!: number;
  public vendorId!: number;
  public categoryId!: number;
  public description!: string;
  public sku?: string;
  public uom?: string;
  public active!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // initialize model
  public static initialize(sequelize: Sequelize) {
    VendorProduct.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        vendorId: { type: DataTypes.INTEGER, allowNull: false },
        categoryId: { type: DataTypes.INTEGER, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        sku: { type: DataTypes.TEXT, allowNull: true },
        uom: { type: DataTypes.TEXT, allowNull: true },
        active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      },
      {
        sequelize,
        tableName: 'vendor_products',
        modelName: 'VendorProduct',
      }
    );
  }

  // associations
  public static associate(models: any) {
    VendorProduct.belongsTo(models.Vendor, { foreignKey: 'vendorId' });
    VendorProduct.belongsTo(models.Category, { foreignKey: 'categoryId' });
  }
}