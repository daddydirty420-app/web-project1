import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { GoodItem, Item, ItemDeleteLogs } from "../models/index.js";
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

router.patch("/status-active", async (req: Request, res: Response): Promise<void> => {
    const t = await sequelize.transaction();
    try {
        const items = await Item.findAll({
            where: {
                id: { [Op.gt]: 40 }
            }
        });

        if (!items) {
            throw new Error("NOT_FOUND");
        }

        await Promise.all(items.map(async(item: typeof Item) => {
            await item.update({
                status: "active",
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

router.post("/good-create/:id", async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;

    const t = await sequelize.transaction();

    try {
        if (!userId) {
            throw new Error("NOT_FOUND");
        }

        const items = await Item.findAll({
            where: {
                id: { [Op.gt]: 40 }
            },
        });

        await Promise.all(items.map(async (item: typeof Item) => {
            await GoodItem.create({
                item_id: item.id,
                good_user_id: Number(userId)
            }, { transaction: t });
        }));

        await t.commit();

        res.status(200).json({ message: "good created" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ error: "FAILED" });
    }
});

export default router;