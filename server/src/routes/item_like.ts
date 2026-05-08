import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { validateParams } from "../middleware/validateParams.js";
import { addItemLikeUseCase } from "../usecases/itemLike/add.js";
import { itemLikeCountUseCase } from "../usecases/itemLike/count.js";
import { deleteItemLikeUseCase } from "../usecases/itemLike/delete.js";
import { itemLikeStatusUseCase } from "../usecases/itemLike/status.js";
import { getItemLikeUserListUseCase } from "../usecases/itemLike/userList.js";
import { idParamSchema } from "../validators/params/id.js";
import { validateQuery } from "../middleware/validateQuery.js";
import { KeywordOptionalQuery, keywordOptionalQuerySchema } from "../validators/query/keyword.js";

const router = Router();

// POST /item-like/:id
// summary: いいね作成
// page: /item
router.post(
    "/:id",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);
        const userId = req.user!.id;

        try {
            await addItemLikeUseCase({ itemId, userId });

            res.status(200).json({ isGood: true });
        } catch (err) {
            next(err);
        }
    },
);

// DELETE /item-like/:id
// summary: いいね削除
// page: /item
router.delete(
    "/:id",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);
        const userId = req.user!.id;

        try {
            await deleteItemLikeUseCase({ itemId, userId });

            res.status(200).json({ isGood: false });
        } catch (err) {
            next(err);
        }
    },
);

// GET /item-like/:id/status
// summary: いいねステータス取得
// page: /item
router.get(
    "/:id/status",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);
        const userId = req.user!.id;

        try {
            const isGood = await itemLikeStatusUseCase({ itemId, userId });

            res.status(200).json({ isGood });
        } catch (err) {
            next(err);
        }
    },
);

// GET /item-like/:id/count
// summary: いいね数取得
// page: /item
router.get(
    "/:id/count",
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);

        try {
            const count = await itemLikeCountUseCase({ itemId });

            res.status(200).json({ count });
        } catch (err) {
            next(err);
        }
    },
);

// GET /item-like/:id/user(?keyword="")
// summary: いいねしたユーザーリスト取得
// page: /user-list/item-like/[id]
router.get(
    "/:id/user",
    validateParams(idParamSchema),
    validateQuery(keywordOptionalQuerySchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);
        const userId = req.user!.id;

        const query = req.validatedQuery as KeywordOptionalQuery;
        const keyword = query.keyword;

        try {
            const userList = await getItemLikeUserListUseCase({ itemId, userId, keyword });

            res.status(200).json({ userList });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
