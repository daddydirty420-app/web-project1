import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import sequelize from "../db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { SuggestWords } from "../models/index.js";
import { getSearchHistoryUseCase } from "../usecases/search/getSearchHistory.js";
import { normalizeJapanese } from "../utils/normalizeJapanese.js";

const router = Router();

// GET /search/history
// summary: 検索履歴取得
// page: header
router.get("/history", authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;

    try {
        const sortedData = await getSearchHistoryUseCase({ userId });

        res.status(200).json({ sortedData });
    } catch (err) {
        next(err);
    }
});

router.get("/suggest", async (req: Request, res: Response): Promise<void> => {
    const keyword = normalizeJapanese((req.query.keyword ?? "") as string);

    if (!keyword) {
        res.status(200).json({ suggest: [] });
        return;
    }

    try {
        const words = await SuggestWords.findAll({
            attributes: ["word"],
            where: {
                normalized_word: {
                    [Op.iLike]: `%${keyword}%`,
                },
            },
            order: [
                [
                    sequelize.literal(`
                        CASE
                        WHEN normalized_word ILIKE '${keyword}%' THEN 1
                        WHEN normalized_word ILIKE '% ${keyword}%' THEN 2
                        ELSE 3
                        END
                    `),
                    "ASC",
                ],
                [sequelize.fn("length", sequelize.col("word")), "ASC"],
            ],
            limit: 10,
        });

        res.status(200).json({
            suggest: words.map((w: typeof SuggestWords) => w.word),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ suggest: [] });
    }
});

export default router;
