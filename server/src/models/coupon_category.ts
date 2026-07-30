import { Association, Model } from "sequelize";

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
        ShopInfo: Association<CouponCategory, Categories>;
    };
}

export default CouponCategory;
