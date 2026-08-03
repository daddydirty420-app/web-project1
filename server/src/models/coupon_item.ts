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
        Item: Association<CouponItem, Item>;
    };
}

CouponItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
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
        item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "item",
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
        modelName: "CouponItem",
        tableName: "coupon_item",
        freezeTableName: true,
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["coupon_id", "item_id"],
                name: "uq_coupon_item_coupon_id_item_id",
            },
        ],
    },
);

export default CouponItem;
