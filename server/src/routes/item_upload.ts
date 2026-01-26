import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import multer from "multer";
import fs from "fs";
import { exec } from "child_process";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { authenticateToken } from "../middleware/index.js";
import { Video, Item, User, Notification, Follow, ReccomendItem, ReccomendMonth, Sale, ItemShippingProfile, Categories, Brands } from "../models/index.js";
import { AuthUser } from "../middleware/authMiddleware.js";
import sequelize from "../db.js";
import { Op } from "sequelize";
import { normalizeJapanese } from "../utils/normalizeJapanese.js";

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

router.patch('/upload-video/:id', upload.single('video'), authenticateToken, async(req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ message: '動画ファイルがありません。' });
        return;
    }

    const originalFilePath = req.file.path;
    const fileName = req.file.originalname;

    const currentUserId = req.user?.id;
    const videoId = req.params.id;

    const timestamp = Date.now();

    try {
        const videoData = await Video.findByPk(videoId);
        if (!videoData) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        const uploadParams = {
            Bucket: bucket,
            Key: `video/original/${currentUserId}/${timestamp}_${fileName}`,
            Body: fs.createReadStream(originalFilePath),
            ContentType: req.file.mimetype,
        };
        await s3.send(new PutObjectCommand(uploadParams));

        const originalUrl = `${s3Domain}/video/original/${currentUserId}/${timestamp}/${fileName}`;

        await videoData.update({
            status: 'processing',
            original_url: originalUrl,
        });

        const convertedDir = `tmp/converted_${videoId}`;
        fs.mkdirSync(convertedDir);

        const ffmpegCmd = `ffmpeg -i ${originalFilePath} -profile:v baseline -level 3.0 -start_number 0 -hls_time 10 -hls_list_time 0 -f hls ${convertedDir}/index.m3u8`;
        exec(ffmpegCmd, async (err) => {
            if (err) {
                console.error(err);
                await videoData.update({ status: 'failed' });
                return;
            }

            const files = fs.readdirSync(convertedDir);
            for (const f of files) {
                const filePath = `${convertedDir}/${f}`;
                const uploadParams = {
                    Bucket: bucket,
                    Key: `videos/converted/${currentUserId}/${f}`,
                    Body: fs.createReadStream(filePath),
                    ContentType: f.endsWith('.ts') ? 'video/MP2P' : 'application/octet-stream',
                };
                await s3.send(new PutObjectCommand(uploadParams));
            }

            const convertedUrl = `${s3Domain}/video/converted/${currentUserId}/${videoId}/index.m3u8`;
            await videoData.update({
                status: 'done',
                converted_url: convertedUrl,
            });

            fs.rmSync(originalFilePath);
            fs.rmSync(convertedDir, { recursive: true });
        });

        res.status(200).json({ message: '動画のアップロードが完了しました。' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.post("/new-item-create", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;

    const t = await sequelize.transaction();

    try {
        const item = await Item.create({
            seller_id: userId,
        }, { transaction: t });

        const itemId = item.id;

        await Video.create({
            user_id: userId,
            item_id: itemId,
        }, { transaction: t });

        await Sale.create({
            item_id: itemId,
        }, { transaction: t });
        
        await ItemShippingProfile.create({
            item_id: itemId,
        }, { transaction: t });

        await t.commit();

        res.status(200).json({ itemId });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.patch("/upload-confirm/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;
    const currentUserId = req.user!.id;
    const now = Date.now();

    const t = await sequelize.transaction();

    try {
        const item = await Item.findByPk(itemId, {
            include: [
                {
                    model: Video,
                },
                {
                    model: User,
                    include: [
                        { model: ReccomendMonth },
                    ],
                },
            ],
        });
        if (!item) {
            res.status(404).json({ message: "itemが見つかりません。" });
            return;
        }

        const followerCount = await Follow.count({
            where: { follower_user_id: currentUserId },
        });

        const sellItemCount = await Item.count({
            where: {
                seller_id: currentUserId,
                status: { [Op.in]: ["active", "soldout"] },
            },
        });

        let sort = (item.price / 10)
        + (item.detail?.length ?? 0)
        + (item.Video?.summary?.length ?? 0)
        + (item.User?.user_introduction?.length ?? 0)
        + (followerCount * 10)
        + (sellItemCount * 10);

        if (item.User?.penalty_points <= 5) {
            sort = sort + 5000;
        }

        if (item.User?.ReccomendMonth) {
            sort = sort * 5;

            await ReccomendItem.create({
                recommend_month: true,
                item_id: itemId,
                user_id: currentUserId,
            }, { transaction: t });
        }

        await item.update({
            status: "active",
            uploaded_at: now,
            save_at: now,
            early_sell: true,
            sort_number: sort,
            sort_buzz_number: sort,
        }, { transaction: t });

        await Notification.create({
            read_user_id: currentUserId,
            ur: `/item/${itemId}`,
            message_image: item.first_image_url,
            message: `商品「${item.name}」を出品いただき誠にありがとうございます。商品の詳細はこちらの商品ページからご確認ください。`,
        }, { transaction: t });

        await t.commit();

        res.status(200).json({ message: "出品成功！" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get("/category2/:id", async (req: Request, res: Response): Promise<void> => {
    const parentId = req.params.id;
    const parentIdNum = Number(parentId);

    try {
        const category2 = await Categories.findAll({
            where: {
                parent_id: parentIdNum,
                level: 2,
            },
            order: [["sort_order", "ASC"]],
        });

        if (!category2) {
            res.status(404).json({ message: "データが見つかりません。" });
            return;
        }

        res.status(200).json({ category2 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get("/brand-suggest", async (req: Request, res: Response): Promise<void> => {
    const keyword = normalizeJapanese((req.query.keyword ?? "") as string);

    if (!keyword) {
        res.status(200).json({ suggest: [] });
        return;
    }

    try {
        const brands = await Brands.findAll({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.iLike]: `%${keyword}%`,
                        },
                    },
                    {
                        name_normalized: {
                            [Op.iLike]: `%${keyword}%`,
                        },
                    },
                ],
            },
            order: [[sequelize.fn("length", sequelize.col("name")), "ASC"]],
            limit: 15,
        });

        res.status(200).json({ brands });
    } catch (err) {
        console.error(err);
        res.status(500).json({ suggest: [] });
    }
});

router.get("/upload/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;

    try {
        const item = await Item.findByPk(itemId, {
            attributes: ["id", "seller_id", "status"],
            include: [
                { model: Video },
                { model: Sale },
                { model: ItemShippingProfile },
            ],
        });

        if (!item) {
            res.status(404).json({ message: "データが見つかりません。" });
            return;
        }

        if (item.status !== "editing") {
            res.status(400).json({ message: "不正なデータが検出されました。" });
            return;
        }

        const category = await Categories.findAll({
            where: { level: 1 },
            order: [["sort_order", "ASC"]],
        });

        res.status(200).json({ item, category });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

export default router;