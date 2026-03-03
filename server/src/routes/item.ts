import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { Item, ItemDeleteLogs } from "../models/index.js";
import sequelize from "../db.js";

const router = Router();

router.post('/delete-all', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;

    const items = await Item.findAll({
        where: {
            seller_id: userId,
            status: "deleted",
        },
    });
    if (!items || items.length === 0) {
        res.status(404).json({ message: "削除する商品データが見つかりません。" });
        return;
    }

    const t = await sequelize.transaction();

    try {
        const newItemDeleteLogs = [];
        for (const item of items) {
            newItemDeleteLogs.push({
                item_id: item.id,
                delete_user_id: item.seller_id,
                delete_by_admin: false,
                delete_reason: "自主削除",
            });

            await item.destroy({ transaction: t });
        }

        await ItemDeleteLogs.bulkCreate(newItemDeleteLogs, { transaction: t });

        await t.commit();
        res.status(200).json({ message: "商品削除が完了しました。" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.delete("/draft/delete/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const itemId = Number(req.params.id);
    const userId = Number(req.user!.id);

    try {
        const item = await Item.findByPk(itemId);

        if (!item) {
            res.status(404).json({ message: "商品が見つかりません" });
            return;
        }

        if (item.seller_id !== userId || item.status !== "draft") {
            res.status(400).json({ message: "不正なアクセスが検出されました" });
            return;
        }

        await item.destroy();

        res.status(200).json({ message: "下書き商品を削除しました" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "サーバーエラーが発生しました" });
    }
});

router.get('/upload-ok/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;

    try {
        const item = await Item.findByPk(itemId, {
            attributes: ['id', 'name', 'price', "attributes", 'first_image_url', "gender_type", "age_type", "seller_id", "status"],
        });

        if (!item) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        res.status(200).json({ item });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;