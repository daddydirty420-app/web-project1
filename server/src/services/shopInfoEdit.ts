import { Transaction } from "sequelize";
import { ShopInfoEdit } from "../models/index.js";

type CreateShopEditParams = {
    data: {
        user_id: number;
        shop_info_id: number;
    };
    transaction?: Transaction;
};

export const createShopEdit = ({ data, transaction }: CreateShopEditParams) => {
    return ShopInfoEdit.create(data, { transaction });
};