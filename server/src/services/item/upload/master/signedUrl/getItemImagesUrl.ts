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

type SignedUrlWithIndex = {
    index: number;
    url: string;
};

export const getItemImagesUrl = async ({ itemId, userId, body, mode, item }: Params) => {
    const itemImages = body.itemImages;

    const now = Date.now();
    
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
    
    if (mode === "main" && finalImageUrls.length === 0) {
        throw new AppError("ITEMIMAGE_NULL", 400);
    }

    return {
        finalImageUrls,
        itemImageSignedUrls
    };
};