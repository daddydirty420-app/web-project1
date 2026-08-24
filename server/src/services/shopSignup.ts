import { ShopSignup } from "../models/index.js";
import {
    CreateShopSignupParams,
    UpdateBankAccountParams,
    UserShopSignupIdParams,
} from "../types/serviceType/shopSignup.js";

export const getMyShopSignup = ({ shopSignupId, userId }: UserShopSignupIdParams) => {
    return ShopSignup.findOne({
        where: {
            id: shopSignupId,
            user_id: userId,
        },
    });
};

export const createShopSignup = ({ data, transaction }: CreateShopSignupParams) => {
    return ShopSignup.create(data, { transaction });
};

export const updateShopSignupBankAccount = async ({ shopSignup, data, transaction }: UpdateBankAccountParams) => {
    await shopSignup.update(data, { transaction });
};
