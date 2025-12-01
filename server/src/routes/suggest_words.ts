import { Router, Request, Response } from "express";
import { Item, SuggestWords, User, Video } from "../models/index.js";
import { normalizeJapanese } from "../utils/normalizeJapanese.js";

const router = Router();

function generateNgrams(text: string): string[] {
    if (!text) return [];

    const normalized = text
    .trim()
    .replace(/[　・\-、,/._()\[\]\{\}]+/g, " ")
    .replace(/\s+/g, " ");

    const words = normalized.split(" ");

    const result: string[] = [];

    for (let i = 0; i < words.length; i++) {
        for (let j = i; j < words.length; j++) {
            result.push(words.slice(i, j + 1).join(" "));
        }
    }

    return result;
};

router.get("/dev/create", async (req: Request, res: Response): Promise<void> => {
    try {
        const items = await Item.findAll({
            where: { public: true },
            include: [
                { model: User, attributes: ["user_name"] },
                { model: Video, attributes: ["title"] },
            ],
        });

        let createdCount = 0;

        for (const item of items) {
            const collected: string[] = [];

            if (item.name) collected.push(...generateNgrams(item.name));
            if (item.category_text) collected.push(...generateNgrams(item.category_text));
            if (item.User?.user_name) collected.push(...generateNgrams(item.User.user_name));
            if (item.Video?.title) collected.push(...generateNgrams(item.Video.title));

            const uniqueWords = [...new Set(collected)];

            if (uniqueWords.length === 0) continue;

            const existing = await SuggestWords.findAll({
                where: { word: uniqueWords },
                attributes: ["word"],
            });

            const existingSet = new Set(existing.map((e: any) => e.word));

            const insertData = uniqueWords
                .filter(w => !existingSet.has(w))
                .map(w => ({ word: w }));

            if (insertData.length > 0) {
                await SuggestWords.bulkCreate(insertData);
                createdCount += insertData.length;
            }
        }

        res.status(200).json({
            message: "SuggestWords（辞書）作成完了！",
            count: createdCount,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get("/dev/normalize", async (req: Request, res: Response): Promise<void> => {
    try {
        const allWords = await SuggestWords.findAll({
            attributes: ["id", "word"],
        });

        const updatePromise = allWords.map((w: typeof SuggestWords) =>
            SuggestWords.update(
                { normalized_word: normalizeJapanese(w.word) },
                { where: { id: w.id }},
            )
        );

        await Promise.all(updatePromise);

        res.status(200).json({ message: "全件 normalized_word 更新完了！", count: allWords.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

export default router;