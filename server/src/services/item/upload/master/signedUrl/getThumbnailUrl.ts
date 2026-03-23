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

export const getThumbnailUrl = async ({ itemId, userId, body, mode, item }: Params) => {
    const thumbnail = body.thumbnail;

    const now = Date.now();
    
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
    
    if (mode === "main" && !thumbnailUrl) {
        throw new AppError("THUMBNAILURL_NULL", 400);
    }

    return {
        thumbnailUrl,
        thumbnailSignedUrl
    };
};