import { Item } from "../../../models/index.js";
import { AppError } from "../../../errors.js";

type Params = {
    itemId: number;
    userId: number;
};

export const deleteDraftItem = async ({ itemId, userId }: Params) => {

    // item取得
    const item = await Item.findByPk(itemId);
    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    if (item.seller_id !== userId || item.status !== "draft") {
        throw new AppError("INVALID_ITEM", 400, "不正なアクセスが検出されました");
    }

    // item削除
    await item.destroy();
}