import { AppError } from "../../errors.js";
import { ItemLike } from "../../models/index.js";
import { patchSortNumberDecrease } from "../item/sortNumber/patchItems.service.js";

type Params = {
    itemId: number;
    userId: number;
};

export const deleteItemLike = async ({ itemId, userId }: Params) => {

    // itemLike取得
    const data = await ItemLike.findOne({
        where: {
            item_id: itemId,
            user_id: userId,
        },
    });

    if (!data) {
        throw new AppError("NOT_LIKE_ITEM", 409, "いいねしていません");
    }

    // itemLike削除
    await data.destroy();

    // sort_number非同期
    const number = 50;
    const buzzNumber = 200;

    patchSortNumberDecrease({ itemId, number, buzzNumber }).catch((err) => {
        console.error("patchSortNumberDecrease error:", err);
    });
};