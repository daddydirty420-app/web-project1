import { createCart, findCart } from "../../services/cart.js";
import { AppError } from "../../errors.js";
import { patchSortNumberAdd } from "../../services/item/sortNumber/patchItems.service.js";

type Params = {
    itemId: number;
    userId: number;
};

export const addCartUseCase = async ({ itemId, userId }: Params) => {

    // cart取得
    const cart = await findCart({ itemId, userId });

    if (cart) {
        throw new AppError("INVALID_ADD_CART", 409);
    }

    // cart作成
    await createCart({ itemId, userId });

    // sort_number 非同期
    const number = 250;
    const buzzNumber = 300;

    patchSortNumberAdd({ itemId, number, buzzNumber }).catch((err) => {
        console.error("patchSortNumberAdd error:", err);
    });
};