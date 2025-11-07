import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class ShippingServiceOption extends Model {
    declare id: number;
    declare name: string;
};

ShippingServiceOption.init(
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
        modelName: "ShippingServiceOption",
        tableName: "shipping_service_option",
        freezeTableName: true,
        timestamps: false,
    }
);

export default ShippingServiceOption;