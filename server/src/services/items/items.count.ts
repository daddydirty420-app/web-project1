import { Op } from "sequelize";
import { Item } from "../../models/index.js";
import { UserIdParams } from "../../types/serviceType/items/items.js";

export const countSellItem = async ({ userId }: UserIdParams) => {
    return Item.count({
        where: {
            seller_id: userId,
            status: { [Op.in]: ["active", "soldout"] },
        },
    });
};