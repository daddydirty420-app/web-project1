import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class Brands extends Model {
    declare id: number;
    declare name: string;
    declare name_normalized: string;
    declare createdAt: Date;
    declare updatedAt: Date;

}

Brands.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        name_normalized: {
            type: DataTypes.STRING(255),
            allowNull: false,
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
        modelName: "Brands",
        tableName: "brands",
        freezeTableName: true,
        timestamps: true,
    },
);

export default Brands;
