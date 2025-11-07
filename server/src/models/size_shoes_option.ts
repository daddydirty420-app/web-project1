import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class SizeShoesOption extends Model {
    declare id: number;
    declare name: string;
};

SizeShoesOption.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "SizeShoesOption",
        tableName: "size_shoes_option",
        freezeTableName: true,
        timestamps: false,
    }
);

export default SizeShoesOption;