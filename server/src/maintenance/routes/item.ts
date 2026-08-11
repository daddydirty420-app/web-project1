import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { validateQuery } from "../../middleware/validate/validateQuery.js";
import { GetDevItemListQuery, getDevItemListQuerySchema } from "../../validators/query/maintenance/items.js";
import { getAllItemListUseCase } from "../usecase/item/getItemList.js";

const router = Router();

// GET /maintenance/item?limit=number&cursor
router.get(
    "/",
    validateQuery(getDevItemListQuerySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const query = req.validatedQuery as GetDevItemListQuery;
        const { limit, cursor } = query;

        try {
            const usecase = new getAllItemListUseCase();

            const { itemList, nextCursor, hasMore } = await usecase.execute({ limit, cursor });

            res.status(200).json({ itemList, nextCursor, hasMore });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
