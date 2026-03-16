import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import Order from "./order.js";

export class Chat extends Model {
    declare id: number;
    declare seller_username: string | null;
    declare seller_chat: string | null;
    declare buyer_username: string | null;
    declare buyer_chat: string | null;
    declare order_id: number | null;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        Chat.belongsTo(Order, {
            foreignKey: "order_id",
        });
    }

    static associations: {
        Order: Association<Chat, Order>;
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
        order_id: DataTypes.INTEGER,
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