import { ShopSignup } from "../models/index.js";
import { CreateShopSignupParams } from "../types/serviceType/shopSignup.js";

export const createShopSignup = ({ data, transaction }: CreateShopSignupParams) => {
    return ShopSignup.create(data, { transaction });
};
