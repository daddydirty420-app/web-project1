import { Item, Video, Sale, ItemShippingProfile } from "../models/index.js";
import sequelize from "../db.js";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import type { ItemAttributes } from "../types/itemAttributes.js";

const s3 = new S3Client({
    region: process.env.AWS_REGION || "ap-northeast-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

const BUCKET = process.env.AWS_BUCKET || "flexoutdoor";

const getFileName = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
};

async function copyS3Object(sourceUrl: string, destKey: string) {
    const sourceKey = sourceUrl.split(".amazonaws.com/")[1];
    if (!sourceKey) throw new Error("Invalid S3 URL");

    const getCommand = new GetObjectCommand({
        Bucket: BUCKET,
        Key: sourceKey,
    });
    const response = await s3.send(getCommand);
    const body = await response.Body?.transformToByteArray();

    const putCommand = new PutObjectCommand({
        Bucket: BUCKET,
        Key: destKey,
        Body: body,
        ContentType: response.ContentType,
    });
    await s3.send(putCommand);

    return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${destKey}`;
};

async function itemCopyUpload(itemId: number, userId: number) {
    const item = await Item.findByPk(itemId, {
        include: [
            { model: Video },
            { model: Sale },
            { model: ItemShippingProfile },
        ],
    });

    const videoOriginalUrl = item.Video?.original_url ?? null;
    const videoConvertedUrl = item.Video?.converted_url ?? null;
    if (!videoOriginalUrl && !videoConvertedUrl) return;
    const thumbnailUrl = item.Video?.thumbnail_url ?? null;
    const itemImageUrl: string[] = item.image_url ?? [];
    if (!thumbnailUrl || !itemImageUrl.length) return;

    const videoOriginalFileName = videoOriginalUrl ? getFileName(videoOriginalUrl) : null;
    const videoConvertedFileName = videoConvertedUrl ? getFileName(videoConvertedUrl) : null;
    const thumbnailFileName = thumbnailUrl ? getFileName(thumbnailUrl) : null;
    const itemImageFileName = itemImageUrl.map(url => getFileName(url));

    const timestamp = Date.now();

    const t = await sequelize.transaction();

    try {
        const newUrls: { [key: string]: string | string[] } = {};

        if (videoOriginalUrl) {
            const destKey = `video/original/${userId}/${timestamp}/${videoOriginalFileName}`;
            newUrls.videoOriginalUrl = await copyS3Object(videoOriginalUrl, destKey);
        }

        if (videoConvertedUrl) {
            const destKey = `video/converted/${userId}/${timestamp}/${videoConvertedFileName}`;
            newUrls.videoConvertedUrl = await copyS3Object(videoConvertedUrl, destKey);
        }

        if (thumbnailUrl) {
            const destKey = `thumbnail/${userId}/${timestamp}/${thumbnailFileName}`;
            newUrls.thumbnailUrl = await copyS3Object(thumbnailUrl, destKey);
        }

        if (itemImageUrl.length > 0) {
            newUrls.itemImageUrl = await Promise.all(
                itemImageUrl.map(async (url, idx) => {
                    const fileName = itemImageFileName[idx];
                    const destKey = `item-image/${userId}/${timestamp}/${fileName}`;
                    return await copyS3Object(url, destKey);
                })
            );
        }

        const attributes: ItemAttributes = {
            ...item.attributes,
            inventory: {
                ...item.attributes?.inventory,
                current: item.attributes?.inventory?.initial ?? 0,
            },
            variants: {
                ...item.attrinutes?.variants,
                inventory: {
                    ...item.attributes?.variants?.inventory,
                    current: item.attrinutes?.variants?.inventory?.initial ?? 0,
                },
            },
        };

        const newItem = await Item.create({
            name: item.name,
            explain: item.explain,
            price: item.Sale.before_price,
            item_condition_id: item.item_condition_id,
            seller_id: userId,
            search_text: item.search_text,
            image_url: newUrls.itemImageUrl,
            first_image_url: Array.isArray(newUrls.itemImageUrl) ? newUrls.itemImageUrl[0] : null,
            gender_type: item.gender_type,
            age_type: item.age_type,
            category_id: item.category_id,
            brand_id: item.brand_id,
            attributes: attributes ?? {},
        }, { transaction: t });

        await Video.create({
            title: item.Video.title,
            summary: item.Video.summary,
            duration: item.Video.duration,
            user_id: userId,
            item_id: newItem.id,
            status: item.Video.status,
            thumbnail_url: newUrls.thumbnailUrl,
            original_url: newUrls.videoOriginalUrl ?? null,
            converted_url: newUrls.videoConvertedUrl ?? null,
        }, { transaction: t });

        await Sale.create({
            before_price: newItem.price,
            item_id: newItem.id,
        }, { transaction: t });

        await ItemShippingProfile.create({
            shipping_day_id: item.ItemShippingProfile.shipping_day_id,
            shipping_service_id: item.ItemShippingProfile.shipping_service_id,
            shipping_place_id: item.ItemShippingProfile.shipping_place_id,
            item_id: newItem.id,
        }, { transaction: t });

        await t.commit();

        return newItem;

    } catch (err) {
        await t.rollback();
        throw err;
    }
};

export default itemCopyUpload;