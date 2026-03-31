import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { normalizeJapanese } from "../utils/normalizeJapanese.js";
import { getBrandsSuggest } from "../services/brands/getBrandsSuggest.js";

const router = Router();

// GET /brands/suggest?keyword=""
router.get("/suggest", async (req: Request, res: Response): Promise<void> => {
    const keyword = normalizeJapanese((req.query.keyword ?? "") as string);

    if (!keyword) {
        res.status(200).json({ suggest: [] });
        return;
    }
    
    try {
        const brands = await getBrandsSuggest({ keyword });

        res.status(200).json({ brands });
    } catch (err) {
        console.error(err);
        res.status(500).json({ suggest: [] });
    }
});

export default router;