import { ShopInfoEdit } from "../../models/index.js";
import {
    CreateShopEditCompanyNameParams,
    CreateShopEditParams,
    CreateShopEditWithIdCardParams,
} from "../../types/serviceType/shopInfoEdit.js";

export const createShopEdit = ({ data, transaction }: CreateShopEditParams) => {
    return ShopInfoEdit.create(data, { transaction });
};

export const createShopEditWithIdCard = ({ data, transaction }: CreateShopEditWithIdCardParams) => {
    return ShopInfoEdit.create(data, { transaction });
};

export const createShopEditCompanyName = ({ data, transaction }: CreateShopEditCompanyNameParams) => {
    return ShopInfoEdit.create(data, { transaction });
};
