import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

// Attributes interface
interface CategoryAttributes {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
}

// Creation attributes
interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'parentId'> {}

// Model definition
export class Category extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public slug!: string;
  public parentId?: number | null;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // initialize model
  public static initialize(sequelize: Sequelize) {
    Category.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.TEXT, allowNull: false },
        slug: { type: DataTypes.TEXT, allowNull: false, unique: true },
        parentId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
      },
      {
        sequelize,
        tableName: 'categories',
        modelName: 'Category',
      }
    );
  }

  // define associations
  public static associate(models: any) {
    Category.hasMany(models.Category, { as: 'children', foreignKey: 'parentId' });
    Category.hasMany(models.VendorProduct, { foreignKey: 'categoryId' });
  }
}