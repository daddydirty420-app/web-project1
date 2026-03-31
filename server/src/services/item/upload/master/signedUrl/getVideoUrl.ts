import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Item, Video } from "../../../../../models/index.js";
import { Body } from "../../../../../types/items/uploadBody.js";
import { UploadMode } from "../../putItem.service.js";
import { bucket, s3, s3Domain } from "../../../../../infra/aws/s3.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AppError } from "../../../../../errors.js";

type Params = {
    itemId: number;
    userId: number;
    body: Body;
    mode: UploadMode;
    item: InstanceType<typeof Item> & {
        Video?: InstanceType<typeof Video>;
    };
};

export const getVideoUrl = async ({ itemId, userId, body, mode, item }: Params) => {
    const video = body.video;

    const now = Date.now();

    // 動画署名付きURL生成
    let videoSignedUrl: string | null = null;
    let videoUrl: string | null = item.Video?.converted_url ?? item.Video?.original_url ?? null;
    
    if (video?.name && !video.uploaded) {
        const ext = video.name.split('.').pop();
        const originalKey = `video/original/${userId}/${itemId}_${now}_${ext}`;
    
        const videoCommand = new PutObjectCommand({
            Bucket: bucket,
            Key: originalKey,
            ContentType: video.type,
        });
    
        videoSignedUrl = await getSignedUrl(s3, videoCommand, { expiresIn: 60 });
    
        videoUrl = `${s3Domain}/${originalKey}`;
    }
    
    if (mode === "main" && !videoUrl) {
        throw new AppError("VIDEOURL_NULL", 400);
    }

    return {
        videoUrl,
        videoSignedUrl
    };
};