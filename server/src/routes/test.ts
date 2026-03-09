import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { GoodItem, Item, ItemDeleteLogs, Sale, WatchHistory } from "../models/index.js";
import sequelize from "../db.js";
import { Op } from "sequelize";

const router = Router();

router.post("/item-copy/:id", async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;

    try {
        if (!itemId) {
            throw new Error("NOT_FOUND");
        }

        const item = await Item.findByPk(itemId);

        if (!item) {
            throw new Error("NOT_FOUND");
        }

        const itemData = item.get({ plain: true });

        delete itemData.id;
        delete itemData.createdAt;
        delete itemData.updatedAt;

        const copies = Array.from({ length: 100 }, () => ({
            ...itemData,
        }));

        await Item.bulkCreate(copies);

        res.status(201).json({ message: "100 items copied 🌱" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "COPY_FAILED" });
    }
});

router.patch("/status-sold", async (req: Request, res: Response): Promise<void> => {
    const t = await sequelize.transaction();
    try {
        const items = await Item.findAll({
            where: {
                id: { [Op.gt]: 50 }
            }
        });

        if (!items) {
            throw new Error("NOT_FOUND");
        }

        await Promise.all(items.map(async(item: typeof Item) => {
            await item.update({
                status: "soldout",
            }, { transaction: t });
        }));

        await t.commit();

        res.status(201).json({ message: "status changed" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ error: "COPY_FAILED" });
    }
});

router.post("/watch-create/:id", async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.params.id);

    const t = await sequelize.transaction();

    try {
        if (!Number.isInteger(userId) || userId <= 0) {
            throw new Error("INVALID_USER_ID");
        }

        const items = await Item.findAll({
            where: {
                id: { [Op.gt]: 40 }
            },
        });

        await WatchHistory.bulkCreate(
            items.map((item: any) => ({
                item_id: item.id,
                user_id: userId,
            })),
            { transaction: t }
        );

        await WatchHistory.destroy({
            where: {
                user_id: { [Op.is]: null }
            },
            transaction: t
        });

        await t.commit();

        res.status(200).json({ message: "history created" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ error: "FAILED" });
    }
});

router.post("/sale-create", async (req: Request, res: Response): Promise<void> => {
    const t = await sequelize.transaction();

    try {
        const items = await Item.findAll({
            where: {
                id: { [Op.gt]: 45 },
            },
        });

        if (!items) {
            throw new Error("NOT_FOUND");
        }

        for (const item of items) {
            await Sale.create({
                item_id: item.id,
                before_price: item.price,
                sale_flag: true,
                discount_rate: 10,
            }, { transaction: t });

            await item.update({
                price: item.price * 0.9,
            }, { transaction: t });
        }

        await t.commit();

        res.status(200).json({ message: "ok" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "サーバーエラー" });
    }
});

export default router;