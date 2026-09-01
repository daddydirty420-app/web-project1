import { IdCard, Permit, PermitFile, S3Metadata, ShopSignup } from "../models/index.js";
import {
    CreateShopSignupParams,
    UpdateBankAccountParams,
    UpdateSignup3Params,
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

export const getMyShopSignupHasS3Data = ({ shopSignupId, userId }: UserShopSignupIdParams) => {
    return ShopSignup.findOne({
        where: {
            id: shopSignupId,
            user_id: userId,
        },
        include: [
            {
                model: IdCard,
                required: false,
                include: [
                    {
                        model: S3Metadata,
                        as: "FrontIdCard",
                        required: false,
                    },
                    {
                        model: S3Metadata,
                        as: "RearIdCard",
                        required: false,
                    },
                ],
            },
            {
                model: Permit,
                required: false,
                include: [
                    {
                        model: PermitFile,
                        required: false,
                        include: [
                            {
                                model: S3Metadata,
                                required: false,
                            },
                        ],
                    },
                ],
            },
        ],
    });
};

export const createShopSignup = ({ data, transaction }: CreateShopSignupParams) => {
    return ShopSignup.create(data, { transaction });
};

export const updateShopSignupBankAccount = async ({ shopSignup, data, transaction }: UpdateBankAccountParams) => {
    await shopSignup.update(data, { transaction });
};

export const updateSignup3 = async ({ shopSignup, data, transaction }: UpdateSignup3Params) => {
    await shopSignup.update(data, { transaction });
};
