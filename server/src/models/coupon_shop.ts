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
        },
        shop_info_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "CouponShop",
        tableName: "coupon_shop",
        freezeTableName: true,
        timestamps: true,
    },
);

export default CouponShop;
