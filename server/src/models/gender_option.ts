import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class GenderOption extends Model {
    declare id: number;
    declare name: string;
    declare createdAt: Date;
    declare updatedAt: Date;

}

GenderOption.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(20),
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
        modelName: "GenderOption",
        tableName: "gender_option",
        freezeTableName: true,
        timestamps: true,
    },
);

export default GenderOption;
