import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Item, Video } from "../../../../../models/index.js";
import { Body } from "../../../../../types/items/uploadBody.js";
import { bucket, s3, s3Domain } from "../../../../../infra/aws/s3.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type Params = {
    itemId: number;
    userId: number;
    body: Body;
    item: InstanceType<typeof Item> & {
        Video?: InstanceType<typeof Video>;
    };
};

export const getAttributesImagesUrl = async ({ itemId, userId, body, item }: Params) => {
    const attributes = body.attributes;

    const now = Date.now();
    
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
        const ext = v.image?.name.split('.').pop();
        const key = `attributes/${userId}/${itemId}_${v.uiId}_${now}_${ext}`;
            
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

    return {
        finalAttributesImageUrls,
        attributesImageSignedUrls
    };
};