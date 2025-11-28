import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class ShippingDayOption extends Model {
    declare id: number;
    declare name: string;
};

ShippingDayOption.init(
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
        modelName: "ShippingDayOption",
        tableName: "shipping_day_option",
        freezeTableName: true,
        timestamps: false,
    }
);

export default ShippingDayOption;