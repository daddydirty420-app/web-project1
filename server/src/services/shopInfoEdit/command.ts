import { ShopInfoEdit } from "../../models/index.js";
import {
    CreateShopEditComFreeParams,
    CreateShopEditCompanyNameParams,
    CreateShopEditParams,
    CreateShopEditWithIdCardParams,
    UpdateShopEditAnyParams,
} from "../../types/serviceType/shopInfoEdit.js";

export const createShopEdit = ({ data, transaction }: CreateShopEditParams) => {
    return ShopInfoEdit.create(data, { transaction });
};

export const createShopEditWithIdCard = ({ data, transaction }: CreateShopEditWithIdCardParams) => {
    return ShopInfoEdit.create(data, { transaction });
};

export const createShopEditCompanyName = async ({ data, transaction }: CreateShopEditCompanyNameParams) => {
    await ShopInfoEdit.create(data, { transaction });
};

export const createShopEditComFree = ({ data, transaction }: CreateShopEditComFreeParams) => {
    return ShopInfoEdit.create(data, { transaction });
};

export const updateShopEditAny = async ({ shopEdit, data, transaction }: UpdateShopEditAnyParams) => {
    await shopEdit.update(data, { transaction });
};
