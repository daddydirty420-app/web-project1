import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class AccountTypeOption extends Model {
    declare id: number;
    declare name: string;
};

AccountTypeOption.init(
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
        modelName: "AccountTypeOption",
        tableName: "account_type_option",
        freezeTableName: true,
        timestamps: false,
    }
);

export default AccountTypeOption;