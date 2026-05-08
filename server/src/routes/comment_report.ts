import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { validateBody } from "../middleware/validateBody.js";
import { validateParams } from "../middleware/validateParams.js";
import { getAllCommentReportOptions } from "../services/commentReport.js";
import { createCommentReportUseCase } from "../usecases/commentReport/create.js";
import { OptionIdBody, optionIdBodySchema } from "../validators/body/report.js";
import { idParamSchema } from "../validators/params/id.js";

const router = Router();

// POST /comment-report/:id
// summary: comment報告作成
// page: /report/comment/[id]
router.post(
    "/:id",
    validateParams(idParamSchema),
    validateBody(optionIdBodySchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const commentId = Number(req.params.id);
        const userId = req.user!.id;

        const body = req.validatedBody as OptionIdBody;
        const optionId = body.optionId;

        try {
            await createCommentReportUseCase({ commentId, userId, optionId });

            res.status(200).json({ message: "報告を作成しました" });
        } catch (err) {
            next(err);
        }
    },
);

// GET /comment-report/all-options
// summary: CommentReportOptions取得
// page: /report/comment/[id]
router.get("/all-options", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const options = await getAllCommentReportOptions();

        res.status(200).json({ options });
    } catch (err) {
        next(err);
    }
});

export default router;
