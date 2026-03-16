import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import Orders from "./orders.js";
import User from "./user.js";
import Delivery from "./delivery.js";

export class DeletedOrderSystems extends Model {
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
        DeletedOrderSystems.belongsTo(Orders, {
            foreignKey: "orders_id",
        });
        DeletedOrderSystems.belongsTo(User, {
            foreignKey: "deleted_by",
        });
        DeletedOrderSystems.belongsTo(Delivery, {
            foreignKey: "delevery_id",
        });
    }

    static associations: {
        User: Association<DeletedOrderSystems, User>;
        Delivery: Association<DeletedOrderSystems, Delivery>;
        Orders: Association<DeletedOrderSystems, Orders>;
    };
}

DeletedOrderSystems.init(
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
        },
        delivery_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        cancel_reason: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        refund_status: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        refund_method: DataTypes.STRING(255),
        refund_amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        deleted_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: true,
    }
);

export default DeletedOrderSystems;