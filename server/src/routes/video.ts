import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateOptional } from "../middleware/index.js";
import { onPlayVideo } from "../services/video/onPlay.service.js";

const router = Router();

// PATCH /video/:id/onplay
router.patch('/:id/onplay', authenticateOptional, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const videoId = Number(req.params.id);

    const userId = req.user?.id ?? null;

    try {
        await onPlayVideo({ videoId, userId });

        res.status(200).json({ message: '再生回数追加成功！' });
    } catch (err) {
        next(err);
    }
});

export default router;