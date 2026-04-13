import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { getAllCommentReportOptions } from "../services/commentReport.js";
import { createCommentReportUseCase } from "../usecases/commentReport/create.js";

const router = Router();

// POST /comment-report/:id
router.post("/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const commentId = Number(req.params.id);
    const userId = req.user!.id;
    const optionId = Number(req.body.selected);

    if (Number.isNaN(commentId) || Number.isNaN(optionId)) {
        res.status(400).json({ message: "不正なidです" });
        return;
    }

    try {
        await createCommentReportUseCase({ commentId, userId, optionId });

        res.status(200).json({ message: "報告を作成しました" });
    } catch (err) {
        next(err);
    }
});

// GET /comment-report/all-options
router.get('/all-options', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const options = await getAllCommentReportOptions();

        res.status(200).json({ options });
    } catch (err) {
        next(err);
    }
});

export default router;