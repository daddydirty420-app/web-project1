import { Cart } from "../../models/index.js";

type Params = {
    itemId: number;
    userId: number;
};

export const cartStatus = async ({ itemId, userId }: Params) => {

    const status = await Cart.findOne({
        where: {
            item_id: itemId,
            user_id: userId,
        },
    });

    return !!status;
};