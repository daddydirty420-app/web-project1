import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { authenticateOptional, authenticateToken } from "../middleware/index.js";
import {
    createItemCopyRateLimit,
    createItemRateLimit,
    draftDeleteItemRateLimit,
    editSortItemRateLimit,
    getItemHighlightRateLimit,
    getItemListRateLimit,
    getItemPageRateLimit,
    getItemRecommendRateLimit,
    getItemSearchRateLimit,
    getItemUploadFormDataRateLimit,
    logicalDeleteItemRateLimit,
    perfectDeleteItemRateLimit,
    restoreItemRateLimit,
    uploadItemRateLimit,
    uploadPublishItemRateLimit,
} from "../middleware/rateLimit/itemsRateLimit.js";
import { validateBody } from "../middleware/validate/validateBody.js";
import { validateParams } from "../middleware/validate/validateParams.js";
import { validateQuery } from "../middleware/validate/validateQuery.js";
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
import { patchItemLogsAccessUseCase } from "../usecases/items/log/accessLogs.js";
import { restoreItemUseCase } from "../usecases/items/restore/restore.js";
import { getSearchItemsUseCase } from "../usecases/items/search/getSearchItems.js";
import { patchSortNumberAddUseCase, patchSortNumberDecreaseUseCase } from "../usecases/items/sortNumber/sortNumber.js";
import { itemCopyUploadUseCase } from "../usecases/items/upload/copyUpload/copyUpload.js";
import { createItemsUseCase } from "../usecases/items/upload/createItem.js";
import { patchPublishUseCase } from "../usecases/items/upload/publish.js";
import { uploadDraftUseCase } from "../usecases/items/upload/uploadDraft.js";
import { uploadMainUseCase } from "../usecases/items/upload/uploadMain.js";
import { ItemUploadBody, itemUploadBodySchema } from "../validators/body/items.js";
import { idParamSchema } from "../validators/params/id.js";
import {
    getItemPageQuerySchema,
    ItemListQuery,
    itemListQuerySchema,
    ItemListType,
    ItemListView,
    ItemPageQuery,
    ItemSortNumberQuery,
    itemSortNumberQuerySchema,
    ItemUploadQuery,
    putItemUploadQuerySchema,
    RecommendItemsQuery,
    recommendItemsQuerySchema,
    RecommendItemsview,
    SearchItemsQuery,
    searchItemsQuerySchema,
} from "../validators/query/items.js";

const router = Router();

// POST /items
// summary: 商品データ作成
// page: /upload/before
router.post(
    "/",
    authenticateToken,
    createItemRateLimit,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const itemId = await createItemsUseCase({ userId });

            res.status(200).json({ itemId });
        } catch (err) {
            next(err);
        }
    },
);

