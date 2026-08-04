import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import Orders from "./orders.js";

export class Chat extends Model {
    declare id: number;
    declare seller_username: string | null;
    declare seller_chat: string | null;
    declare buyer_username: string | null;
    declare buyer_chat: string | null;
    declare orders_id: number | null;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        Chat.belongsTo(Orders, {
            foreignKey: "orders_id",
        });
    }

    static associations: {
        Orders: Association<Chat, Orders>;
    };
}

Chat.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        seller_username: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        seller_chat: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        buyer_username: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        buyer_chat: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        orders_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "orders",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
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
        modelName: "Chat",
        tableName: "chat",
        freezeTableName: true,
        timestamps: true,
    },
);

export default Chat;
