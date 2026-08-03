import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import Coupon from "./coupon.js";
import Orders from "./orders.js";
import PurchaseSession from "./purchase_session.js";
import User from "./user.js";

export class CouponUser extends Model {
    declare id: number;

    declare user_id: number;
    declare coupon_id: number;

    declare received_at: Date;
    declare expires_at: Date;
    declare used_at: Date | null;

    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        CouponUser.belongsTo(User, {
            foreignKey: "user_id",
        });
        CouponUser.belongsTo(Coupon, {
            foreignKey: "coupon_id",
        });
        CouponUser.hasMany(PurchaseSession, {
            foreignKey: "coupon_user_id",
        });
        CouponUser.hasMany(Orders, {
            foreignKey: "coupon_user_id",
        });
    }

    static associations: {
        User: Association<CouponUser, User>;
        Coupon: Association<CouponUser, Coupon>;
        PurchaseSession: Association<CouponUser, PurchaseSession>;
        Orders: Association<CouponUser, Orders>;
    };
}

CouponUser.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        coupon_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "coupon",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        received_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        used_at: {
            type: DataTypes.DATE,
            allowNull: true,
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
        modelName: "CouponUser",
        tableName: "coupon_user",
        freezeTableName: true,
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["coupon_id", "user_id"],
                name: "uq_coupon_user_coupon_id_user_id",
            },
        ],
    },
);

export default CouponUser;