// POST /items/:id/copy-upload
// summary: 商品コピーアップロード
// page: /item/[id]
router.post(
    "/:id/copy-upload",
    authenticateToken,
    createItemCopyRateLimit,
    validateParams(idParamSchema),
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
// summary: 商品アップロード
// page: /upload/[id]
router.put(
    "/:id",
    authenticateToken,
    uploadItemRateLimit,
    validateParams(idParamSchema),
    validateQuery(putItemUploadQuerySchema),
    validateBody(itemUploadBodySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = parseInt(req.params.id);
        const userId = req.user!.id;

        const query = req.validatedQuery as ItemUploadQuery;

        const mode = query.mode;

        const body = req.validatedBody as ItemUploadBody;

        const usecase = mode === "main" ? uploadMainUseCase : uploadDraftUseCase;

        try {
            const { videoSignedUrl, thumbnailSignedUrl, itemImageSignedUrls, attributesImageSignedUrls } =
                await usecase({
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
    },
);

// PATCH /items/:id/publish
// summary: 商品公開
// page: /item/confirm/[id]
router.patch(
    "/:id/publish",
    authenticateToken,
    uploadPublishItemRateLimit,
    validateParams(idParamSchema),
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
// summary: sortNumber追加
// page: /itemなど
router.patch(
    "/:id/sort-number/add",
    editSortItemRateLimit,
    validateParams(idParamSchema),
    validateQuery(itemSortNumberQuerySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);

        const query = req.validatedQuery as ItemSortNumberQuery;

        const number = query.number;

        patchSortNumberAddUseCase({ itemId, number }).catch((err) => {
            console.error(err);
        });

        res.status(202).json({ message: "sort_numberの更新を受け付けました" });
    },
);

// PATCH /items/:id/sort-number/decrease?number=number
// summary: sortNumber減少
// page: /itemなど
router.patch(
    "/:id/sort-number/decrease",
    editSortItemRateLimit,
    validateParams(idParamSchema),
    validateQuery(itemSortNumberQuerySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);

        const query = req.validatedQuery as ItemSortNumberQuery;

        const number = query.number;

        patchSortNumberDecreaseUseCase({ itemId, number }).catch((err) => {
            console.error(err);
        });

        res.status(202).json({ message: "sort_numberの更新を受け付けました" });
    },
);

// PATCH /items/:id/logs/access
// summary: アクセスログ記録
// page: /item/[id]
router.patch(
    "/:id/logs/access",
    authenticateOptional,
    validateParams(idParamSchema),
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
// summary: 商品データ復元
// page: /item/deleted/[id]
router.patch(
    "/:id/restore",
    authenticateToken,
    restoreItemRateLimit,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        const itemId = Number(req.params.id);

        const userId = req.user!.id;

        try {
            await restoreItemUseCase({ userId, itemId });

            res.status(200).json({ message: "商品を復元しました" });
        } catch (err) {
            next(err);
        }
    },
);

// DELETE /items/:id/logical
// summary: 商品論理削除
// page: /item/[id]
router.delete(
    "/:id/logical",
    authenticateToken,
    logicalDeleteItemRateLimit,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        const itemId = Number(req.params.id);

        const userId = req.user!.id;

        try {
            await deleteItemLogicallyUseCase({ itemId, userId });

            res.status(200).json({ message: "商品を削除しました" });
        } catch (err) {
            next(err);
        }
    },
);

// DELETE /items/:id/perfect
// summary: 商品完全削除
// page: /item/deleted/[id]
router.delete(
    "/:id/perfect",
    perfectDeleteItemRateLimit,
    authenticateToken,
    validateParams(idParamSchema),
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
// summary: 下書き商品削除
// page: /item/draft/[id]
router.delete(
    "/:id/draft",
    authenticateToken,
    draftDeleteItemRateLimit,
    validateParams(idParamSchema),
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
// summary: 商品リスト取得
// page: /lp・/profile
router.get(
    "/",
    getItemListRateLimit,
    authenticateOptional,
    validateQuery(itemListQuerySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user?.id ?? null;

        const query = req.validatedQuery as ItemListQuery;

        const type = query.type;
        const page = query.page ?? 1;
        const view = query.view;
        const limit = query.limit ?? 6;
        const pageUserId = query.pageUserId ?? undefined;

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
    },
);

// GET /items/recommend?view=""(&itemId=number)
// summary: レコメンドリスト取得
// page: /item・/item-list/cart・/など
router.get(
    "/recommend",
    getItemRecommendRateLimit,
    authenticateOptional,
    validateQuery(recommendItemsQuerySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user?.id ?? null;

        const query = req.validatedQuery as RecommendItemsQuery;

        const view = query.view;

        const itemId = query.itemId ?? undefined;

        if (view === "itemPage" && !itemId) {
            throw new AppError("INVALID_QUERY", 400);
        }

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

// GET /item/search?keyword=""&limit=number&sort=""(&cursorScore=number&cursorId=number)
// summary: キーワード検索
// page: /search?keyword=""
router.get(
    "/search",
    getItemSearchRateLimit,
    authenticateOptional,
    validateQuery(searchItemsQuerySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user?.id ?? undefined;

        const query = req.validatedQuery as SearchItemsQuery;

        const { keyword, limit, sort, cursorScore, cursorId } = query;

        try {
            const { itemList, nextCursorScore, nextCursorId, hasMore } = await getSearchItemsUseCase({
                keyword,
                limit,
                sort,
                cursorId,
                cursorScore,
                userId,
            });

            res.status(200).json({ itemList, nextCursorScore, nextCursorId, hasMore });
        } catch (err) {
            next(err);
        }
    },
);

// GET /items/:id?mode=""
// summary: 商品ページ データ取得
// page: /item
router.get(
    "/:id",
    getItemPageRateLimit,
    authenticateOptional,
    validateParams(idParamSchema),
    validateQuery(getItemPageQuerySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);
        const userId = req.user?.id ?? null;

        const query = req.validatedQuery as ItemPageQuery;

        const mode = query.mode;

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
    },
);

// GET /items/:id/metadata
// summary: 商品ページメタデータ
// page: /item
router.get(
    "/:id/metadata",
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);

        try {
            const item = await getMetadataUseCase({ itemId });

            res.status(200).json({ item });
        } catch (err) {
            next(err);
        }
    },
);

// GET /items/:id/form-data
// summary: アップロードフォーム表示データ取得
// page: /upload
router.get(
    "/:id/form-data",
    getItemUploadFormDataRateLimit,
    authenticateToken,
    validateParams(idParamSchema),
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
// summary: 商品データ簡易表示
// page: /upload/ok
router.get(
    "/:id/highlight",
    getItemHighlightRateLimit,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const itemId = Number(req.params.id);

        try {
            const item = await getItemHighlightUseCase({ itemId });

            res.status(200).json({ item });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
