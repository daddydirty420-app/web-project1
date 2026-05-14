import sequelize from "../../../../db.js";
import type { ItemAttributes } from "../../../../types/itemAttributes.js";
import { copyS3Object, getFileName } from "../../../../utils/s3/index.js";
import { getItemWithVideoSaleShipping } from "../../../../services/items/index.js";
import { AppError } from "../../../../errors.js";
import { createItemCopyUpload } from "../../../../services/items/index.js";
import { createVideoCopyUpload } from "../../../../services/video.js";
import { createSaleCopyUpload } from "../../../../services/sale.js";
import { createShippingCopyUpload } from "../../../../services/itemShippingProfile.js";

type Params = {
    itemId: number;
    userId: number;
};

type ColorVariant = NonNullable<ItemAttributes["colorVariants"]>[number];
type ColorVariantSize = NonNullable<ColorVariant["sizes"]>[number];

// POST /items/:id/copy-upload
// summary: 商品コピーアップロード
// page: /item/[id]
export const itemCopyUploadUseCase = async ({ itemId, userId }: Params) => {
    // item取得
    const item = await getItemWithVideoSaleShipping({ itemId });

    if (!item) throw new AppError("ITEM_NOT_FOUND", 404);
    if (!item.Video) throw new AppError("VIDEO_NOT_FOUND", 404);
    if (!item.Sale) throw new AppError("SALE_NOT_FOUND", 404);
    if (!item.ItemShippingProfile) throw new AppError("SHIPPING_NOT_FOUND", 404);

    // dbバリデーション
    const videoOriginalUrl = item.Video?.original_url ?? null;
    const videoConvertedUrl = item.Video?.converted_url ?? null;
    if (!videoOriginalUrl && !videoConvertedUrl) return;

    const thumbnailUrl = item.Video?.thumbnail_url ?? null;
    const itemImageUrl: string[] = item.image_url ?? [];
    if (!thumbnailUrl || !itemImageUrl.length) return;

    // ファイル名取得
    const videoOriginalFileName = videoOriginalUrl ? getFileName({ url: videoOriginalUrl }) : null;
    const videoConvertedFileName = videoConvertedUrl ? getFileName({ url: videoConvertedUrl }) : null;
    const thumbnailFileName = thumbnailUrl ? getFileName({ url: thumbnailUrl }) : null;
    const itemImageFileName = itemImageUrl.map((url) => getFileName({ url }));

    const now = Date.now();

    // データ作成
    let newItemId = null;

    // コピーしたファイルのurl取得
    const newUrls: {
        videoOriginalUrl?: string;
        videoConvertedUrl?: string;
        thumbnailUrl?: string;
        itemImageUrl?: string[];
    } = {};

    if (videoOriginalUrl) {
        const destKey = `video/original/${userId}/${now}/${videoOriginalFileName}`;
        newUrls.videoOriginalUrl = await copyS3Object({ sourceUrl: videoOriginalUrl, destKey });
    }

    if (videoConvertedUrl) {
        const destKey = `video/converted/${userId}/${now}/${videoConvertedFileName}`;
        newUrls.videoConvertedUrl = await copyS3Object({ sourceUrl: videoConvertedUrl, destKey });
    }

    if (thumbnailUrl) {
        const destKey = `thumbnail/${userId}/${now}/${thumbnailFileName}`;
        newUrls.thumbnailUrl = await copyS3Object({ sourceUrl: thumbnailUrl, destKey });
    }

    if (itemImageUrl.length > 0) {
        newUrls.itemImageUrl = await Promise.all(
            itemImageUrl.map(async (url, idx) => {
                const fileName = itemImageFileName[idx];
                const destKey = `item-image/${userId}/${now}/${fileName}`;
                return await copyS3Object({ sourceUrl: url, destKey });
            }),
        );
    }

    const attributes: ItemAttributes = {
        ...item.attributes,
        inventory: {
            ...item.attributes?.inventory,
            current: item.attributes?.inventory?.initial ?? 0,
        },
        colorVariants: item.attributes?.colorVariants?.map((v: ColorVariant) => ({
            ...v,
            inventory: {
                ...v.inventory,
                current: v.inventory?.initial ?? 0,
            },
            // sizesのinventoryもリセットする場合
            sizes: v.sizes?.map((s: ColorVariantSize) => ({
                ...s,
                inventory: {
                    ...s.inventory,
                    current: s.inventory?.initial ?? 0,
                },
            })),
        })),
    };

    const newItemImageUrls = newUrls.itemImageUrl;
    const newItemImageFirst = Array.isArray(newUrls.itemImageUrl) ? newUrls.itemImageUrl[0] : null;
    if (!newItemImageFirst || !newItemImageUrls || newItemImageUrls.length === 0) {
        throw new AppError("NEW_ITEM_IMAGE_NOT_FOUND", 404);
    }

    const newThumbnailUrl = newUrls.thumbnailUrl;
    const newOriginalUrl = newUrls.videoOriginalUrl || null;
    const newConvertUrl = newUrls.videoConvertedUrl || null;
    if (!newThumbnailUrl) {
        throw new AppError("NEW_THUMBNAIL_URL_NOT_FOUND", 404);
    }
    if (!newOriginalUrl && !newConvertUrl) {
        throw new AppError("NEW_VIDEO_URL_NOT_FOUND", 404);
    }

    await sequelize.transaction(async (t) => {
        const newItem = await createItemCopyUpload({
            data: {
                name: item.name,
                detail: item.detail,
                price: item.Sale.before_price,
                item_condition_id: item.item_condition_id,
                seller_id: userId,
                search_text: item.search_text,
                image_url: newItemImageUrls,
                first_image_url: newItemImageFirst,
                gender_type: item.gender_type,
                age_type: item.age_type,
                category_id: item.category_id,
                brand_id: item.brand_id,
                attributes: attributes ?? {},
            },
            transaction: t,
        });

        newItemId = newItem.id;

        await createVideoCopyUpload({
            data: {
                title: item.Video.title,
                summary: item.Video.summary,
                duration: item.Video.duration,
                user_id: userId,
                item_id: newItem.id,
                status: item.Video.status,
                thumbnail_url: newThumbnailUrl,
                original_url: newOriginalUrl,
                converted_url: newConvertUrl,
            },
            transaction: t,
        });

        await createSaleCopyUpload({
            data: {
                before_price: newItem.price,
                item_id: newItemId,
            },
            transaction: t,
        });

        await createShippingCopyUpload({
            data: {
                shipping_day_id: item.ItemShippingProfile.shipping_day_id,
                shipping_service_id: item.ItemShippingProfile.shipping_service_id,
                shipping_place_id: item.ItemShippingProfile.shipping_place_id,
                item_id: newItemId,
            },
            transaction: t,
        });
    });

    if (!newItemId || isNaN(newItemId)) {
        throw new AppError("NEW_ITEM_ID_INVALID", 400);
    }

    return newItemId;
};
