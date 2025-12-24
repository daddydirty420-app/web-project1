import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class Brands extends Model {
    declare id: number;
    declare name: string;
};

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
    },
    {
        sequelize,
        modelName: "Brands",
        tableName: "brands",
        freezeTableName: true,
        timestamps: false,
    },
);

export default Brands;