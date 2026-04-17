import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../db.js';
import Brands from './brands.js';

export class BrandAliases extends Model {
    declare id: number;
    declare brand_id: Number | null;
    declare name: string | null;
    declare name_normalized: string | null;

    static associate() {
        BrandAliases.belongsTo(Brands, {
            foreignKey: 'brand_id',
            as: 'brand',
        });
    }

    static associations: {
        brand: Association<BrandAliases, Brands>;
    };
}

BrandAliases.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        brand_id: DataTypes.INTEGER,
        name: DataTypes.STRING(255),
        name_normalized: DataTypes.STRING(255),
    },
    {
        sequelize,
        modelName: 'BrandAliases',
        tableName: 'brand_aliases',
        freezeTableName: true,
        timestamps: false,
    },
);

export default BrandAliases;
