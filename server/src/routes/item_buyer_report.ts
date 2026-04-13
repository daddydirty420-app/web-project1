import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { ItemBuyerReportOption } from "../models/index.js";

const router = Router();

router.get('/all-options', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const options = await ItemBuyerReportOption.findAll();
        res.status(200).json({ options });
    } catch (err) {
        next(err);
    }
});

export default router;