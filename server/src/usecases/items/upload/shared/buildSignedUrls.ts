import { s3Domain } from "../../../../infra/aws/s3.js";
import { SignedUrlWithIndex } from "../../../../infra/aws/type.js";
import { Item } from "../../../../models/index.js";
import { createVideoPresignedPost, generateSignedUrl } from "../../../../utils/s3/index.js";
import { ItemUploadBody } from "../../../../validators/body/items.js";

type Params = {
    itemId: number;
    userId: number;
    item: InstanceType<typeof Item>;
    body: ItemUploadBody;
};

export const buildSignedUrls = async ({ itemId, userId, item, body }: Params) => {
    const { video, thumbnail, itemImages, attributes } = body;

    const now = Date.now();

    // 動画署名付きURL生成
    let videoSignedUrl: Awaited<ReturnType<typeof createVideoPresignedPost>> | null = null;
    let videoUrl: string | null = item.Video?.converted_url ?? item.Video?.original_url ?? null;

    if (video?.name && !video.uploaded && video.type) {
        const ext = video.name.split(".").pop();
        const originalKey = `video/original/${userId}/${itemId}_${now}_${ext}`;

        videoSignedUrl =
            (await createVideoPresignedPost({
                key: originalKey,
                contentType: video.type,
                contentLengthRange: 500 * 1024 * 1024,
            })) ?? null;

        videoUrl = `${s3Domain}/${originalKey}`;
    }

    // サムネイル署名付きURL生成
    let thumbnailSignedUrl: string | null = null;
    let thumbnailUrl: string | null = item.Video?.thumbnail_url ?? null;

    if (thumbnail?.name && !thumbnail.uploaded && thumbnail.type) {
        const ext = thumbnail.name.split(".").pop();
        const key = `thumbnail/${userId}/${itemId}_${now}_${ext}`;

        thumbnailSignedUrl = await generateSignedUrl({ key, contentType: thumbnail.type });

        thumbnailUrl = `${s3Domain}/${key}`;
    }

    // 商品画像署名付きURL生成
    const existingImages = Array.isArray(item.image_url) ? item.image_url : [];

    let itemImageSignedUrls: SignedUrlWithIndex[] = [];
    let newUploadedUrls: string[] = []; // 新規用
    let finalImageUrls: string[] = []; // DB保存用

    await Promise.all(
        (itemImages ?? []).map(async (img, index) => {
            if (!img || img.uploaded || !img.type) return;

            const ext = img.name.split(".").pop();
            const key = `item-image/${userId}/${itemId}_${index}_${now}_${ext}`;

            const signedUrl = await generateSignedUrl({ key, contentType: img.type });

            itemImageSignedUrls[index] = {
                index,
                url: signedUrl,
            };

            itemImageSignedUrls = itemImageSignedUrls.filter((v): v is SignedUrlWithIndex => v != null);

            newUploadedUrls[index] = `${s3Domain}/${key}`;
        }),
    );

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

    // attributes.image署名付きURL生成
    const existingVariants = Array.isArray(item.attributes?.colorVariants) ? item.attributes.colorVariants : [];

    const existingVariantMap = new Map<string, string>();

    existingVariants.forEach((variant: any) => {
        if (variant.uiId && variant.image_url) {
            existingVariantMap.set(variant.uiId, variant.image_url);
        }
    });

    let attributesImageSignedUrls: Record<string, string> = {};
    let attributesImageUrls: Record<string, string> = {};

    const attributesTargets = attributes.colorVariants.filter((v) => v.image && v.image.name && !v.image.uploaded);

    await Promise.all(
        attributesTargets.map(async (v) => {
            if (!v.image || !v.image.type) return;

            const ext = v.image?.name.split(".").pop();
            const key = `attributes/${userId}/${itemId}_${v.uiId}_${now}_${ext}`;

            const signedUrl = await generateSignedUrl({ key, contentType: v.image?.type });

            attributesImageSignedUrls[v.uiId] = signedUrl;
            attributesImageUrls[v.uiId] = `${s3Domain}/${key}`;
        }),
    );

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
        videoSignedUrl,
        videoUrl,
        thumbnailSignedUrl,
        thumbnailUrl,
        itemImageSignedUrls,
        finalImageUrls,
        attributesImageSignedUrls,
        finalAttributesImageUrls,
    };
};
