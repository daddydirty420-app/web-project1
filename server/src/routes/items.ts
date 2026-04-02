import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
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
import { getItemPage, ItemPageMode } from "../services/item/itemPage/itemPage.service.js";
import { getMetadata } from "../services/item/itemPage/metadata.service.js";
import { patchSortNumberAddUseCase } from "../usecases/item/sortNumber/sortNumber.js";
import { patchItemLogsAccess } from "../services/item/logs/accessLogs.service.js";
import itemCopyUpload from "../services/item/copyUpload/copyUpload.service.js";
import { deleteItemLogically } from "../services/item/delete/logicalDelete.service.js";
import { deleteItemPerfect } from "../services/item/delete/perfectDelete.service.js";
import { restoreItem } from "../services/item/restore/restore.service.js";
import { deleteDraftItem } from "../services/item/delete/draftDelete.js";
import { getItemHighlight } from "../services/item/getItemHighlight.service.js";

const router = Router();

// POST /items
router.post("/", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        next(err);
    }
});

// POST /items/:id/copy-upload
router.post('/:id/copy-upload', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);
    if (!itemId) {
        res.status(400).json({ message: "itemIdがありません。" });
        return;
    }
    const userId = req.user!.id;

    try {
        const newItemId = await itemCopyUpload({ itemId, userId });

        res.status(200).json({ newItemId });
    } catch (err) {
        next(err);
    }
});

// PUT /items/:id?mode=""
router.put("/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        next(err);
    }
});

// PATCH /items/:id/publish
router.patch("/:id/publish", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);
    const userId = req.user!.id;

    try {
        await patchPublish({ itemId, userId });

        res.status(200).json({ message: "出品成功！" });
    } catch (err) {
        next(err);
    }
});

// PATCH /items/:id/sort-number?number=number
router.patch("/:id/sort-number", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const number = Number(req.query.number);

    if (!number || isNaN(number)) {
        throw new AppError("INVALID_NUMBER", 400);
    }

    patchSortNumberAddUseCase({ itemId, number }).catch((err) => {
        console.error(err);
    });

    res.status(202).json({ message: "sort_numberの更新を受け付けました" });
});

// PATCH /items/:id/logs/access
router.patch("/:id/logs/access", authenticateOptional, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const userId = req.user?.id ?? null;

    patchItemLogsAccess({ itemId, userId }).catch((err) => {
        console.error(err);
    });

    res.status(202).json({ message: '商品ページアクセス処理を受け付けました' });
});

// PATCH /items/:id/restore
router.patch("/:id/restore", authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        await restoreItem({ userId, itemId });

        res.status(200).json({ message: "商品を復元しました" });
    } catch (err) {
        next(err);
    }
});

// DELETE /items/:id/logical
router.delete("/:id/logical", authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        await deleteItemLogically({ itemId, userId });

        res.status(200).json({ message: "商品を削除しました" });
    } catch (err) {
        next(err);
    }
});

// DELETE /items/:id/perfect
router.delete("/:id/perfect", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        await deleteItemPerfect({ itemId, userId });

        res.status(200).json({ message: "商品削除が完了しました。" });
    } catch (err) {
        next(err);
    }
});

// DELETE /items/:id/draft
router.delete("/:id/draft", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        await deleteDraftItem({ itemId, userId });

        res.status(200).json({ message: "下書き商品を削除しました" });
    } catch (err) {
        next(err);
    }
});

// GET /items?type=""&page=number&view=""&limit=number(&pageUserId=${id})
router.get("/", authenticateOptional, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        next(err);
    }
});

// GET /items/recommend?view=""(&itemId=number)
router.get("/recommend", authenticateOptional, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        next(err);
    }
});

// GET /items/:id?mode=""
router.get("/:id", authenticateOptional, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);
    const userId = req.user?.id ?? null;

    const mode = req.query.mode as ItemPageMode;

    try {
        const {
            item,
            sellerMe,
            likeCount,
            isLikeByMe,
            commentCount,
            me
        } = await getItemPage({ itemId, userId, mode });

        res.status(200).json({
            item,
            sellerMe,
            likeCount,
            isLikeByMe,
            commentCount,
            me
        });
    } catch (err) {
        next(err);
    }
});

// GET /items/:id/metadata
router.get('/:id/metadata', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    try {
        const item = await getMetadata({ itemId });

        res.status(200).json({ item });
    } catch (err) {
        next(err);
    }
});

// GET /items/:id/form-data?mode=""
router.get("/:id/form-data", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        next(err);
    }
});

// GET /items/:id/highlight
router.get("/:id/highlight", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    try {
        const item = await getItemHighlight({ itemId });

        res.status(200).json({ item });
    } catch (err) {
        next(err);
    }
});

export default router;