import { Cart } from "../models/index.js";
import { ItemUserParams } from "../types/serviceType/cart";

type DestroyParams = {
    cart: InstanceType<typeof Cart>;
};

export const findCart = async ({ itemId, userId }: ItemUserParams) => {
    return Cart.findOne({
        where: {
            user_id: userId,
            item_id: itemId,
        },
    });
};

export const createCart = async ({ itemId, userId }: ItemUserParams) => {
    return Cart.create({
        user_id: userId,
        item_id: itemId,
    });
};

export const destroyCart = async ({ cart }: DestroyParams) => {
    await cart.destroy();
};