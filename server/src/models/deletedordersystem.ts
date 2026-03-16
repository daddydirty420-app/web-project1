import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../db.js";

import Order  from "./order.js";
import User from "./user.js";
import Delivery from "./delivery.js";

export class DeletedOrderSystems extends Model {
    declare id: number;
    declare order_id: number;
    declare delivery_id: number;
    declare cancel_reason: string;
    declare refund_status: string;
    declare refund_method: string | null;
    declare refund_amount: number;
    declare deleted_by: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        DeletedOrderSystems.belongsTo(Order, {
            foreignKey: "order_id",
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
        Order: Association<DeletedOrderSystems, Order>;
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
        order_id: {
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