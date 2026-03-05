import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { Item, ItemDeleteLogs } from "../models/index.js";
import sequelize from "../db.js";

const router = Router();

router.post("/item-copy/:id", async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;

    try {
        if (!itemId) {
            throw new Error("NOT_FOUND");
        }

        const item = await Item.findByPk(itemId);

        if (!itemId) {
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

export default router;