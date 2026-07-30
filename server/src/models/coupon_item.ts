import { Association, Model } from "sequelize";

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

export default CouponItem;
