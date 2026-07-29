import { AppError } from "../../../errors.js";
import { destroyDraftItem, getItem } from "../../../services/items/index.js";
import { getMyItem } from "../../../services/items/query/relation.js";

type Params = {
    itemId: number;
    userId: number;
};

// DELETE /items/:id/draft
// summary: 下書き商品削除
// page: /item/draft/[id]
export const deleteDraftItemUseCase = async ({ itemId, userId }: Params) => {
    // item取得
    const item = await getMyItem({ itemId, userId });
    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    if (item.status !== "draft") {
        throw new AppError("INVALID_ITEM", 400, "不正なアクセスが検出されました");
    }

    // item削除
    await destroyDraftItem({ item });
};
