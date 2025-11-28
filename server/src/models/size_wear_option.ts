import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class SizeWearOption extends Model {
    declare id: number;
    declare name: string;
};

SizeWearOption.init(
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
        modelName: "SizeWearOption",
        tableName: "size_wear_option",
        freezeTableName: true,
        timestamps: false,
    }
);

export default SizeWearOption;