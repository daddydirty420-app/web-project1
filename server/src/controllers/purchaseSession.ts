import type { NextFunction, Request, Response } from "express-serve-static-core";

import { postPurchaseSessionUseCase } from "../usecases/purchaseSession/post.js";

// POST /purchase-session/:id
// summary: 購入セッションデータ作成
// page: /item
export const purchaseSessionPostByItemIdController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const userId = req.user!.id;
        const itemId = Number(req.params.id);

        const purchaseSessionId = await postPurchaseSessionUseCase({ itemId, userId });

        res.status(200).json({ purchaseSessionId });
    } catch (err) {
        next(err);
    }
};
