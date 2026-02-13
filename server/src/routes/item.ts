import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { Item, User, ItemConditionOption, Video, Delivery, ShippingDayOption, ShippingServiceOption, TodouhukenOption, RecommendMonth, ItemDeleteLogs } from "../models/index.js";
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

router.get('/upload-ok/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const currentUserId = req.user!.id;

        const item = await Item.findByPk(req.params.id, {
            attributes: ['id', 'name', 'price', "attributes", 'first_image_url'],
        });

        if (!item) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        const currentUserRecommend = await User.findOne({
            attributes: ['id'],
            where: { id: currentUserId },
            include: [
                {
                    model: RecommendMonth,
                    attributes: ['id'],
                },
            ],
        });

        res.json({
            item,
            currentUserRecommend
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;