import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { validateQuery } from "../../middleware/validate/validateQuery.js";
import { GetDevUserListQuery, getDevUserListQuerySchema } from "../../validators/query/dev/users.js";
import { getAllUserListUseCase } from "../usecase/user/getUserList.js";

const router = Router();

// GET /maintenance/users?limit=number&cursor
router.get(
    "/",
    validateQuery(getDevUserListQuerySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const query = req.validatedQuery as GetDevUserListQuery;
        const { limit, cursor } = query;

        try {
            const usecase = new getAllUserListUseCase();

            const { userList, nextCursor, hasMore } = await usecase.execute({ limit, cursor });

            res.status(200).json({ userList, nextCursor, hasMore });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
