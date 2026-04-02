import { destroyItemLike, findItemLike } from "../../services/itemLike.js";
import { AppError } from "../../errors.js";
import { patchSortNumberDecrease } from "../../services/item/sortNumber/patchItems.service.js";

type Params = {
    itemId: number;
    userId: number;
};

export const deleteItemLikeUseCase = async ({ itemId, userId }: Params) => {

    // itemLike取得
    const data = await findItemLike({ itemId, userId });

    if (!data) {
        throw new AppError("NOT_LIKE_ITEM", 409, "いいねしていません");
    }

    // itemLike削除
    await destroyItemLike({ data });

    // sort_number非同期
    const number = 50;
    const buzzNumber = 200;

    patchSortNumberDecrease({ itemId, number, buzzNumber }).catch((err) => {
        console.error("patchSortNumberDecrease error:", err);
    });
};