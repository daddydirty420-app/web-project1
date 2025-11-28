import { Router, Request, Response } from "express";
import { Item, Search, SuggestWords, User } from "../models/index.js";
import { authenticateToken } from "middleware/authMiddleware.js";
import { Sequelize } from "sequelize";
import { Op } from "sequelize";

const router = Router();

router.get("/history", authenticateToken, async (req: Request, res: Response) => {
    const userId = req.user!.id;

    try {
        const searchHistory = await Search.findAll({
            attributes: [Sequelize.literal(
                'DISTINCT ON ("search_text") "search_text"'), 
                "createdAt",
            ],
            where: { user_id: userId },
            order: [
                ["search_text", "ASC"],
                ["createdAt", "DESC"],
            ],
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
    const keyword = req.query.keyword as string;

    if (!keyword) {
        res.status(200).json({ suggest: [] });
        return;
    }

    try {
        const words = await SuggestWords.findAll({
            attributes: ["word"],
            where: {
                word: {
                    [Op.iLike]: `%${keyword}%`,
                },
            },
            group: ["word"],
            limit: 10,
        });

        res.status(200).json({
            suggest: words.map((w: any) => w.word),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ suggest: [] });
    }
});

export default router;