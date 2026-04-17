import sequelize from "../../db.js";
import { AppError } from "../../errors.js";
import { createDeliveryAddress, getAddressOne } from "../../services/address.js";
import { createDelivery } from "../../services/delivery.js";
import { getItemForBuy } from "../../services/items/index.js";
import { createDeliveryName, getNameOne } from "../../services/name.js";
import { getUser } from "../../services/users/query.js";

type Params = {
    itemId: number;
    userId: number;
};

export const postDeliveryBuyUseCase = async ({ itemId, userId }: Params) => {
    // 自ユーザー情報取得
    const user = await getUser({ userId });
    if (!user) {
        throw new AppError("USER_NOTFOUND", 404);
    }

    // Item取得
    const item = await getItemForBuy({ itemId });
    if (!item) {
        throw new AppError("ITEM_NOTFOUND", 404);
    }

    if (item.status !== "active") {
        throw new AppError("INVALID_ITEM", 400, "この商品は販売中ではないため購入できません");
    }

    // 住所・氏名取得
    const userAddress = await getAddressOne({ userId });

    const userName = await getNameOne({ userId });

    // データ作成
    const deliveryId = await sequelize.transaction(async (t) => {
        const newDelivery = await createDelivery({ itemId, item, user, transaction: t });

        const id = newDelivery.id;

        await createDeliveryAddress({ deliveryId: id, userAddress, transaction: t });

        await createDeliveryName({ deliveryId: id, userName, transaction: t });

        return id;
    });

    return deliveryId;
};
