import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import CouponCategory from "./coupon_category.js";
import CouponItem from "./coupon_item.js";
import CouponShop from "./coupon_shop.js";
import CouponUser from "./coupon_user.js";
import User from "./user.js";

export class Coupon extends Model {
    declare id: number;

    declare name: string;
    declare description: string;

    declare discount_type: "fixed" | "percent" | "free_shipping"; // 固定額 or パーセンテージ or 送料無料
    declare discount_value: number;

    declare minimum_amount: number | null; // 最低購入金額
    declare maximum_discount: number | null; // 最大割引額（%用）

    declare user_limit: number | null; // 1人何枚まで配布
    declare issue_limit: number | null; // 先着何枚

    declare distribution_type: "public" | "manual" | "campaign"; // 配布方法

    declare started_at: Date;
    declare expires_at: Date;

    declare status: "active" | "stopped";

    declare created_admin_id: number;
    declare updated_admin_id: number;

    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        Coupon.belongsTo(User, {
            foreignKey: "created_admin_id",
            as: "CreatedAdmin",
        });
        Coupon.belongsTo(User, {
            foreignKey: "updated_admin_id",
            as: "UpdatedAdmin",
        });
        Coupon.hasMany(CouponUser, {
            foreignKey: "coupon_id",
        });
        Coupon.hasMany(CouponItem, {
            foreignKey: "coupon_id",
        });
        Coupon.hasMany(CouponShop, {
            foreignKey: "coupon_id",
        });
        Coupon.hasMany(CouponCategory, {
            foreignKey: "coupon_id",
        });
    }

    static associations: {
        User: Association<Coupon, User>;
        CouponUser: Association<Coupon, CouponUser>;
        CouponItem: Association<Coupon, CouponItem>;
        CouponShop: Association<Coupon, CouponShop>;
        CouponCategory: Association<Coupon, CouponCategory>;
    };
}

Coupon.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        discount_type: {
            type: DataTypes.ENUM("fixed", "percent", "free_shipping"),
            allowNull: false,
        },
        discount_value: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        minimum_amount: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        maximum_discount: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        user_limit: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        issue_limit: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        distribution_type: {
            type: DataTypes.ENUM("public", "manual", "campaign"),
            allowNull: false,
            defaultValue: "public",
        },
        started_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("active", "stopped"),
            allowNull: false,
            defaultValue: "active",
        },
        created_admin_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        updated_admin_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
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
        modelName: "Coupon",
        tableName: "coupon",
        freezeTableName: true,
        timestamps: true,
    },
);

export default Coupon;
