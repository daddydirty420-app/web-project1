import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../../../errors.js";
import { authenticateToken } from "../../../middleware/index.js";
import { validateQuery } from "../../../middleware/validateQuery.js";
import { getUserItemsCartsUseCase } from "../../../usecases/items/itemList/userItems/getCarts.js";
import { getDeletedItemsUseCase } from "../../../usecases/items/itemList/userItems/getDeletedItems.js";
import { getDraftItemsUseCase } from "../../../usecases/items/itemList/userItems/getDraftItems.js";
import { getUserItemsLikesUseCase } from "../../../usecases/items/itemList/userItems/getLikes.js";
import { getStockItemsUseCase } from "../../../usecases/items/itemList/userItems/getStock.js";
import { getUploadedItemsUseCase } from "../../../usecases/items/itemList/userItems/getUploaded.js";
import { getUserItemsWatchUseCase } from "../../../usecases/items/itemList/userItems/getWatchHistory.js";
import { normalizeJapanese } from "../../../utils/normalizeJapanese.js";
import {
    UserItemsListQuery,
    userItemsListQuerySchema,
    UserItemsListType,
} from "../../../validators/query/userItems.js";

const router = Router();

// /users/me/items?type="typename"(&page=number&status=""&keyword="search")
// summary: ユーザー関連各種商品リスト取得
// page: /item-list/...
router.get(
    "/",
    authenticateToken,
    validateQuery(userItemsListQuerySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        const query = req.validatedQuery as UserItemsListQuery;

        const type = query.type;

        const page = query.page ?? 1;

        const status = query.status;

        const rawKeyword = query.keyword;

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
    },
);

export default router;
