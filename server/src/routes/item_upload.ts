import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import multer from "multer";
import fs from "fs";
import { spawn } from "child_process";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { authenticateToken } from "../middleware/index.js";
import { Video, Item, User, Notification, Follow, ReccomendItem, ReccomendMonth, Sale, ItemShippingProfile, Categories, Brands, ShopInfo, ItemConditionOption, ShippingDayOption, ShippingServiceOption, TodouhukenOption, BrandAliases } from "../models/index.js";
import { AuthUser } from "../middleware/authMiddleware.js";
import sequelize from "../db.js";
import { Op } from "sequelize";
import { normalizeJapanese } from "../utils/normalizeJapanese.js";

interface AuthenticatedRequest extends Request {
    user?: AuthUser;
    file?: Express.Multer.File;
}

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

router.patch('/convert-video/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const currentUserId = req.user?.id;
    const videoId = req.params.id;

    try {
        const videoData = await Video.findByPk(videoId);
        if (!videoData) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        const originalUrl = videoData.original_url;
        if (!originalUrl) {
            res.status(400).json({ message: "original_urlがありません" });
            return;
        }

        const originalKey = originalUrl.replace(`${s3Domain}/`, '');

        // 拡張子を抽出
        let ext = originalKey.split('.').pop();
        if (!["mp4", "mov", "webm", "mkv"].includes(ext)) {
            ext = "mp4"; // 最終フォールバック
        }

        // 一時保存先
        const originalFilePath = `tmp/original_${videoId}_${now}.${ext}`;
        const convertedDir = `tmp/converted_${videoId}_${now}`;

        fs.mkdirSync("tmp", { recursive: true });

        const getObjectCommand = new GetObjectCommand({
            Bucket: bucket,
            Key: originalKey,
        });

        const s3Object = await s3.send(getObjectCommand);
        const whiteStream = fs.createWriteStream(originalFilePath);

        await new Promise<void>((resolve, reject) => {
            (s3Object.Body as any)
            .pipe(whiteStream)
            .on("finish", resolve)
            .on("error", reject);
        });

        await videoData.update({ status: "processing" });

        // 変換ディレクトリ作成
        fs.mkdirSync(convertedDir, { recursive: true });

        // ffmpegでHLS変換
        const ffmpeg = spawn("ffmpeg", [
            "-y",                       // ← 追加（既存ファイルを上書き）
            "-i", originalFilePath,
            "-map", "0:v:0",            // ← 追加（動画トラックを明示）
            "-map", "0:a:0?",           // ← 追加（音声はあれば使う）
            "-profile:v", "baseline",
            "-level", "3.0",
            "-start_number", "0",
            "-hls_time", "10",
            "-hls_playlist_type", "vod",
            "-hls_segment_filename", `${convertedDir}/seg_%03d.ts`, // ← 追加（名前が綺麗）
            "-f", "hls",
            `${convertedDir}/index.m3u8`
        ]);

        const timeout = setTimeout(async () => {
            console.error("ffmpeg timeout");
            ffmpeg.kill("SIGKILL");
            await videoData.update({ status: "failed" });
        }, 5 * 60 * 1000); // 5分

        ffmpeg.stderr.on("data", (data) => {
            console.error(`ffmpeg: ${data}`);
        });

        ffmpeg.on("close", async (code) => {
            clearTimeout(timeout);

            if (code !== 0) {
                console.error(`ffmpeg exited with code ${code}`);
                await videoData.update({ status: 'failed' });
                return;
            }

            try {
                const files = fs.readdirSync(convertedDir);

                if (files.length === 0) {
                    throw new Error("HLSファイルが生成されていません");
                }
            
                for (const f of files) {
                    const filePath = `${convertedDir}/${f}`;
                    
                    const contentType = f.endsWith(".ts")
                    ? "video/mp2t"
                    : f.endsWith(".m3u8")
                    ? "application/vnd.apple.mpegurl"
                    : "application/octet-stream";
                    
                    const uploadParams = {
                        Bucket: bucket,
                        Key: `video/converted/${currentUserId}/${videoId}/${f}`,
                        Body: fs.createReadStream(filePath),
                        ContentType: contentType,
                    };

                    await s3.send(new PutObjectCommand(uploadParams));
                }

                const convertedUrl = `${s3Domain}/video/converted/${currentUserId}/${videoId}/index.m3u8`;

                await videoData.update({
                    status: 'done',
                    converted_url: convertedUrl,
                });

                // 後処理
                fs.rmSync(originalFilePath, { force: true });
                fs.rmSync(convertedDir, { recursive: true, force: true });
            } catch (e) {
                console.error(e);
                await videoData.update({ status: "failed" });
            }
        });

        // 受付だけして即レス
        res.status(200).json({ message: "変換処理を開始しました" });
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
        const direct = await Brands.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${keyword}%`,
                },
            },
            order: [[sequelize.fn("length", sequelize.col("name")), "ASC"]],
            limit: 15,
        });

        let fromAlias = null;

        if (direct.length < 15) {
            fromAlias = await BrandAliases.findAll({
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
                include: [
                    {
                        model: Brands,
                        required: true,
                    },
                ],
                order: [[sequelize.fn("length", sequelize.col("name")), "ASC"]],
                limit: 15 - direct.length,
            });
        }

        const brandMap = new Map<number, typeof Brands>();

        for (const d of direct) {
            brandMap.set(d.id, d);
        }

        for (const alias of fromAlias) {
            if (alias.brand) {
                brandMap.set(alias.brand.id, alias.brand);
            }
        }

        const result = Array.from(brandMap.values());

        res.status(200).json({ brands: result });
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

        const allCondition = await ItemConditionOption.findAll({
            order: [["id", "ASC"]],
        });

        const allDay = await ShippingDayOption.findAll({
            order: [["id", "ASC"]],
        });

        const allService = await ShippingServiceOption.findAll({
            order: [["id", "ASC"]],
        });

        const allPlace = await TodouhukenOption.findAll({
            order: [["id", "ASC"]],
        });

        const me = await User.findByPk(item.seller_id, {
            attributes: ["id"],
            include: [
                {
                    model: ShopInfo,
                    required: false,
                },
            ],
        });

        const hasShop = !!me.ShopInfo;

        res.status(200).json({
            item,
            category,
            allCondition,
            hasShop,
            allDay,
            allService,
            allPlace
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

export default router;