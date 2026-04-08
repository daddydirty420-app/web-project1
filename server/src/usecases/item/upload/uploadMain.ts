import { AppError } from "../../../errors.js";
import { getItemWithVideoSaleShipping } from "../../../services/items/index.js";
import { Body } from "../../../types/serviceType/items/uploadBody.js";
import { generateSignedUrl } from "../../../utils/s3/index.js";
import { s3Domain } from "../../../infra/aws/s3.js";
import { toNullableNumber } from "../../../utils/toNullableNumber.js";
import { getCategories } from "../../../services/categories.js";
import { getItemCondition } from "../../../services/itemConditionOption.js";
import { getShippingDay } from "../../../services/shippingDayOption.js";
import { getShippingService } from "../../../services/shippingServiceOption.js";
import { getTodouhuken } from "../../../services/todouhuken.js";
import { normalizeJapanese } from "../../../utils/normalizeJapanese.js";
import { BrandResult } from "../../../types/serviceType/brands.js";
import { getBrand, getBrandOne } from "../../../services/brands.js";
import { createAliases, getAliasOne } from "../../../services/brandAliases.js";
import sequelize from "../../../db.js";
import { updateVideo } from "../../../services/video.js";
import { updateSale } from "../../../services/sale.js";
import { updateShipping } from "../../../services/itemShippingProfile.js";
import { updateImage, updateItem } from "../../../services/items/command/update.js";
import { createNormalNotification } from "../../../services/notification.js";

type Params = {
    itemId: number;
    userId: number;
    body: Body;
};

type SignedUrlWithIndex = {
    index: number;
    url: string;
};

