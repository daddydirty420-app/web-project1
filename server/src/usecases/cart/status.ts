import { findCart } from "../../services/cart.js";

type Params = {
    itemId: number;
    userId: number;
};

export const cartStatusUseCase = async ({ itemId, userId }: Params) => {

    const status = await findCart({ itemId, userId });

    return !!status;
};