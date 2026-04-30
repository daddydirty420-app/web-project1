import { ShopInfo } from "../../models/index.js";
import {
    CreateShopParams,
    ShopTransactionParams,
    UpdateCompanyNameParams,
    UpdateOptionParams,
    UpdateShopAnyParams,
    UpdateShopEmailParams,
    UpdateShopIdCardParams,
    UpdateShopIdPermitParams,
    UpdateShopNameParams,
    UpdateShopPhoneNumberParams,
    UpdateShopRequestAllParams,
    UpdateShopUserLogicalDeleteParams,
} from "../../types/serviceType/shopInfo.js";

export const createShop = ({ data, transaction }: CreateShopParams) => {
    return ShopInfo.create(data, { transaction });
};

export const updateShopEmail = async ({ shopInfo, data, transaction }: UpdateShopEmailParams) => {
    await shopInfo.update(data, { transaction });
};

export const updateShopIdCard = async ({ shopInfo, data, transaction }: UpdateShopIdCardParams) => {
    await shopInfo.update(data, { transaction });
};

export const updateShopIdPermit = async ({ shopInfo, data, transaction }: UpdateShopIdPermitParams) => {
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

export const updateShopOption = async ({ shopInfo, data, transaction }: UpdateOptionParams) => {
    await shopInfo.update(data, { transaction });
};

export const updateShopRequestAll = async ({ shopInfo, data, transaction }: UpdateShopRequestAllParams) => {
    await shopInfo.update(data, { transaction });
};

export const updateShopUserLogicalDelete = async ({
    shopInfo,
    data,
    transaction,
}: UpdateShopUserLogicalDeleteParams) => {
    await shopInfo.update(data, { transaction });
};

export const updateShopAny = async ({ shopInfo, data, transaction }: UpdateShopAnyParams) => {
    await shopInfo.update(data, { transaction });
};

export const deleteShop = async ({ shopInfo, transaction }: ShopTransactionParams) => {
    await shopInfo.update({ transaction });
};
