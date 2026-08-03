import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import Coupon from "./coupon.js";
import ShopInfo from "./shop_info.js";

export class CouponShop extends Model {
    declare id: number;
    declare coupon_id: number;
    declare shop_info_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        CouponShop.belongsTo(Coupon, {
            foreignKey: "coupon_id",
        });
        CouponShop.belongsTo(ShopInfo, {
            foreignKey: "shop_info_id",
        });
    }

    static associations: {
        Coupon: Association<CouponShop, Coupon>;
        ShopInfo: Association<CouponShop, ShopInfo>;
    };
}

CouponShop.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
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
        shop_info_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "shop_info",
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
        modelName: "CouponShop",
        tableName: "coupon_shop",
        freezeTableName: true,
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["coupon_id", "shop_id"],
                name: "uq_coupon_shop_coupon_id_shop_info_id",
            },
        ],
    },
);

export default CouponShop;
