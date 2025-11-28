import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class SizeOption extends Model {
    declare id: number;
    declare name: string;
};

SizeOption.init(
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
        modelName: "SizeOption",
        tableName: "size_option",
        freezeTableName: true,
        timestamps: false,
    }
);

export default SizeOption;