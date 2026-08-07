import type { NextFunction, Request, Response } from "express-serve-static-core";
import { getUserItemsUseCase } from "../../../usecases/items/itemList/userItems.js";
import type { UserItemsListQuery } from "../../../validators/query/userItems.js";

// /users/me/items?type="typename"(&page=number&status=""&keyword="search")
// summary: ユーザー関連各種商品リスト取得
// page: /item-list/...
export const usersMeItemsGetRootController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user!.id;

        const query = req.validatedQuery as UserItemsListQuery;

        const { itemList, totalPages } = await getUserItemsUseCase({ ...query, userId });

        res.status(200).json({ itemList, totalPages });
    } catch (err) {
        next(err);
    }
};
