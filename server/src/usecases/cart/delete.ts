import { destroyCart, findCart } from "../../services/cart.js";
import { AppError } from "../../errors.js";
import { patchSortNumberDecrease } from "../../services/item/sortNumber/patchItems.service.js";

type Params = {
    itemId: number;
    userId: number;
};

export const deleteCartUseCase = async ({ itemId, userId }: Params) => {

    // cart取得
    const cart = await findCart({ itemId, userId });

    if (!cart) {
        throw new AppError("CART_NOT_FOUND", 404);
    }

    // cart削除
    await destroyCart({ cart });

    // sort_number 非同期
    const number = 250;
    const buzzNumber = 300;

    patchSortNumberDecrease({ itemId, number, buzzNumber }).catch((err) => {
        console.error("patchSortNumberDecrease error:", err);
    });
};