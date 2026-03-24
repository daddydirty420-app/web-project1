import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateOptional, authenticateToken } from "../middleware/index.js";
import { ItemListView } from "../services/item/openItems/items.config.js";
import { getOpenItems } from "../services/item/openItems/items.service.js";
import { RecommendItemsview } from "../services/item/recommend/items.config.js";
import { getRecommendItems } from "../services/item/recommend/items.service.js";
import sequelize from "../db.js";
import { Item, ItemShippingProfile, Sale, Video } from "../models/index.js";
import { AppError } from "../errors.js";
import { getFormData } from "../services/item/formData/items.service.js";
import { FormDataMode } from "../services/item/formData/items.service.js";
import { PutItem, UploadMode } from "../services/item/upload/putItem.service.js";
import { Body } from "../types/items/uploadBody.js";
import { patchPublish } from "../services/item/publish/patchItems.service.js";

const router = Router();

// POST /items
router.post("/", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;

    const t = await sequelize.transaction();

    try {
        const item = await Item.create({
            seller_id: userId,
        }, { transaction: t });

        const itemId = item.id;

        await Video.create({
            user_id: userId,
            item_id: itemId,
        }, { transaction: t });

        await Sale.create({
            item_id: itemId,
        }, { transaction: t });
        
        await ItemShippingProfile.create({
            item_id: itemId,
        }, { transaction: t });

        await t.commit();

        res.status(200).json({ itemId });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

// PUT /items/:id?mode=""
router.put("/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const itemId = parseInt(req.params.id);
    const userId = req.user!.id;

    const mode = req.query.mode as UploadMode;
    if (mode !== "main" && mode !== "draft") {
        throw new AppError("INVALID_TYPE", 400);
    }

    const body = req.body as Body;

    try {
        const {
            videoSignedUrl,
            thumbnailSignedUrl,
            itemImageSignedUrls,
            attributesImageSignedUrls
        } = await PutItem({
            itemId,
            userId,
            mode,
            body
        });

        res.status(200).json({
            videoSignedUrl,
            thumbnailSignedUrl,
            itemImageSignedUrls,
            attributesImageSignedUrls
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// PATCH /items/:id/publish
router.patch("/:id/publish", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const itemId = Number(req.params.id);
    const userId = req.user!.id;

    try {
        await patchPublish({ itemId, userId });

        res.status(200).json({ message: "出品成功！" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// GET /items?type=""&page=number&view=""&limit=number(&pageUserId=${id})
router.get("/", authenticateOptional, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id ?? null;

    const type = req.query.type;

    if (type !== "video" && type !== "item") {
        throw new AppError("INVALID_TYPE", 400);
    }

    const page = parseInt(req.query.page as string) || 1;

    const view = req.query.view as ItemListView;

    const limit = parseInt(req.query.limit as string) || 6;

    const pageUserId = parseInt(req.query.pageUserId as string) || undefined;

    try {
        const { items, totalPages } = await getOpenItems({
            userId,
            type,
            page,
            view,
            limit,
            pageUserId,
        });

        res.status(200).json({ items, totalPages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// GET /items/recommend?view=""(&itemId=number)
router.get("/recommend", authenticateOptional, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id ?? null;

    const view = req.query.view as RecommendItemsview;

    const itemId = parseInt(req.query.itemId as string) || undefined;

    try {
        const items = await getRecommendItems({
            userId,
            view,
            itemId,
        });

        res.status(200).json({ items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

// GET /items/:id/form-data?mode=""
router.get("/:id/form-data", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const itemId = parseInt(req.params.id);

    const mode = req.query.mode as FormDataMode;
    if (!["normal", "edit", "draft"].includes(String(mode))) {
        throw new AppError("INVALID_PAGE", 400);
    }

    try {
        const {
            item,
            category,
            allCondition,
            allDay,
            allService,
            allPlace,
            hasShop
        } = await getFormData({
            itemId,
            mode
        });

        res.status(200).json({
            item,
            category,
            allCondition,
            hasShop,
            allDay,
            allService,
            allPlace
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

export default router;