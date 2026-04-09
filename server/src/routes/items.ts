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
import { Body } from "../types/serviceType/items/uploadBody.js";
import { patchPublishUseCase } from "../usecases/item/publish/publish.js";
import { getItemPageUseCase } from "../usecases/item/itemPage/itemPage.js";
import { getMetadataUseCase } from "../usecases/item/itemPage/metadata.js";
import { patchSortNumberAddUseCase } from "../usecases/item/sortNumber/sortNumber.js";
import { patchItemLogsAccessUseCase } from "../usecases/item/logs/accessLogs.js";
import { deleteItemLogicallyUseCase } from "../usecases/item/delete/logicalDelete.js";
import { deleteItemPerfectUseCase } from "../usecases/item/delete/perfectDelete.js";
import { restoreItemUseCase } from "../usecases/item/restore/restore.js";
import { deleteDraftItemUseCase } from "../usecases/item/delete/draftDelete.js";
import { FormDataMode, ItemPageMode, UploadMode } from "../types/serviceType/items/items.js";
import { getFormDataUseCase } from "../usecases/item/formData/getFormData.js";
import { uploadMainUseCase } from "../usecases/item/upload/uploadMain.js";
import { uploadDraftUseCase } from "../usecases/item/upload/uploadDraft.js";
import { getItemHighlightUseCase } from "../usecases/item/highlight/getItemHighlight.js";
import { itemCopyUploadUseCase } from "../usecases/item/copyUpload/copyUpload.js";

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
    
    const userId = req.user!.id;

    try {
        const newItemId = await itemCopyUploadUseCase({ itemId, userId });

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

    const usecase = mode === "main"
    ? uploadMainUseCase
    : uploadDraftUseCase;

    try {
        const {
            videoSignedUrl,
            thumbnailSignedUrl,
            itemImageSignedUrls,
            attributesImageSignedUrls
        } = await usecase({
            itemId,
            userId,
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
        await patchPublishUseCase({ itemId, userId });

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

    patchItemLogsAccessUseCase({ itemId, userId }).catch((err) => {
        console.error(err);
    });

    res.status(202).json({ message: '商品ページアクセス処理を受け付けました' });
});

// PATCH /items/:id/restore
router.patch("/:id/restore", authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        await restoreItemUseCase({ userId, itemId });

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
        await deleteItemLogicallyUseCase({ itemId, userId });

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
        await deleteItemPerfectUseCase({ itemId, userId });

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
        await deleteDraftItemUseCase({ itemId, userId });

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
        } = await getItemPageUseCase({ itemId, userId, mode });

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
        const item = await getMetadataUseCase({ itemId });

        res.status(200).json({ item });
    } catch (err) {
        next(err);
    }
});

// GET /items/:id/form-data
router.get("/:id/form-data", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = parseInt(req.params.id);

    try {
        const {
            item,
            category,
            allCondition,
            allDay,
            allService,
            allPlace,
            hasShop
        } = await getFormDataUseCase({ itemId });

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
        const item = await getItemHighlightUseCase({ itemId });

        res.status(200).json({ item });
    } catch (err) {
        next(err);
    }
});

export default router;