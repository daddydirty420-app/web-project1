import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { deleteItemLikeUseCase } from "../usecases/itemLike/delete.js";
import { addItemLikeUseCase } from "../usecases/itemLike/add.js";
import { itemLikeStatusUseCase } from "../usecases/itemLike/status.js";
import { itemLikeCountUseCase } from "../usecases/itemLike/count.js";
import { getItemLikeUserListUseCase } from "../usecases/itemLike/userList.js";

const router = Router();

// POST /item-like/:id
router.post('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        await addItemLikeUseCase({ itemId, userId });

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
        await deleteItemLikeUseCase({ itemId, userId });

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
        const isGood = await itemLikeStatusUseCase({ itemId, userId });

        res.status(200).json({ isGood });
    } catch (err) {
        next(err);
    }
});

// GET /item-like/:id/count
router.get('/:id/count', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    try {
        const count = await itemLikeCountUseCase({ itemId });

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
        const userList = await getItemLikeUserListUseCase({ itemId, userId, keyword });

        res.status(200).json({ userList });
    } catch (err) {
        next(err);
    }
});

export default router;