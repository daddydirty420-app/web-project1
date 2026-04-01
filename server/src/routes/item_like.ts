import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import { authenticateOptional, authenticateToken } from "../middleware/index.js";
import { ItemLike, User, Follow, ShopInfo } from "../models/index.js";
import { deleteItemLike } from "../services/itemLike/delete.service.js";
import { addItemLike } from "../services/itemLike/add.service.js";
import { itemLikeStatus } from "../services/itemLike/status.service.js";
import { itemLikeCount } from "../services/itemLike/count.service.js";
import { getItemLikeUserList } from "services/itemLike/userList.service.js";

const router = Router();

// POST /item-like/:id
router.post('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        await addItemLike({ itemId, userId });

        res.status(200).json({ isGood: true });
    } catch (err) {
        next(err);
    }
});

// DELETE /item-like/:id
router.delete('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        await deleteItemLike({ itemId, userId });

        res.status(200).json({ isGood: false });
    } catch (err) {
        next(err);
    }
});

// GET /item-like/:id/status
router.get('/:id/status', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        const isGood = await itemLikeStatus({ itemId, userId });

        res.status(200).json({ isGood });
    } catch (err) {
        next(err);
    }
});

// GET /item-like/:id/count
router.get('/:id/count', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    try {
        const count = await itemLikeCount({ itemId });

        res.status(200).json({ count });
    } catch (err) {
        next(err);
    }
});

// GET /item-like/:id/user(?keyword="")
router.get("/:id/user", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    const keyword = req.query.keyword as string | undefined;

    try {
        const userList = await getItemLikeUserList({ itemId, userId, keyword });

        res.status(200).json({ userList });
    } catch (err) {
        next(err);
    }
});

export default router;