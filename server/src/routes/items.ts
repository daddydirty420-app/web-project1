import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { authenticateOptional, authenticateToken } from "../middleware/index.js";
import { Body } from "../types/serviceType/items/uploadBody.js";
import { ItemListType, ItemListView, ItemPageMode, RecommendItemsview, UploadMode } from "../types/usecaseType.js";
import { deleteDraftItemUseCase } from "../usecases/items/delete/draftDelete.js";
import { deleteItemLogicallyUseCase } from "../usecases/items/delete/logicalDelete.js";
import { deleteItemPerfectUseCase } from "../usecases/items/delete/perfectDelete.js";
import { getFormDataUseCase } from "../usecases/items/formData/getFormData.js";
import { getItemHighlightUseCase } from "../usecases/items/highlight/getItemHighlight.js";
import { getIndexItemsUseCase } from "../usecases/items/itemList/indexItemList.js";
import { getIndexVideosUseCase } from "../usecases/items/itemList/indexVideoList.js";
import { getProfileItemsUseCase } from "../usecases/items/itemList/profileItemList.js";
import { getProfileVideosUseCase } from "../usecases/items/itemList/profileVideoList.js";
import { getCartRecommendUseCase } from "../usecases/items/itemList/recommend/cartRecommend.js";
import { getIndexRecommendUseCase } from "../usecases/items/itemList/recommend/indexRecommend.js";
import { getItemPageRecommendUseCase } from "../usecases/items/itemList/recommend/itemPageRecommend.js";
import { getItemPageUseCase } from "../usecases/items/itemPage/itemPage.js";
import { getMetadataUseCase } from "../usecases/items/itemPage/metadata.js";
import { patchItemLogsAccessUseCase } from "../usecases/items/logs/accessLogs.js";
import { restoreItemUseCase } from "../usecases/items/restore/restore.js";
import { patchSortNumberAddUseCase, patchSortNumberDecreaseUseCase } from "../usecases/items/sortNumber/sortNumber.js";
import { itemCopyUploadUseCase } from "../usecases/items/upload/copyUpload/copyUpload.js";
import { createItemsUseCase } from "../usecases/items/upload/createItem.js";
import { patchPublishUseCase } from "../usecases/items/upload/publish.js";
import { uploadDraftUseCase } from "../usecases/items/upload/uploadDraft.js";
import { uploadMainUseCase } from "../usecases/items/upload/uploadMain.js";

const router = Router();

// POST /items
router.post("/", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;

    try {
        const itemId = await createItemsUseCase({ userId });

        res.status(200).json({ itemId });
    } catch (err) {
        next(err);
    }
});

// POST /items/:id/copy-upload
router.post(
    "/:id/copy-upload",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);

        const userId = req.user!.id;

        try {
            const newItemId = await itemCopyUploadUseCase({ itemId, userId });

            res.status(200).json({ newItemId });
        } catch (err) {
            next(err);
        }
    },
);

// PUT /items/:id?mode=""
router.put("/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = parseInt(req.params.id);
    const userId = req.user!.id;

    const mode = req.query.mode as UploadMode;
    if (mode !== "main" && mode !== "draft") {
        throw new AppError("INVALID_TYPE", 400);
    }

    const body = req.body as Body;

    const usecase = mode === "main" ? uploadMainUseCase : uploadDraftUseCase;

    try {
        const { videoSignedUrl, thumbnailSignedUrl, itemImageSignedUrls, attributesImageSignedUrls } = await usecase({
            itemId,
            userId,
            body,
        });

        res.status(200).json({
            videoSignedUrl,
            thumbnailSignedUrl,
            itemImageSignedUrls,
            attributesImageSignedUrls,
        });
    } catch (err) {
        next(err);
    }
});

// PATCH /items/:id/publish
router.patch(
    "/:id/publish",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);
        const userId = req.user!.id;

        try {
            await patchPublishUseCase({ itemId, userId });

            res.status(200).json({ message: "出品成功！" });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /items/:id/sort-number/add?number=number
router.patch("/:id/sort-number/add", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

// PATCH /items/:id/sort-number/decrease?number=number
router.patch("/:id/sort-number/decrease", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const number = Number(req.query.number);

    if (!number || isNaN(number)) {
        throw new AppError("INVALID_NUMBER", 400);
    }

    patchSortNumberDecreaseUseCase({ itemId, number }).catch((err) => {
        console.error(err);
    });

    res.status(202).json({ message: "sort_numberの更新を受け付けました" });
});

// PATCH /items/:id/logs/access
router.patch(
    "/:id/logs/access",
    authenticateOptional,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);

        const userId = req.user?.id ?? null;

        patchItemLogsAccessUseCase({ itemId, userId }).catch((err) => {
            console.error(err);
        });

        res.status(202).json({ message: "商品ページアクセス処理を受け付けました" });
    },
);

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
router.delete(
    "/:id/perfect",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);

        const userId = req.user!.id;

        try {
            await deleteItemPerfectUseCase({ itemId, userId });

            res.status(200).json({ message: "商品削除が完了しました。" });
        } catch (err) {
            next(err);
        }
    },
);

