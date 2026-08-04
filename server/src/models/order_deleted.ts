import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import Orders from "./orders.js";
import User from "./user.js";
import Delivery from "./delivery.js";

export class OrderDeleted extends Model {
    declare id: number;
    declare orders_id: number;
    declare delivery_id: number;
    declare cancel_reason: string;
    declare refund_status: string;
    declare refund_method: string | null;
    declare refund_amount: number;
    declare deleted_by: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        OrderDeleted.belongsTo(Orders, {
            foreignKey: "orders_id",
        });
        OrderDeleted.belongsTo(User, {
            foreignKey: "deleted_by",
        });
        OrderDeleted.belongsTo(Delivery, {
            foreignKey: "delevery_id",
        });
    }

    static associations: {
        User: Association<OrderDeleted, User>;
        Delivery: Association<OrderDeleted, Delivery>;
        Orders: Association<OrderDeleted, Orders>;
    };
}

OrderDeleted.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        orders_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: "orders",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        delivery_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        cancel_reason: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        refund_status: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        refund_method: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        refund_amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        deleted_by: {
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
        modelName: "OrderDeleted",
        tableName: "order_deleted",
        freezeTableName: true,
        timestamps: true,
    },
);

export default OrderDeleted;
