import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class CancelFeeReturnOption extends Model {
    declare id: number;
    declare name: string;
};

CancelFeeReturnOption.init(
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
        modelName: "CancelFeeReturnOption",
        tableName: "cancel_fee_return_option",
        freezeTableName: true,
        timestamps: false,
    }
);

export default CancelFeeReturnOption;