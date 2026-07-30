import { Association, Model } from "sequelize";

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
            foreignKey: "Shop_info_id",
        });
    }

    static associations: {
        Coupon: Association<CouponShop, Coupon>;
        ShopInfo: Association<CouponShop, ShopInfo>;
    };
}

export default CouponShop;
