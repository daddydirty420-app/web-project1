import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

import Categories from "./categories.js";
import Coupon from "./coupon.js";

export class CouponCategory extends Model {
    declare id: number;
    declare coupon_id: number;
    declare category_id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        CouponCategory.belongsTo(Coupon, {
            foreignKey: "coupon_id",
        });
        CouponCategory.belongsTo(Categories, {
            foreignKey: "category_id",
        });
    }

    static associations: {
        Coupon: Association<CouponCategory, Coupon>;
        Categories: Association<CouponCategory, Categories>;
    };
}

CouponCategory.init(
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
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "categories",
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
        modelName: "CouponCategory",
        tableName: "coupon_category",
        freezeTableName: true,
        timestamps: true,
    },
);

export default CouponCategory;
