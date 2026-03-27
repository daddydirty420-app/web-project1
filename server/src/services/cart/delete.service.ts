import { AppError } from "../../errors.js";
import { Cart } from "../../models/index.js";
import { patchSortNumberDecrease } from "../item/sortNumber/patchItems.service.js";

type Params = {
    itemId: number;
    userId: number;
};

export const deleteCart = async ({ itemId, userId }: Params) => {

    // cart取得
    const cart = await Cart.findOne({
        where: {
            user_id: userId,
            item_id: itemId,
        },
    });

    if (!cart) {
        throw new AppError("CART_NOT_FOUND", 404);
    }

    // cart削除
    await cart.destroy();

    // sort_number 非同期
    const number = 250;
    const buzzNumber = 300;

    patchSortNumberDecrease({ itemId, number, buzzNumber });
};