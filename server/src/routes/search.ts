import { Router, Request, Response } from "express";
import { Search, SuggestWords } from "../models/index.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { Sequelize } from "sequelize";
import { Op } from "sequelize";
import { normalizeJapanese } from "../utils/normalizeJapanese.js";
import sequelize from "../db.js";

const router = Router();

router.get("/history", authenticateToken, async (req: Request, res: Response) => {
    const userId = req.user!.id;

    try {
        const searchHistory = await Search.findAll({
            attributes: [
                [Sequelize.fn("MAX", Sequelize.col("createdAt")), "createdAt"],
                "search_text",
            ],
            where: {
                user_id: userId,
                search_text: {
                    [Op.ne]: "",
                    [Op.not]: null,
                },
            },
            group: ["search_text"],
            order: [[Sequelize.literal("MAX(\"createdAt\")"), "DESC"]],
        });

        const sortedData = searchHistory.sort(
            (a: any, b: any) => b.createdAt - a.createdAt
        );

        res.status(200).json({ sortedData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
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
            group: ["word"],
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