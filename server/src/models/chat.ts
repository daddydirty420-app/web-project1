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
        seller_username: DataTypes.STRING(255),
        seller_chat: DataTypes.TEXT,
        buyer_username: DataTypes.STRING(255),
        buyer_chat: DataTypes.TEXT,
        orders_id: DataTypes.INTEGER,
    },
    {
        sequelize,
        modelName: "Chat",
        tableName: "chat",
        freezeTableName: true,
        timestamps: true,
    }
);

export default Chat;