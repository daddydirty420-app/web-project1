import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import multer from "multer";
import fs from "fs";
import { exec } from "child_process";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { authenticateToken } from "../middleware/index.js";
import { Video, Item, User, Notification, Follow, ReccomendItem, ReccomendMonth, Sale, ItemShippingProfile, Categories, Brands, ShopInfo, ItemConditionOption, ShippingDayOption, ShippingServiceOption, TodouhukenOption } from "../models/index.js";
import { AuthUser } from "../middleware/authMiddleware.js";
import sequelize from "../db.js";
import { Op } from "sequelize";
import { normalizeJapanese } from "../utils/normalizeJapanese.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import findOrCreateBrand from "../services/findOrCreateBrand.js";

interface AuthenticatedRequest extends Request {
    user?: AuthUser;
    file?: Express.Multer.File;
}

const router = Router();

const upload = multer({ dest: "tmp/ " });

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
        let attributesImageSignedUrl: Record<string, string> = {};
        let attributesImageUrl: Record<string, string> = {};

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

                    attributesImageSignedUrl[v.uiId] = signedUrl;
                    attributesImageUrl[v.uiId] = `${s3Domain}/${key}`;
                } else if (v.image && v.image.uploaded) {
                    if (existingVariant?.image_url) {
                        attributesImageUrl[v.uiId] = existingVariant.image_url;
                    }
                }
            }
        }

        // 数値チェック
        const categoryId = category.id === null ? null : Number(category.id);
        if (categoryId !== null && Number.isNaN(categoryId)) {
            res.status(400).json({ message: "category.idが不正です" });
            return;
        }

        const conditionId = condition.id === null ? null : Number(condition.id);
        if (conditionId !== null && Number.isNaN(conditionId)) {
            res.status(400).json({ message: "condition.idが不正です" });
            return;
        }

        const dayId = shipping.day === null ? null : Number(shipping.day);
        if (dayId !== null && Number.isNaN(dayId)) {
            res.status(400).json({ message: "day.idが不正です" });
        }

        const serviceId = shipping.service === null ? null : Number(shipping.service);
        if (serviceId !== null && Number.isNaN(serviceId)) {
            res.status(400).json({ message: "service.idが不正です" });
            return;
        }

        const placeId = shipping.place === null ? null : Number(shipping.place);
        if (placeId !== null && Number.isNaN(placeId)) {
            res.status(400).json({ message: "place.idが不正です" });
            return;
        }

        const priceNum = price === "" ? 0 : Number(price);
        if (priceNum !== 0 && Number.isNaN(priceNum)) {
            res.status(400).json({ message: "priceが数値ではありません。" });
            return;
        }

        // マスターテーブルチェック
        let categoryOption = null;
        if (categoryId !== null || categoryId !== 0) {
            categoryOption = await Categories.findByPk(categoryId);
            if (!categoryOption) {
                console.log("category", categoryId);
                res.status(404).json({ message: "カテゴリーが見つかりません" });
                return;
            }
        }

        if (conditionId !== null || conditionId !== 0) {
            const conditionOption = await ItemConditionOption.findByPk(conditionId);
            if (!conditionOption) {
                console.log("condition");
                res.status(404).json({ message: "ItemConditionOptionが見つかりません" });
                return;
            }
        }

        if (dayId !== null || dayId !== 0) {
            const dayOption = await ShippingDayOption.findByPk(dayId);
            if (!dayOption) {
                console.log("day");
                res.status(404).json({ message: "ShippingDayOptionが見つかりません" });
                return;
            }
        }

        if (serviceId !== null || serviceId !== 0) {
            const serviceOption = await ShippingServiceOption.findByPk(serviceId);
            if (!serviceOption) {
                console.log("service");
                res.status(404).json({ message: "ShippingServiceOptionが見つかりません" });
                return;
            }
        }

        if (placeId !== null || placeId !== 0) {
            const placeOption = await TodouhukenOption.findByPk(placeId);
            if (!placeOption) {
                console.log("place");
                res.status(404).json({ message: "placeOption（都道府県）が見つかりません" });
                return;
            }
        }

        // ブランドチェック
        const brandId = brand.id === null ? null : Number(brand.id);
        if (brandId !== null && Number.isNaN(brandId)) {
            res.status(400).json({ message: "brand.idが不正です" });
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
                    image_url: attributesImageUrl[v.uiId] ?? null,
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
            attributesImageSignedUrl,
            attributesImageUrl
        });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました." });
    }
});

export default router;