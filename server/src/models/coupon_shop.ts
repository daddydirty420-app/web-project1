import { Model } from "sequelize";
import Coupon from "./coupon.js";
import ShopInfo from "./shop_info.js";

export class CouponShop extends Model {
    declare id: number;
    declare coupon_id: number;
    declare shop_info_id: number;

    static associate() {
        CouponShop.belongsTo(Coupon, {
            foreignKey: "coupon_id",
        });
        CouponShop.belongsTo(ShopInfo, {
            foreignKey: "Shop_info_id",
        });
    }
}

export default CouponShop;
