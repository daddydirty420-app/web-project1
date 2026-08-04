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
        item_count: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "item",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        seller_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
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
        modelName: "SalesHistory",
        tableName: "sales_history",
        freezeTableName: true,
        timestamps: true,
    },
);

export default SalesHistory;
