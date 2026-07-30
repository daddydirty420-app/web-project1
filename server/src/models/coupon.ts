import { Association, DataTypes, Model } from "sequelize";
import CouponUser from "./coupon_user.js";
import User from "./user.js";
import CouponItem from "./coupon_item.js";
import CouponShop from "./coupon_shop.js";
import CouponCategory from "./coupon_category.js";

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
    }
}

export default Coupon;
