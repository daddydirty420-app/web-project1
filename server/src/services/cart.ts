import { Transaction } from "sequelize";
import { Cart } from "../models/index.js";
import { ItemIdParams, ItemUserParams } from "../types/serviceType/cart.js";

type DestroyParams = {
    cart: InstanceType<typeof Cart>;
};

type DestroyAllParams = {
    carts: InstanceType<typeof Cart>[];
    transaction: Transaction;
};

export const findCart = async ({ itemId, userId }: ItemUserParams) => {
    return Cart.findOne({
        where: {
            user_id: userId,
            item_id: itemId,
        },
    });
};

export const findAllCarts = async ({ itemId }: ItemIdParams) => {
    return Cart.findAll({
        where: { item_id: itemId },
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

export const destroyAllCarts = async ({ carts, transaction }: DestroyAllParams) => {
    await Promise.all(carts.map(async (cart: InstanceType<typeof Cart>) => {
        await cart.destroy({ transaction });
    }));
};