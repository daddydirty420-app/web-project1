import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import Item from "./item.js";
import User from "./user.js";
import ItemBuyerReportOption from "./item_buyer_report_option.js";
import Order from "./order.js";

export class ItemBuyerReport extends Model {
    declare id: number;
    declare item_id: number;
    declare report_user_id: number;
    declare option_id: number;
    declare detail_text: string | null;
    declare order_id: number;
    declare checked: boolean;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        ItemBuyerReport.belongsTo(Item, {
            foreignKey: "item_id",
        });
        ItemBuyerReport.belongsTo(User, {
            foreignKey: "report_user_id",
        });
        ItemBuyerReport.belongsTo(ItemBuyerReportOption, {
            foreignKey: "option_id",
        });
        ItemBuyerReport.belongsTo(Order, {
            foreignKey: "order_id",
        });
    }

    static associations: {
        Item: Association<ItemBuyerReport, Item>;
        User: Association<ItemBuyerReport, User>;
        ItemBuyerReportOption: Association<ItemBuyerReport, ItemBuyerReportOption>;
        Order: Association<ItemBuyerReport, Order>;
    };
}

ItemBuyerReport.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        report_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        option_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        detail_text: DataTypes.TEXT,
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        checked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "ItemBuyerReport",
        tableName: "item_buyer_report",
        freezeTableName: true,
        timestamps: true,
    }
);

export default ItemBuyerReport;