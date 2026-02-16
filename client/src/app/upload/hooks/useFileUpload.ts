import { useCallback } from "react";
import toast from "react-hot-toast";
import { ItemImageValue } from "../itemImage";
import { AttributesValue } from "../attributes";

type VideoArgs = {
    accessToken: string;
    videoId?: string | number;
    videoFile: File | null;
    videoSignedUrl?: string;
};

type ThumbnailArgs = {
    thumbnailFile: File | null;
    thumbnailSignedUrl?: string;
};

type ItemImageArgs = {
    itemImageFiles: ItemImageValue[];
    itemImageSignedUrls: string[];
};

type AttributesImageArgs = {
    attributesValue: AttributesValue;
    signedUrlMap: Record<string, string> | null | undefined;
}

export const useFileUpload = () => {
    // 動画
    const videoUploadAndConvert = useCallback(
        async ({ accessToken, videoFile, videoSignedUrl, videoId }: VideoArgs): Promise<boolean> => {

            if (!videoSignedUrl || !(videoFile instanceof File) || !videoId) {
                return true;
            }

            // s3直接アップロード
            const uploadRes = await fetch(videoSignedUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": videoFile.type,
                },
                body: videoFile,
            });

            if (!uploadRes.ok) {
                toast.error("動画のアップロードに失敗しました");
                return false;
            }

            // ffmpeg変換
            const convertRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-upload/convert-video/${videoId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = await convertRes.json();

            if (!convertRes.ok) {
                console.warn(data.message);
                return true;
            }

            console.log(data.message);
            return true;
        },
        []
    );

    // サムネイル
    const thumbnailUpload = useCallback(
        async ({ thumbnailFile, thumbnailSignedUrl }: ThumbnailArgs): Promise<boolean> => {
            if (!thumbnailSignedUrl || !(thumbnailFile instanceof File)) {
                return true;
            }

            const thumbnailRes = await fetch(thumbnailSignedUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": thumbnailFile.type,
                },
                body: thumbnailFile,
            });

            if (!thumbnailRes.ok) {
                toast.error("サムネイルのアップロードに失敗しました");
                return false;
            }

            return true;
        },
        []
    );

    // 商品画像
    const itemImageUpload = useCallback(
        async ({ itemImageFiles, itemImageSignedUrls }: ItemImageArgs): Promise<boolean> => {
            if (itemImageSignedUrls.length === 0) {
                return true;
            }

            const uploadItemImages = itemImageFiles.filter(
                (img): img is ItemImageValue & { file: File } =>
                    !img.uploaded && img.file instanceof File
            );

            const uploadPromises = itemImageSignedUrls.map((signedUrl, i) => {
                const target = uploadItemImages[i];

                if (!target) {
                    console.warn(`画像${i + 1}枚目が見つかりません。スキップします。`);
                    return Promise.resolve();
                }

                return fetch(signedUrl, {
                    method: "PUT",
                    headers: {
                        "Content-Type": target.file.type,
                    },
                    body: target.file,
                }).then(res => {
                    if (!res.ok) {
                        throw new Error(`画像${i + 1}枚目のアップロードに失敗`);
                    }
                });
            });

            try {
                await Promise.all(uploadPromises);
                return true;
            } catch (err) {
                console.error(err);
                toast.error("商品画像のアップロードに失敗しました");
                return false;
            }
        },
        []
    );

    // attributes.image
    const attributesImageUpload = useCallback(
        async ({ attributesValue, signedUrlMap }: AttributesImageArgs): Promise<boolean> => {
            if (!signedUrlMap || Object.keys(signedUrlMap).length === 0) {
                return true;
            }

            const uploadTarget = attributesValue.colorVariants
            .map(v => v.image)
            .filter((img): img is File => img instanceof File);

            const imageUrls = Object.values(signedUrlMap);

            try {
                await Promise.all(imageUrls.map(async (signedUrl, i) => {
                    console.log("index, signedUrl:", i, signedUrl);
                    const target = uploadTarget[i];

                    if (!target) {
                        console.warn(`画像${i + 1}枚目が見つかりません。スキップします。`);
                        return;
                    }

                    const res = await fetch(signedUrl, {
                        method: "PUT",
                        headers: {
                            "Content-Type": target.type,
                        },
                        body: target,
                    });

                    if (!res.ok) {
                        console.log(res.status, res.statusText);
                        throw new Error(`属性画像 ${i + 1}枚目のアップロードに失敗`);
                    }
                }));

                return true;
            } catch (err) {
                console.error(err);
                toast.error("商品画像のアップロードに失敗しました");
                return false;
            }
        },
        []
    );

    return {
        videoUploadAndConvert,
        thumbnailUpload,
        itemImageUpload,
        attributesImageUpload,
    };
}