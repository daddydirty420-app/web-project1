import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { authenticateToken } from "../middleware/index.js";
import { Video, Item, Notification, Sale, ItemShippingProfile, Categories, Brands, ItemConditionOption, ShippingDayOption, ShippingServiceOption, TodouhukenOption } from "../models/index.js";
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

type DraftBody = {
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
        variants: Array<{
            uiId: string;
            color: string | null;
            size: string | null;
            inventory: number;
            image: {
                name: string;
                type: string | null;
                uploaded: boolean;
            } | null;
        }>;
        material: string[],
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

    const body = req.body as DraftBody;

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
        let videoUrl: string | null = null;

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

        // サムネイル署名付きURL生成
        let thumbnailSignedUrl: string | null = null;
        let thumbnailUrl: string | null = null;

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

        // 商品画像署名付きURL生成
        const existingImages = Array.isArray(item.image_url)
        ? item.image_url
        : [];

        let itemImageSignedUrls: string[] = [];
        let itemImageUrls: string[] = [];

        if (Array.isArray(itemImages) && itemImages.length > 0) {
            for (let i = 0; i < itemImages.length; i++) {
                const img = itemImages[i];

                const existingUrl = existingImages[i];

                if (img.name && !img.uploaded) {
                    const key = `item-image/${userId}/${itemId}_${i}_${now}_${img.name}`;

                    const itemImageCommand = new PutObjectCommand({
                        Bucket: bucket,
                        Key: key,
                        ContentType: img.type ?? "",
                    });

                    const signedUrl = await getSignedUrl(s3, itemImageCommand, { expiresIn: 60 });

                    itemImageSignedUrls.push(signedUrl);
                    itemImageUrls.push(`${s3Domain}/${key}`);
                } else if (img.uploaded) {
                    itemImageUrls.push(existingUrl);
                } else if (img.uploaded && !existingUrl) {
                    console.warn(`既存URLが見つかりません: index=${i}`);
                }
            }
        }

        // attributes.image署名付きURL生成
        let attributesImageSignedUrls: Record<string, string> = {};
        let attributesImageUrls: Record<string, string> = {};

        if (attributes.variants.length > 0) {
            for (let i = 0; i < attributes.variants.length; i++) {
                const v = attributes.variants[i];

                const existingVariant = item.attributes?.variants ?? [];

                if (v.image && v.image.name && !v.image.uploaded) {
                    const key = `attributes/${userId}/${itemId}_${v.uiId}_${now}_${v.image.name}`;

                    const cmd = new PutObjectCommand({
                        Bucket: bucket,
                        Key: key,
                        ContentType: v.image.type ?? "",
                    });

                    const signedUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 });

                    attributesImageSignedUrls[v.uiId] = signedUrl;
                    console.log(attributesImageSignedUrls);
                    attributesImageUrls[v.uiId] = `${s3Domain}/${key}`;
                } else if (v.image && v.image.uploaded) {
                    if (existingVariant?.image_url) {
                        attributesImageUrls[v.uiId] = existingVariant.image_url;
                    }
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

        let brandOption = null;
        if (brandId !== null) {
            brandOption = await Brands.findByPk(brandId);
        }

        if (brandOption === null && brand.name) {
            brandOption = await findOrCreateBrand(brand.name ?? "");
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
        }, { transaction: t });

        await item.ItemShippingProfile.update({
            shipping_day_id: dayId,
            shipping_service_id: serviceId,
            shipping_place_id: placeId,
            shipping_service_free_text: shipping.freeText,
        }, { transaction: t });

        await item.update({
            image_url: itemImageUrls,
            name: itemMeta.name,
            detail: itemMeta.detail,

            category_id: categoryId,
            gender_type: genderAge.gender,
            age_type: genderAge.age,
            brand_id: brandOption?.id ?? null,
            item_condition_id: conditionId,

            attributes: {
                inventory: {
                    initial: attributes.allInventory,
                    current: attributes.allInventory,
                    low_stock_ratio: attributes.allInventory * 0.2,
                },
                variants: attributes.variants.length > 0
                ? attributes.variants.map(v => ({
                    color: v.color ?? null,
                    size: v.size ?? null,
                    size_label: v.size ?? null,
                    image_url: attributesImageUrls[v.uiId] ?? null,
                    inventory: {
                        initial: v.inventory,
                        current: v.inventory,
                        low_stock_ratio: v.inventory * 0.2,
                    },
                })) : undefined,
                material: attributes.material ?? [],
                body_category: categoryOption?.body_category ?? null,
                lifestyle_category: categoryOption?.lifestyle_category ?? null,
                layer: categoryOption?.layer ?? null,
            },

            price: priceNum,

            save_at: now,
            first_image_url: itemImageUrls[0] ?? null,
            status: "draft",
        }, { transaction: t });

        // お知らせ
        await Notification.create({
            read_user_id: userId,
            url: `/item/draft/${itemId}`,
            message_image: item.first_image_url,
            message: `${item.name}の下書きを作成しました。下書きの閲覧・編集・出品はこちらから！`,
        }, { transaction: t });

        await t.commit();

        res.status(200).json({
            message: `${item.name}の下書きを作成しました。`,
            videoSignedUrl,
            videoUrl,
            thumbnailSignedUrl,
            thumbnailUrl,
            itemImageSignedUrls,
            itemImageUrls,
            attributesImageSignedUrls,
            attributesImageUrls
        });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました." });
    }
});

export default router;