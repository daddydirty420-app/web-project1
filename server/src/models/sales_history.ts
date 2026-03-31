import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import User from "./user.js";
import Item from "./item.js";

export class SalesHistory extends Model {
    declare id: number;
    declare item_count: number | null;
    declare price: number;
    declare item_id: number;
    declare seller_user_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        SalesHistory.belongsTo(Item, {
            foreignKey: "item_id",
        });
        SalesHistory.belongsTo(User, {
            foreignKey: "seller_user_id",
        });
    }

    static associations: {
        Item: Association<SalesHistory, Item>;
        User: Association<SalesHistory, User>;
    };
}

SalesHistory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        item_count: DataTypes.INTEGER,
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        seller_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "SalesHistory",
        tableName: "sales_history",
        freezeTableName: true,
        timestamps: true,
    }
);

export default SalesHistory;