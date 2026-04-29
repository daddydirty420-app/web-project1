import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateOptional, authenticateToken } from "../middleware/index.js";
import { convertVideoUseCase } from "../usecases/video/convert.js";
import { onPlayVideoUseCase } from "../usecases/video/onPlay.js";

const router = Router();

// PATCH /video/:id/onplay
// summary: 動画再生ログ更新
// page: /item
router.patch(
    "/:id/onplay",
    authenticateOptional,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const videoId = Number(req.params.id);

        const userId = req.user?.id ?? null;

        onPlayVideoUseCase({ videoId, userId }).catch((err) => {
            console.error(err);
        });

        res.status(200).json({ message: "再生回数追加成功！" });
    },
);

// PATCH /video/:id/convert
// summary: 動画HLS変換
// page: /upload
router.patch(
    "/:id/convert",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const videoId = Number(req.params.id);

        const userId = req.user!.id;

        convertVideoUseCase({ videoId, userId }).catch((err) => {
            console.error(err);
        });

        res.status(202).json({ message: "変換処理を受け付けました" });
    },
);

export default router;
