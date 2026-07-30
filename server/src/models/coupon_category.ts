import { Model } from "sequelize";
import Categories from "./categories.js";
import Coupon from "./coupon.js";

export class CouponCategory extends Model {
    declare id: number;
    declare coupon_id: number;
    declare category_id: number;

    static associate() {
        CouponCategory.belongsTo(Coupon, {
            foreignKey: "coupon_id",
        });
        CouponCategory.belongsTo(Categories, {
            foreignKey: "category_id",
        });
    }
}

export default CouponCategory;
