import { AppError } from '../../../errors.js';
import { getItemWithVideoSaleShipping } from '../../../services/items/index.js';
import { Body } from '../../../types/serviceType/items/uploadBody.js';
import sequelize from '../../../db.js';
import { updateVideo } from '../../../services/video.js';
import { updateSale } from '../../../services/sale.js';
import { updateShipping } from '../../../services/itemShippingProfile.js';
import { updateImage, updateItem } from '../../../services/items/command/update.js';
import { createNormalNotification } from '../../../services/notification.js';
import { buildSignedUrls } from './shared/buildSignedUrls.js';
import { validateNumber } from './shared/validateNumber.js';
import { validateMaster } from './shared/validateMaster.js';
import { resolveBrand } from './shared/resolveBrand.js';

type Params = {
    itemId: number;
    userId: number;
    body: Body;
};

export const uploadMainUseCase = async ({ itemId, userId, body }: Params) => {
    const { attributes, shipping, videoMeta, itemMeta, genderAge } = body;

    // Item取得
    const item = await getItemWithVideoSaleShipping({ itemId });

    if (!item) {
        throw new AppError('ITEM_NOT_FOUND', 404);
    }

    if (!item.Video) throw new AppError('VIDEO_NOT_FOUND', 404);
    if (!item.Sale) throw new AppError('SALE_NOT_FOUND', 404);
    if (!item.ItemShippingProfile) throw new AppError('SHIPPING_NOT_FOUND', 404);

    // 署名付きURL生成
    const {
        videoSignedUrl,
        videoUrl,
        thumbnailSignedUrl,
        thumbnailUrl,
        itemImageSignedUrls,
        finalImageUrls,
        attributesImageSignedUrls,
        finalAttributesImageUrls,
    } = await buildSignedUrls({ itemId, userId, item, body });

    if (!videoUrl) throw new AppError('VIDEOURL_NULL', 400);
    if (!thumbnailUrl) throw new AppError('THUMBNAIL_URL_NULL', 400);
    if (!finalImageUrls) throw new AppError('ITEMIMAGE_NULL', 400);

    // 数値チェック
    const { categoryId, conditionId, dayId, serviceId, placeId, brandId, priceNum } = await validateNumber({ body });

    // マスターテーブルチェック
    const categoryOption = await validateMaster({
        categoryId,
        conditionId,
        dayId,
        serviceId,
        placeId,
    });

    // ブランドチェック
    const brandResult = await resolveBrand({ brandId, body });

    // データ更新
    await sequelize.transaction(async (t) => {
        await updateVideo({
            video: item.Video,
            data: {
                title: videoMeta.title,
                summary: videoMeta.summary,
                original_url: videoUrl,
                thumbnail_url: thumbnailUrl,
            },
            transaction: t,
        });

        await updateSale({
            sale: item.Sale,
            data: { before_price: priceNum },
            transaction: t,
        });

        await updateShipping({
            shipping: item.ItemShippingProfile,
            data: {
                shipping_day_id: dayId,
                shipping_service_id: serviceId,
                shipping_place_id: placeId,
                shipping_service_free_text: shipping.freeText,
            },
            transaction: t,
        });

        await updateItem({
            item,
            data: {
                name: itemMeta.name,
                detail: itemMeta.detail,

                category_id: categoryId,
                gender_type: genderAge.gender,
                age_type: genderAge.age,
                brand_id: brandResult.brand?.id ?? null,
                brand_aliases_id: brandResult.alias?.id ?? null,
                item_condition_id: conditionId,

                attributes: {
                    inventory: {
                        initial: attributes.allInventory ?? 1,
                        current: attributes.allInventory ?? 1,
                        low_stock_ratio: 0.2,
                    },
                    colorVariants:
                        attributes.colorVariants.length > 0
                            ? attributes.colorVariants.map((v) => ({
                                  uiId: v.uiId,
                                  color: v.color ?? undefined,
                                  inventory: {
                                      initial: v.inventory ?? 1,
                                      current: v.inventory ?? 1,
                                      low_stock_ratio: 0.2,
                                  },
                                  image_url: finalAttributesImageUrls[v.uiId] ?? undefined,
                                  sizes: v.sizes.map((s) => ({
                                      size: s.size ?? undefined,
                                      inventory: {
                                          initial: s.inventory ?? 1,
                                          current: s.inventory ?? 1,
                                          low_stock_ratio: 0.2,
                                      },
                                  })),
                              }))
                            : undefined,
                    materials:
                        (attributes?.materials?.length ?? 0) > 0
                            ? attributes.materials.map((m) => ({
                                  name: m.name,
                                  ratio: m.ratio,
                              }))
                            : undefined,
                    body_category: categoryOption?.body_category ?? undefined,
                    lifestyle_category: categoryOption?.lifestyle_category ?? undefined,
                    layer: categoryOption?.layer ?? undefined,
                },

                price: priceNum,
                first_image_url: finalImageUrls[0],
                status: 'draft',
            },
            transaction: t,
        });

        await updateImage({ item, urls: finalImageUrls, transaction: t });
    });

    //　お知らせ作成
    createNormalNotification({
        data: {
            read_user_id: userId,
            url: `/item/draft/${itemId}`,
            message_image: item.first_image_url,
            message: `${item.name}の下書きを作成しました。下書きの閲覧・編集・出品はこちらから！`,
        },
    }).catch((err) => {
        console.error('service createNormalNotification error', err);
    });

    return {
        videoSignedUrl,
        thumbnailSignedUrl,
        itemImageSignedUrls,
        attributesImageSignedUrls,
    };
};