// DELETE /items/:id/draft
router.delete(
    "/:id/draft",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);

        const userId = req.user!.id;

        try {
            await deleteDraftItemUseCase({ itemId, userId });

            res.status(200).json({ message: "下書き商品を削除しました" });
        } catch (err) {
            next(err);
        }
    },
);

// GET /items?type=""&page=number&view=""&limit=number(&pageUserId=${id})
router.get("/", authenticateOptional, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?.id ?? null;

    const type = req.query.type as ItemListType;

    if (type !== "video" && type !== "item") {
        throw new AppError("INVALID_TYPE", 400);
    }

    const page = parseInt(req.query.page as string) || 1;

    const view = req.query.view as ItemListView;

    const limit = parseInt(req.query.limit as string) || 6;

    const pageUserId = parseInt(req.query.pageUserId as string) || undefined;

    if (view === "profile" && !pageUserId) {
        throw new AppError("PAGE_USER_NOT_FOUND", 404);
    }

    const baseParams = { page, limit };

    // usecaseマップ（アロー関数で包む）
    const usecaseMap: Record<ItemListView, Record<ItemListType, () => Promise<any>>> = {
        index: {
            video: () => getIndexVideosUseCase({ ...baseParams, userId }),
            item: () => getIndexItemsUseCase({ ...baseParams, userId }),
        },
        profile: {
            video: () => getProfileVideosUseCase({ ...baseParams, pageUserId: pageUserId }),
            item: () => getProfileItemsUseCase({ ...baseParams, pageUserId: pageUserId }),
        },
    };

    const usecase = usecaseMap[view]?.[type];

    if (!usecase) {
        throw new AppError("INVALID_VIEW_OR_TYPE", 400);
    }

    try {
        const { items, totalPages } = await usecase();

        res.status(200).json({ items, totalPages });
    } catch (err) {
        next(err);
    }
});

// GET /items/recommend?view=""(&itemId=number)
router.get(
    "/recommend",
    authenticateOptional,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user?.id ?? null;

        const view = req.query.view as RecommendItemsview;

        const itemId = parseInt(req.query.itemId as string) || undefined;

        // 関数そのものを保存（実行しない）
        const usecaseMap: Record<RecommendItemsview, () => Promise<any>> = {
            recommend: () => getIndexRecommendUseCase({ userId }),
            cart: () => getCartRecommendUseCase({ userId }),
            itemPage: () => getItemPageRecommendUseCase({ userId, itemId }),
        };

        const usecase = usecaseMap[view];

        if (!usecase) {
            throw new AppError("INVALID_VIEW", 400);
        }

        try {
            const items = await usecase();

            res.status(200).json({ items });
        } catch (err) {
            next(err);
        }
    },
);

// GET /items/:id?mode=""
router.get("/:id", authenticateOptional, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);
    const userId = req.user?.id ?? null;

    const mode = req.query.mode as ItemPageMode;

    try {
        const { item, sellerMe, likeCount, isLikeByMe, commentCount, me } = await getItemPageUseCase({
            itemId,
            userId,
            mode,
        });

        res.status(200).json({
            item,
            sellerMe,
            likeCount,
            isLikeByMe,
            commentCount,
            me,
        });
    } catch (err) {
        next(err);
    }
});

// GET /items/:id/metadata
router.get("/:id/metadata", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    try {
        const item = await getMetadataUseCase({ itemId });

        res.status(200).json({ item });
    } catch (err) {
        next(err);
    }
});

// GET /items/:id/form-data
router.get(
    "/:id/form-data",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = parseInt(req.params.id);

        try {
            const { item, category, allCondition, allDay, allService, allPlace, hasShop } = await getFormDataUseCase({
                itemId,
            });

            res.status(200).json({
                item,
                category,
                allCondition,
                hasShop,
                allDay,
                allService,
                allPlace,
            });
        } catch (err) {
            next(err);
        }
    },
);

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
