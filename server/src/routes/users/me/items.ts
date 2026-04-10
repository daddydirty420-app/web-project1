import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../../../middleware/index.js";
import { normalizeJapanese } from "../../../utils/normalizeJapanese.js";
import { AppError } from "../../../errors.js";
import { UserItemsListType } from "../../../types/usecaseType.js";
import { getDraftItemsUseCase } from "../../../usecases/item/itemList/userItems/getDraftItems.js";
import { getUserItemsCartsUseCase } from "../../../usecases/item/itemList/userItems/getCarts.js";
import { getDeletedItemsUseCase } from "../../../usecases/item/itemList/userItems/getDeletedItems.js";
import { getUserItemsLikesUseCase } from "../../../usecases/item/itemList/userItems/getLikes.js";
import { getStockItemsUseCase } from "../../../usecases/item/itemList/userItems/getStock.js";
import { getUploadedItemsUseCase } from "../../../usecases/item/itemList/userItems/getUploaded.js";
import { getUserItemsWatchUseCase } from "../../../usecases/item/itemList/userItems/getWatchHistory.js";

const router = Router();

// /items?type="typename"(&page=number&status=""&keyword="search")
router.get("/", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;

    const type = req.query.type as UserItemsListType;

    if (!type) {
        throw new AppError("INVALID_TYPE", 400);
    }

    const page = parseInt(req.query.page as string) || 1;

    const status = req.query.status as string | undefined;
        
    const rawKeyword = req.query.keyword as string | undefined;

    const keyword = rawKeyword
    ? normalizeJapanese(rawKeyword)
    : undefined;

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