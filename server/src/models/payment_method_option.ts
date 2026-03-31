import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class PaymentMethodOption extends Model {
    declare id: number;
    declare name: string;
};

PaymentMethodOption.init(
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
        modelName: "PaymentMethodOption",
        tableName: "payment_method_option",
        freezeTableName: true,
        timestamps: false,
    }
);

export default PaymentMethodOption;