export const uploadMainUseCase = async ({ itemId, userId, body }: Params) => {
    const {
        video,
        thumbnail,
        itemImages,
        attributes,
        category,
        condition,
        shipping,
        price,
        brand,
        videoMeta,
        itemMeta,
        genderAge
    } = body;

    const now = Date.now();
        
    // Item取得
    const item = await getItemWithVideoSaleShipping({ itemId });

    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    if (!item.Video) throw new AppError("VIDEO_NOT_FOUND", 404);
    if (!item.Sale) throw new AppError("SALE_NOT_FOUND", 404);
    if (!item.ItemShippingProfile) throw new AppError("SHIPPING_NOT_FOUND", 404);

    // 動画署名付きURL生成
    let videoSignedUrl: string | null = null;
    let videoUrl: string | null = item.Video?.converted_url ?? item.Video?.original_url ?? null;
    
    if (video?.name && !video.uploaded && video.type) {
        const ext = video.name.split('.').pop();
        const originalKey = `video/original/${userId}/${itemId}_${now}_${ext}`;
    
        videoSignedUrl = await generateSignedUrl({ key: originalKey, contentType: video.type });
    
        videoUrl = `${s3Domain}/${originalKey}`;
    }
    
    if (!videoUrl) {
        throw new AppError("VIDEOURL_NULL", 400);
    }
    
    // サムネイル署名付きURL生成
    let thumbnailSignedUrl: string | null = null;
    let thumbnailUrl: string | null = item.Video?.thumbnail_url ?? null;
    
    if (thumbnail?.name && !thumbnail.uploaded && thumbnail.type) {
        const ext = thumbnail.name.split('.').pop();
        const key = `thumbnail/${userId}/${itemId}_${now}_${ext}`;
    
        thumbnailSignedUrl = await generateSignedUrl({ key, contentType: thumbnail.type });
    
        thumbnailUrl = `${s3Domain}/${key}`;
    }
    
    if (!thumbnailUrl) {
        throw new AppError("THUMBNAIL_URL_NULL", 400);
    }
        
    // 商品画像署名付きURL生成
    const existingImages = Array.isArray(item.image_url)
    ? item.image_url
    : [];
                
    let itemImageSignedUrls: SignedUrlWithIndex[] = [];
    let newUploadedUrls: string[] = []; // 新規用
    let finalImageUrls: string[] = []; // DB保存用
                    
    await Promise.all((itemImages ?? []).map(async (img, index) => {
        if (!img || img.uploaded || !img.type) return;
        
        const ext = img.name.split('.').pop();
        const key = `item-image/${userId}/${itemId}_${index}_${now}_${ext}`;
            
        const signedUrl = await generateSignedUrl({ key, contentType: img.type });
                    
        itemImageSignedUrls[index] = {
            index,
            url: signedUrl
        };
            
        itemImageSignedUrls = itemImageSignedUrls.filter(
            (v): v is SignedUrlWithIndex => v != null
        );
            
        newUploadedUrls[index] = `${s3Domain}/${key}`;
    }));
        
    (itemImages ?? []).forEach((img, i) => {
        if (!img) return;
                
        if (img.uploaded) {
            const existingUrl = existingImages[i];
            if (existingUrl) finalImageUrls.push(existingUrl);
        } else {
            const newUrl = newUploadedUrls[i];
            if (newUrl) finalImageUrls.push(newUrl);
        }
    });
    
    if (finalImageUrls.length === 0) {
        throw new AppError("ITEMIMAGE_NULL", 400);
    }
    
    // attributes.image署名付きURL生成
    const existingVariants = Array.isArray(item.attributes?.colorVariants)
    ? item.attributes.colorVariants
    : [];
            
    const existingVariantMap = new Map<string, string>();
            
    existingVariants.forEach((variant: any) => {
        if (variant.uiId && variant.image_url) {
            existingVariantMap.set(variant.uiId, variant.image_url);
        }
    });
            
    let attributesImageSignedUrls: Record<string, string> = {};
    let attributesImageUrls: Record<string, string> = {};
            
    const attributesTargets = attributes.colorVariants.filter(
        v => v.image && v.image.name && !v.image.uploaded
    );
            
    await Promise.all(attributesTargets.map(async (v) => {
        if (!v.image || !v.image.type) return;
        
        const ext = v.image?.name.split('.').pop();
        const key = `attributes/${userId}/${itemId}_${v.uiId}_${now}_${ext}`;
            
        const signedUrl = await generateSignedUrl({ key, contentType: v.image?.type });
            
        attributesImageSignedUrls[v.uiId] = signedUrl;
        attributesImageUrls[v.uiId] = `${s3Domain}/${key}`;
    }));
            
    const finalAttributesImageUrls: Record<string, string> = {};
                    
    for (const v of attributes.colorVariants) {
        if (v.image && !v.image.uploaded) {
            const newUrl = attributesImageUrls[v.uiId];
            if (newUrl) {
                finalAttributesImageUrls[v.uiId] = newUrl;
            }
        } else {
            const existingUrl = existingVariantMap.get(v.uiId);
            if (existingUrl) {
                finalAttributesImageUrls[v.uiId] = existingUrl;
            }
        }
    }
    
    // 数値チェック 
    const categoryId = toNullableNumber(category.id);
        
    const conditionId = toNullableNumber(condition.id);
        
    const dayId = toNullableNumber(shipping.day);
        
    const serviceId = toNullableNumber(shipping.service);
        
    const placeId = toNullableNumber(shipping.place);
        
    const priceNum = price === "" ? 0 : Number(price);
    if (priceNum !== 0 && Number.isNaN(priceNum)) {
        throw new AppError("INVALID_PRICE", 400);
    }
        
    // マスターテーブルチェック
    let categoryOption = null;
    if (categoryId !== null && categoryId !== 0) {
        categoryOption = await getCategories({ categoryId });
        if (!categoryOption) {
            throw new AppError("CATEGORY_NOT_FOUND", 404);
        }
    }
            
    if (conditionId !== null && conditionId !== 0) {
        const conditionOption = await getItemCondition({ conditionId });
        if (!conditionOption) {
            throw new AppError("ITEM_CONDITION_NOT_FOUND", 404);
        }
    }
            
    if (dayId !== null && dayId !== 0) {
        const dayOption = await getShippingDay({ dayId });
        if (!dayOption) {
            throw new AppError("SHIPPING_DAY_NOT_FOUND", 404);
        }
    }
            
    if (serviceId !== null && serviceId !== 0) {
        const serviceOption = await getShippingService({ serviceId });
        if (!serviceOption) {
            throw new AppError("SHIPPING_SERVICE_NOT_FOUND", 404);
        }
    }
        
    if (placeId !== null && placeId !== 0) {
        const placeOption = await getTodouhuken({ todouhukenId: placeId });
        if (!placeOption) {
            throw new AppError("PLACE_NOT_FOUND", 404);
        }
    }
    
    // ブランドチェック
    const brandId = toNullableNumber(brand.id);
    
    let brandResult: BrandResult = { brand: null, alias: null };
    
    if (brandId !== null) {
        const selectedBrand = await getBrand({ brandId });
        brandResult = { brand: selectedBrand, alias: null };
    }
    
    if (!brandResult.brand && brand.name) {
        const inputName = brand.name;
        const normalized = normalizeJapanese(inputName);
    
        let alias = await getAliasOne({ normalized });
    
        if (alias?.brand) {
            brandResult = { brand: alias.brand, alias };
        }
    
        const brandsData = await getBrandOne({ normalized });
    
        if (!brandsData && inputName.length >= 2) {
            alias = await createAliases({ inputName, normalized });
        }
    }

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
                    colorVariants: attributes.colorVariants.length > 0
                    ? attributes.colorVariants.map(v => ({
                        uiId: v.uiId,
                        color: v.color ?? undefined,
                        inventory: {
                            initial: v.inventory ?? 1,
                            current: v.inventory ?? 1,
                            low_stock_ratio: 0.2,
                        },
                        image_url: finalAttributesImageUrls[v.uiId] ?? undefined,
                        sizes: v.sizes.map(s => ({
                            size: s.size ?? undefined,
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
                    body_category: categoryOption?.body_category ?? undefined,
                    lifestyle_category: categoryOption?.lifestyle_category ?? undefined,
                    layer: categoryOption?.layer ?? undefined,
                },
            
                price: priceNum,
                first_image_url: finalImageUrls[0],
                status: "draft",
            },
            transaction: t,
        });
        
        await createNormalNotification({
            data: {
                read_user_id: userId,
                url: `/item/draft/${itemId}`,
                message_image: item.first_image_url,
                message: `${item.name}の下書きを作成しました。下書きの閲覧・編集・出品はこちらから！`,
            },
            transaction: t,
        });
        
        await updateImage({ item, urls: finalImageUrls, transaction: t });
    });

    return {
        videoSignedUrl,
        thumbnailSignedUrl,
        itemImageSignedUrls,
        attributesImageSignedUrls
    };
};