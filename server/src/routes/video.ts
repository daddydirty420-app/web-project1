import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateOptional, authenticateToken } from "../middleware/index.js";
import { onPlayVideoUseCase } from "../usecases/video/onPlay.js";
import { convertVideo } from "../services/video/convert.service.js";

const router = Router();

// PATCH /video/:id/onplay
router.patch('/:id/onplay', authenticateOptional, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const videoId = Number(req.params.id);

    const userId = req.user?.id ?? null;

    onPlayVideoUseCase({ videoId, userId }).catch((err) => {
        console.error(err);
    });

    res.status(200).json({ message: '再生回数追加成功！' });
});

// PATCH /video/:id/convert
router.patch("/:id/convert", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const videoId = Number(req.params.id);

    const userId = req.user!.id;

    convertVideo({ videoId, userId }).catch((err) => {
        console.error(err);
    });

    res.status(202).json({ message: "変換処理を受け付けました" });
});

export default router;