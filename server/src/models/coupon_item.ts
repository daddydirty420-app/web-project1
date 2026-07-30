import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import Coupon from "./coupon.js";
import Item from "./item.js";

export class CouponItem extends Model {
    declare id: number;
    declare coupon_id: number;
    declare item_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        CouponItem.belongsTo(Coupon, {
            foreignKey: "coupon_id",
        });
        CouponItem.belongsTo(Item, {
            foreignKey: "item_id",
        });
    }

    static associations: {
        Coupon: Association<CouponItem, Coupon>;
        ShopInfo: Association<CouponItem,Item>;
    };
}

CouponItem.init(
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
        item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "CouponItem",
        tableName: "coupon_item",
        freezeTableName: true,
        timestamps: true,
    },
);

export default CouponItem;
