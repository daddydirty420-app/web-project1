import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";
import Brands from "./brands.js";

export class BrandAliases extends Model {
    declare id: number;
    declare brand_id: Number | null;
    declare name: string | null;
    declare name_normalized: string | null;
    declare createdAt: Date;
    declare updatedAt: Date;


    static associate() {
        BrandAliases.belongsTo(Brands, {
            foreignKey: "brand_id",
            as: "brand",
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
        brand_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "brands",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        name_normalized: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: "BrandAliases",
        tableName: "brand_aliases",
        freezeTableName: true,
        timestamps: true,
    },
);

export default BrandAliases;
