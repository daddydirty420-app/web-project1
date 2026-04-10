import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { deleteWatchHistoryUseCase } from "../usecases/watchHistory/delete.js";

const router = Router();

// DELETE /watch-history/:id
router.delete("/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        await deleteWatchHistoryUseCase({ itemId, userId });

        res.status(200).json({ message: "閲覧履歴を削除しました" });
    } catch (err) {
        next(err);
    }
});

export default router;