import { getCartOne } from "../../services/cart.js";

type Params = {
    itemId: number;
    userId: number;
};

export const cartStatusUseCase = async ({ itemId, userId }: Params) => {

    const status = await getCartOne({ itemId, userId });

    return !!status;
};