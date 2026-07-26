import sequelize from "../../db.js";
import { AppError } from "../../errors.js";
import { createAddress } from "../../services/address.js";
import { createDelivery } from "../../services/delivery.js";
import { getItemForBuy } from "../../services/items/index.js";
import { createDeliveryName, getNameOne } from "../../services/name.js";
import { getUser, getUserHasAddress } from "../../services/users/query.js";

type Params = {
    itemId: number;
    userId: number;
};

// POST /delivery/:id
// summary: 配送データ作成
// page: /item
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
        throw new AppError("INVALID_ITEM", 400);
    }

    // 住所・氏名取得
    const userAddress = await getUserHasAddress({ userId });
    const address = userAddress.Address;

    const userName = await getNameOne({ userId });

    // データ作成
    const deliveryId = await sequelize.transaction(async (t) => {
        const newAddress = await createAddress({
            data: {
                post_number: address?.post_number ?? null,
                todouhuken_id: address?.todouhuken_id ?? null,
                shikutyouson: address?.shikutyouson ?? null,
                banchi: address?.banchi ?? null,
                building: address?.building ?? null,
            },
            transaction: t,
        });

        const addressId = newAddress.id;

        await createDeliveryName({
            data: {
                delivery_id: deliveryId,
                sei: userName?.sei ?? null,
                mei: userName?.mei ?? null,
                sei_kana: userName?.sei_kana ?? null,
                mei_kana: userName?.mei_kana ?? null,
            },
            transaction: t,
        });

        const newDelivery = await createDelivery({ itemId, addressId, item, user, transaction: t });

        const id = newDelivery.id;

        return id;
    });

    return deliveryId;
};
