import {
    UpdateCompanyNameParams,
    UpdateShopEmailParams,
    UpdateShopIdCardParams,
    UpdateShopNameParams,
    UpdateShopPhoneNumberParams,
} from "../../types/serviceType/shopInfo.js";

export const updateShopEmail = async ({ shopInfo, data, transaction }: UpdateShopEmailParams) => {
    await shopInfo.update(data, { transaction });
};

export const updateShopIdCard = async ({ shopInfo, data, transaction }: UpdateShopIdCardParams) => {
    await shopInfo.update(data, { transaction });
};

export const updateShopPhoneNumber = async ({ shopInfo, data, transaction }: UpdateShopPhoneNumberParams) => {
    await shopInfo.update(data, { transaction });
};

export const updateShopName = async ({ shopInfo, data, transaction }: UpdateShopNameParams) => {
    await shopInfo.update(data, { transaction });
};

export const updateShopCompanyName = async ({ shopInfo, data, transaction }: UpdateCompanyNameParams) => {
    await shopInfo.update(data, { transaction });
};
