import { Router } from "express";
import { referenceCodePostOutputController } from "../controllers/reference_code.js";
import { authenticateToken } from "../middleware/index.js";
import { outputReferenceCodeRateLimit } from "../middleware/rateLimit/referenceCodeRateLimit.js";

const router = Router();

// POST /reference-code/output
// summary: 紹介コード生成
// page: /my-page
router.post(
    "/output",
    authenticateToken,
    outputReferenceCodeRateLimit,
    referenceCodePostOutputController,
);

export default router;
