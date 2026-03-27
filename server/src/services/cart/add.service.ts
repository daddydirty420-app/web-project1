import { AppError } from "../../errors.js";
import { Cart } from "../../models/index.js";
import { patchSortNumberAdd } from "../item/sortNumber/patchItems.service.js";

type Params = {
    itemId: number;
    userId: number;
};

export const addCart = async ({ itemId, userId }: Params) => {

    // cart取得
    const cart = await Cart.findOne({
        where: {
            user_id: userId,
            item_id: itemId,
        },
    });

    if (cart) {
        throw new AppError("INVALID_ADD_CART", 409);
    }

    // cart作成
    await Cart.create({
        user_id: userId,
        item_id: itemId,
    });

    // sort_number 非同期
    const number = 250;
    const buzzNumber = 300;

    patchSortNumberAdd({ itemId, number, buzzNumber });
};