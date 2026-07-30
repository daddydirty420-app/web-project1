import { Model } from "sequelize";

import Coupon from "./coupon.js";
import User from "./user.js";
import PurchaseSession from "./purchase_session.js";

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
        CouponUser.hasOne(PurchaseSession, {
            foreignKey: "coupon_user_id",
        });
    }
}

export default CouponUser;
