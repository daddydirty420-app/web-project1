import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class CancelFeeReturnOption extends Model {
    declare id: number;
    declare name: string;
    declare createdAt: Date;
    declare updatedAt: Date;

}

CancelFeeReturnOption.init(
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
        modelName: "CancelFeeReturnOption",
        tableName: "cancel_fee_return_option",
        freezeTableName: true,
        timestamps: true,
    },
);

export default CancelFeeReturnOption;
