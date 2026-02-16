import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { authenticateToken } from "../middleware/index.js";
import { Video, Item, Sale, ItemShippingProfile, Categories, Brands, ItemConditionOption, ShippingDayOption, ShippingServiceOption, TodouhukenOption, BrandAliases } from "../models/index.js";
import sequelize from "../db.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import findOrCreateBrand from "../services/findOrCreateBrand.js";

const router = Router();

const bucket = process.env.AWS_BUCKET;
const region = process.env.AWS_REGION;
const s3Domain = `https://${bucket}.s3.${region}.amazonaws.com`;
const s3 = new S3Client({
    region: region || "ap-northeast-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

const now = Date.now();

type Body = {
    video?: { name?: string; type?: string; uploaded: boolean };
    thumbnail?: { name?: string; type?: string; uploaded: boolean };
    videoMeta: { title: string; summary: string };
    itemImages: Array<{
        name: string;
        type: string | null;
        uploaded: boolean;
    }>;
    itemMeta: { name: string; detail: string };
    category: { id: string | null; name: string; parent_id: string | null; level: number };
    genderAge: { gender: string | null; age: string | null };
    brand: { id: string | null; name: string | null };
    attributes: {
        allInventory: number;
        colorVariants: Array<{
            uiId: string;
            color: string | null;
            image: {
                name: string;
                type: string | null;
                uploaded: boolean;
            } | null;
            sizes: Array<{
                size: string | null;
                inventory: number;
            }>;
        }>;
        materials: Array<{
            name: string;
            ratio: number;
        }>;
    };
    condition: { id: string; name: string };
    shipping: {
        day: string | null;
        service: string | null;
        place: string | null;
        freeText: string | null;
    };
    price: string;
};

type BrandResult = {
    brand: InstanceType<typeof Brands> | null;
    alias: InstanceType<typeof BrandAliases> | null;
};

type SignedUrlWithIndex = {
    index: number;
    url: string;
};

function toNullableNumber(value: any): number | null {
    if (value === null || value === "") return null;
    const num = Number(value);
    if (Number.isNaN(num)) {
        throw new Error("不正な数値");
    }
    return num;
}

router.patch("/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;
    const userId = req.user!.id;

    const body = req.body as Body;

    const {
        video,
        thumbnail,
        videoMeta,
        itemImages = [],
        itemMeta,
        category,
        genderAge,
        brand,
        attributes,
        condition,
        shipping,
        price,
    } = body;

    const t = await sequelize.transaction();

    try {
        const item = await Item.findByPk(itemId, {
            include: [
                { model: Video },
                { model: Sale },
                { model: ItemShippingProfile },
            ],
        });

        if (!item) {
            res.status(404).json({ message: "商品データが見つかりません。" });
            return;
        }

        // 動画署名付きURL生成
        let videoSignedUrl: string | null = null;
        let videoUrl: string | null = item.Video?.converted_url ?? item.Video?.original_url ?? null;

        if (video?.name && !video.uploaded) {
            const originalKey = `video/original/${userId}/${itemId}_${now}_${video.name}`;

            const videoCommand = new PutObjectCommand({
                Bucket: bucket,
                Key: originalKey,
                ContentType: video.type,
            });

            videoSignedUrl = await getSignedUrl(s3, videoCommand, { expiresIn: 60 });

            videoUrl = `${s3Domain}/${originalKey}`;
        }

        if (!videoUrl) {
            res.status(400).json({ message: "動画が見つかりません" });
            return;
        }

        // サムネイル署名付きURL生成
        let thumbnailSignedUrl: string | null = null;
        let thumbnailUrl: string | null = item.Video?.thumbnail_url ?? null;

        if (thumbnail?.name && !thumbnail.uploaded) {
            const key = `thumbnail/${userId}/${itemId}_${now}_${thumbnail.name}`;

            const thumbnailCommand = new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                ContentType: thumbnail.type,
            });

            thumbnailSignedUrl = await getSignedUrl(s3, thumbnailCommand, { expiresIn: 60 });

            thumbnailUrl = `${s3Domain}/${key}`;
        }

        if (!thumbnailUrl) {
            res.status(400).json({ message: "サムネイルが見つかりません" });
            return;
        }

        // 商品画像署名付きURL生成
        const existingImages = Array.isArray(item.image_url)
        ? item.image_url
        : [];

        let itemImageSignedUrls: SignedUrlWithIndex[] = [];
        let newUploadedUrls: string[] = []; // 新規用
        let finalImageUrls: string[] = []; // DB保存用

        await Promise.all((itemImages ?? []).map(async (img, index) => {
            if (!img || img.uploaded) return;

            const key = `item-image/${userId}/${itemId}_${index}_${now}_${img.name}`;

            const itemImageCommand = new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                ContentType: img.type ?? "",
            });

            const signedUrl = await getSignedUrl(s3, itemImageCommand, { expiresIn: 60 });

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
            res.status(400).json({ message: "商品画像が見つかりません" });
            return;
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
            const key = `attributes/${userId}/${itemId}_${v.uiId}_${now}_${v.image?.name}`;

            const cmd = new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                ContentType: v.image?.type ?? "",
            });

            const signedUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 });

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
        let categoryId: number | null;
        try {
            categoryId = toNullableNumber(category.id);
        } catch {
            res.status(400).json({ message: "category.idの値が不正です" });
            return;
        }

        let conditionId: number | null;
        try {
            conditionId = toNullableNumber(condition.id);
        } catch {
            res.status(400).json({ message: "condition.idの値が不正です" });
            return;
        }

        let dayId: number | null;
        try {
            dayId = toNullableNumber(shipping.day);
        } catch {
            res.status(400).json({ message: "day.idの値が不正です" });
            return;
        }

        let serviceId: number | null;
        try {
            serviceId = toNullableNumber(shipping.service);
        } catch {
            res.status(400).json({ message: "service.idの値が不正です" });
            return;
        }

        let placeId: number | null;
        try {
            placeId = toNullableNumber(shipping.place);
        } catch {
            res.status(400).json({ message: "place.idの値が不正です" });
            return;
        }

        const priceNum = price === "" ? 0 : Number(price);
        if (priceNum !== 0 && Number.isNaN(priceNum)) {
            res.status(400).json({ message: "priceが数値ではありません。" });
            return;
        }

        // マスターテーブルチェック
        let categoryOption = null;
        if (categoryId !== null && categoryId !== 0) {
            categoryOption = await Categories.findByPk(categoryId);
            if (!categoryOption) {
                res.status(404).json({ message: "カテゴリーが見つかりません" });
                return;
            }
        }

        if (conditionId !== null && conditionId !== 0) {
            const conditionOption = await ItemConditionOption.findByPk(conditionId);
            if (!conditionOption) {
                res.status(404).json({ message: "ItemConditionOptionが見つかりません" });
                return;
            }
        }

        if (dayId !== null && dayId !== 0) {
            const dayOption = await ShippingDayOption.findByPk(dayId);
            if (!dayOption) {
                res.status(404).json({ message: "ShippingDayOptionが見つかりません" });
                return;
            }
        }

        if (serviceId !== null && serviceId !== 0) {
            const serviceOption = await ShippingServiceOption.findByPk(serviceId);
            if (!serviceOption) {
                res.status(404).json({ message: "ShippingServiceOptionが見つかりません" });
                return;
            }
        }

        if (placeId !== null && placeId !== 0) {
            const placeOption = await TodouhukenOption.findByPk(placeId);
            if (!placeOption) {
                res.status(404).json({ message: "placeOption（都道府県）が見つかりません" });
                return;
            }
        }

        // ブランドチェック
        let brandId: number | null;
        try {
            brandId = toNullableNumber(brand.id);
        } catch {
            res.status(400).json({ message: "brand.idの値が不正です" });
            return;
        }

        let brandResult: BrandResult = { brand: null, alias: null };

        if (brandId !== null) {
            const selectedBrand = await Brands.findByPk(brandId);
            brandResult = { brand: selectedBrand, alias: null };
        }

        if (!brandResult.brand && brand.name) {
            brandResult = await findOrCreateBrand(brand.name ?? "");
        }

        // データ更新
        await item.Video.update({
            title: videoMeta.title,
            summary: videoMeta.summary,
            thumbnail_url: thumbnailUrl,
            original_url: videoUrl,
        }, { transaction: t });

        await item.Sale.update({
            before_price: priceNum,
            sale_flag: false,
            discount_rate: 0,
            discount_amount: 0,
        }, { transaction: t });

        await item.ItemShippingProfile.update({
            shipping_day_id: dayId,
            shipping_service_id: serviceId,
            shipping_place_id: placeId,
            shipping_service_free_text: shipping.freeText,
        }, { transaction: t });

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
                    initial: attributes.allInventory,
                    current: attributes.allInventory,
                    low_stock_ratio: 0.2,
                },
                colorVariants: attributes.colorVariants.length > 0
                ? attributes.colorVariants.map(v => ({
                    uiId: v.uiId,
                    color: v.color ?? null,
                    image_url: finalAttributesImageUrls[v.uiId] ?? null,
                    sizes: v.sizes.map(s => ({
                        size: s.size ?? null,
                        inventory: {
                            initial: s.inventory,
                            current: s.inventory,
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

            save_at: now,
            first_image_url: finalImageUrls[0],
        }, { transaction: t });

        // 商品画像更新
        item.setDataValue("image_url", finalImageUrls);
        item.changed("image_url", true);
        await item.save({ transaction: t });

        await t.commit();

        res.status(200).json({
            message: `${item.name}のデータを作成しました。`,
            videoSignedUrl,
            thumbnailSignedUrl,
            itemImageSignedUrls,
            attributesImageSignedUrls
        });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました." });
    }
});

export default router;