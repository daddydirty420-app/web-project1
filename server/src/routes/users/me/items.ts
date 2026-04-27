import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../../../errors.js";
import { authenticateToken } from "../../../middleware/index.js";
import { UserItemsListType } from "../../../types/usecaseType.js";
import { getUserItemsCartsUseCase } from "../../../usecases/items/itemList/userItems/getCarts.js";
import { getDeletedItemsUseCase } from "../../../usecases/items/itemList/userItems/getDeletedItems.js";
import { getDraftItemsUseCase } from "../../../usecases/items/itemList/userItems/getDraftItems.js";
import { getUserItemsLikesUseCase } from "../../../usecases/items/itemList/userItems/getLikes.js";
import { getStockItemsUseCase } from "../../../usecases/items/itemList/userItems/getStock.js";
import { getUploadedItemsUseCase } from "../../../usecases/items/itemList/userItems/getUploaded.js";
import { getUserItemsWatchUseCase } from "../../../usecases/items/itemList/userItems/getWatchHistory.js";
import { normalizeJapanese } from "../../../utils/normalizeJapanese.js";

const router = Router();

// /users/me/items?type="typename"(&page=number&status=""&keyword="search")
// summary: ユーザー関連各種商品リスト取得
// page: /item-list/...
router.get("/", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;

    const type = req.query.type as UserItemsListType;

    if (!type) {
        throw new AppError("INVALID_TYPE", 400);
    }

    const page = parseInt(req.query.page as string) || 1;

    const status = req.query.status as string | undefined;

    const rawKeyword = req.query.keyword as string | undefined;

    const keyword = rawKeyword ? normalizeJapanese(rawKeyword) : undefined;

    const baseParams = { page, userId, keyword };

    const usecaseMap: Record<UserItemsListType, () => Promise<any>> = {
        cart: () => getUserItemsCartsUseCase(baseParams),
        deleted: () => getDeletedItemsUseCase(baseParams),
        draft: () => getDraftItemsUseCase(baseParams),
        like: () => getUserItemsLikesUseCase(baseParams),
        stock: () => getStockItemsUseCase(baseParams),
        uploaded: () => getUploadedItemsUseCase({ ...baseParams, status }),
        watchHistory: () => getUserItemsWatchUseCase(baseParams),
    };

    const usecase = usecaseMap[type];

    if (!usecase) {
        throw new AppError("INVALID_TYPE", 400);
    }

    try {
        const { itemList, totalPages } = await usecase();

        res.status(200).json({ itemList, totalPages });
    } catch (err) {
        next(err);
    }
});

export default router;
