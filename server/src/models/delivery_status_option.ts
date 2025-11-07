import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class DeliveryStatusOption extends Model {
    declare id: number;
    declare name: string;
};

DeliveryStatusOption.init(
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
        modelName: "DeliveryStatusOption",
        tableName: "delivery_status_option",
        freezeTableName: true,
        timestamps: false,
    }
);

export default DeliveryStatusOption;