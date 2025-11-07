import { Item, Video, Sale, Delivery, ColorSize, Category } from "../models/index.js";
import sequelize from "../db.js";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

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
        attributes: ['name', 'explain', 'image_url', 'category_text', 'stock_all', 'item_condition_id', 'search_text'],
        include: [
            {
                model: Video,
                attributes: ['thumbnail_url', 'title', 'summary', 'duration', 'original_url', 'converted_url', 'status'],
            },
            {
                model: Sale,
                attributes: ['before_price'],
            },
            {
                model: Delivery,
                as: "ParentDelivery",
                attributes: ['shipping_day_id', 'shipping_service_id', 'shipping_place_id'],
            },
            {
                model: Category,
            },
            {
                model: ColorSize,
            }
        ]
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

        const newItem = await Item.create({
            name: item.name,
            explain: item.explain,
            category_text: item.category_text,
            price: item.Sale.before_price,
            stock_all: item.stock_all,
            stock_now: item.stock_all,
            stock_20: item.stock_all / 5,
            item_condition_id: item.item_condition_id,
            seller_id: userId,
            search_text: item.search_text,
            image_url: newUrls.itemImageUrl,
            first_image_url: Array.isArray(newUrls.itemImageUrl) ? newUrls.itemImageUrl[0] : null,
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

        await Delivery.create({
            shipping_day_id: item.ParentDelivery.shipping_day_id,
            shipping_service_id: item.ParentDelivery.shipping_service_id,
            shipping_place_id: item.ParentDelivery.shipping_place_id,
            item_id: newItem.id,
            parent_data: true,
        }, { transaction: t });

        await Category.create({
            item_id: newItem.id,
            category1_id: item.Category.category1_id,
            camp_id: item.Category.camp_id,
            hike_id: item.Category.hike_id,
            wear_id: item.Category.wear_id,
            other_id: item.Category.other_id,
        }, { transaction: t });

        if (item.ColorSizes && item.ColorSizes.length >= 1) {
            const newRecords = item.ColorSizes.map((cs: InstanceType<typeof ColorSize>) => ({
                kind: cs.kind,
                color: cs.color,
                size: cs.size,
                image_url: cs.image_url,
                stock_all: cs.stock_all,
                stock_now: cs.stock_all,
                size_id: cs.size_id,
                size_wear_id: cs.size_wear_id,
                size_shoes_id: cs.size_shoes_id,
                user_id: userId,
                item_id: newItem.id,
            }));

            await ColorSize.bulkCreate(newRecords, { transaction: t });
        }

        await t.commit();

        return newItem;

    } catch (err) {
        await t.rollback();
        throw err;
    }
};

export default itemCopyUpload;