import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";

export class ItemBuyerReportOption extends Model {
    declare id: number;
    declare name: string;
};

ItemBuyerReportOption.init(
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
        modelName: "ItemBuyerReportOption",
        tableName: "item_buyer_report_option",
        freezeTableName: true,
        timestamps: false,
    }
);

export default ItemBuyerReportOption;