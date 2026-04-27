import sequelize from "../../../db.js";
import { createItem } from "../../../services/items/index.js";
import { createShipping } from "../../../services/itemShippingProfile.js";
import { createSale } from "../../../services/sale.js";
import { createVideo } from "../../../services/video.js";

type Params = {
    userId: number;
};

export const createItemsUseCase = async ({ userId }: Params) => {
    return await sequelize.transaction(async (t) => {
        const itemId = await createItem({ userId, transaction: t });

        await createVideo({ userId, itemId, transaction: t });
        await createSale({ itemId, transaction: t });
        await createShipping({ itemId, transaction: t });

        return itemId;
    });
};
