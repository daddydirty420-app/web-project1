import { Item, ItemShippingProfile, Notification, Sale, Video } from "../../../../models/index.js";
import sequelize from "../../../../db.js";
import { Body } from "../../../../types/items/uploadBody.js";
import { BrandResult } from "./check/checkBrands.js";
import { UploadMode } from "../putItem.service.js";
import { AppError } from "../../../../errors.js";

type Params = {
    userId: number;
    itemId: number;
    mode: UploadMode;
    body: Body;
    item: InstanceType<typeof Item> & {
        Video?: InstanceType<typeof Video>;
        Sale?: InstanceType<typeof Sale>;
        ItemShippingProfile?: InstanceType<typeof ItemShippingProfile>;
    };
    thumbnailUrl: string | null;
    videoUrl: string | null;
    finalImageUrls: string[];
    finalAttributesImageUrls: Record<string, string>;
    categoryOption: any;
    categoryId: number | null;
    conditionId: number | null;
    dayId: number | null;
    serviceId: number | null;
    placeId: number | null;
    priceNum: number;
    brandResult: BrandResult;
};

export const putData = async ({
    userId,
    itemId,
    mode,
    body,
    item,
    thumbnailUrl,
    videoUrl,
    finalImageUrls,
    finalAttributesImageUrls,
    categoryOption,
    categoryId,
    conditionId,
    dayId,
    serviceId,
    placeId,
    priceNum,
    brandResult
}: Params) => {
    const {
        videoMeta,
        itemMeta,
        genderAge,
        attributes,
        shipping,
    } = body;

    const nowDate = new Date();
    
    // データ更新
    await sequelize.transaction(async (t) => {
        if (item.Video) {
            await item.Video.update({
                title: videoMeta.title,
                summary: videoMeta.summary,
                thumbnail_url: thumbnailUrl,
                original_url: videoUrl,
            }, { transaction: t });
        } else if (mode === "main" && !item.Video) {
            throw new AppError("VIDEO_NOT_FOUND", 404);
        }
    
        if (item.Sale) {
            await item.Sale.update({
                before_price: priceNum,
                sale_flag: false,
                discount_rate: 0,
                discount_amount: 0,
            }, { transaction: t });
        } else if (mode === "main" && !item.Sale) {
            throw new AppError("SALE_NOT_FOUND", 404);
        }
    
        if (item.ItemShippingProfile) {
            await item.ItemShippingProfile.update({
                shipping_day_id: dayId,
                shipping_service_id: serviceId,
                shipping_place_id: placeId,
                shipping_service_free_text: shipping.freeText,
            }, { transaction: t });
        } else if (mode === "main" && !item.ItemShippingProfile) {
            throw new AppError("ITEM_SHIPPING_PROFILE_NOT_FOUND", 404);
        }
    
        await item.update({
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
                colorVariants: attributes.colorVariants.length > 0
                ? attributes.colorVariants.map(v => ({
                    uiId: v.uiId,
                    color: v.color ?? null,
                    inventory: {
                        initial: v.inventory ?? 1,
                        current: v.inventory ?? 1,
                        low_stock_ratio: 0.2,
                    },
                    image_url: finalAttributesImageUrls[v.uiId] ?? null,
                    sizes: v.sizes.map(s => ({
                        size: s.size ?? null,
                        inventory: {
                            initial: s.inventory ?? 1,
                            current: s.inventory ?? 1,
                            low_stock_ratio: 0.2,
                        },
                    })),
                })) : undefined,
                materials: (attributes?.materials?.length ?? 0) > 0
                ? attributes.materials.map(m => ({
                    name: m.name,
                    ratio: m.ratio,
                })) : undefined,
                body_category: categoryOption?.body_category ?? null,
                lifestyle_category: categoryOption?.lifestyle_category ?? null,
                layer: categoryOption?.layer ?? null,
            },
    
            price: priceNum,
    
            save_at: nowDate,
            first_image_url: finalImageUrls[0],
            status: mode === "draft" ? "draft" : "editing",
        }, { transaction: t });
        
        // お知らせ
        await Notification.create({
            read_user_id: userId,
            url: `/item/draft/${itemId}`,
            message_image: item.first_image_url,
            message: `${item.name}の下書きを作成しました。下書きの閲覧・編集・出品はこちらから！`,
        }, { transaction: t });
    
        // 商品画像更新
        item.setDataValue("image_url", finalImageUrls);
        item.changed("image_url", true);
        await item.save({ transaction: t });
    });
};