import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { validateQuery } from "../../middleware/validate/validateQuery.js";
import { getAllItemListUseCase } from "../../usecases/dev/items/getItemList.js";
import { GetDevItemListQuery, getDevItemListQuerySchema } from "../../validators/query/dev/items.js";

const router = Router();

// GET /dev/item?limit=number&cursor
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
            next();
        }
    },
);

export default router;
