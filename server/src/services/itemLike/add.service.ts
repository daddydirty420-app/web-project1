import { AppError } from "../../errors.js";
import { ItemLike } from "../../models/index.js";
import { patchSortNumberAdd } from "../item/sortNumber/patchItems.service.js";

type Params = {
    itemId: number;
    userId: number;
};

export const addItemLike = async ({ itemId, userId }: Params) => {

    // itemLike取得
    const data = await ItemLike.findOne({
        where: {
            item_id: itemId,
            user_id: userId,
        },
    });

    if (data) {
        throw new AppError("NOT_LIKE_ITEM", 409, "すでにいいね済みです");
    }

    // itemLike作成
    await ItemLike.create({
        item_id: itemId,
        user_id: userId,
    });

    // sort_number非同期
    const number = 50;
    const buzzNumber = 200;

    patchSortNumberAdd({ itemId, number, buzzNumber }).catch((err) => {
        console.error("patchSortNumberAdd error:", err);
    });
}