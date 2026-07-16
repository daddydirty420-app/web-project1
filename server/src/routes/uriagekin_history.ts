import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";

const router = Router();

// GET /points-history?limit=number(&cursor="")
// summary: ポイント履歴取得
// page: /history/points
router

export default router;
