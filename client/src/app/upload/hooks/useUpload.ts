import { AttributesValue } from "../attributes";
import { BrandValue } from "../brandInput";
import { CategoryValue } from "../category";
import { ConditionValue } from "../condition";
import { GenderAgeValue } from "../genderAge";
import { ItemImageValue } from "../itemImage";
import { ItemNameDetailValue } from "../itemNameDetail";
import { MaterialValue } from "../material";
import { PriceValue } from "../price";
import { ShippingValue } from "../shipping";
import { Body } from "../types/uploadType";
import { VideoInputValue } from "../videoInput";

export type UploadMeta = {
    name?: string;
    type: string | null;
    uploaded: boolean;
};

export type UploadParams = {
    videoInput: VideoInputValue;
    itemImages: ItemImageValue[];
    itemNameDetail: ItemNameDetailValue;
    categoryValue: CategoryValue;
    genderAgeValue: GenderAgeValue;
    brandValue: BrandValue;
    attributesValue: AttributesValue;
    materialValue: MaterialValue;
    conditionValue: ConditionValue;
    shippingValue: ShippingValue;
    priceValue: PriceValue;

    resolveAttributesImage: (
        v: AttributesValue["colorVariants"][number]
    ) => UploadMeta | null;
};

export type SubmitType = {
    itemId: string;
    body: Body;
    accessToken: string;
};

type ValidationResult = {
    ok: boolean;
    message?: string;
};

export const useUpload = () => {

    const validateForDraft = (params: UploadParams): ValidationResult => {

        const totalRatio = params.materialValue.materials.reduce(
            (sum, m) => sum + (m.ratio ?? 0),
            0,
        );
        if (totalRatio > 100) {
            return { ok: false, message: "素材の割合が100%を超えています" };
        }

        const totalInventory = params.attributesValue.colorVariants.reduce(
            (sum, v) => sum + v.sizes.reduce(
                (sizeSum, s) => sizeSum + (s.inventory ?? 0), 0
            ),
            0,
        );

        if (totalInventory > params.attributesValue.all_inventory) {
            return { ok: false, message: "サイズの出品点数が合計点数を超過しています" };
        }

        return { ok: true };
    };
    
    const createBody = (params: UploadParams) => {
        const {
            videoInput,
            itemImages,
            itemNameDetail,
            categoryValue,
            genderAgeValue,
            brandValue,
            attributesValue,
            materialValue,
            conditionValue,
            shippingValue,
            priceValue,
            resolveAttributesImage,
        } = params;

        console.log({
            videoInput,
            itemImages,
            itemNameDetail,
            categoryValue,
            genderAgeValue,
            brandValue,
            attributesValue,
            materialValue,
            conditionValue,
            shippingValue,
            priceValue,
            resolveAttributesImage,
        });

        const itemImagesUpload: UploadMeta[] = itemImages.map(img => {
            if (!img.uploaded && img.file instanceof File) {
                return {
                    name: img.file.name,
                    type: img.file.type,
                    uploaded: false, // 新規アップロード
                };
            }

            const fileName = (img.preview ?? "").split("/").pop() || "unknown";

            return {
                name: fileName,
                type: null,
                uploaded: true,
            };
        });

        return {
            video: videoInput.videoUploaded ? {
                name: videoInput.videoFile?.name ?? "unknown",
                type: videoInput.videoFile?.type ?? null,
                uploaded: videoInput.videoUploaded,
            } : undefined,
            thumbnail: videoInput.thumbnailUploaded ? {
                name: videoInput.thumbnailFile?.name ?? "unknown",
                type: videoInput.thumbnailFile?.type ?? null,
                uploaded: videoInput.thumbnailUploaded,
            } : undefined,
            videoMeta: {
                title: videoInput.title,
                summary: videoInput.summary,
            },
            itemImages: itemImagesUpload,
            itemMeta: {
                name: itemNameDetail.name,
                detail: itemNameDetail.detail,
            },
            category: {
                id: categoryValue.id,
                name: categoryValue.name,
                parent_id: categoryValue.parent_id,
                level: categoryValue.level,
            },
            genderAge: {
                gender: genderAgeValue.gender_type,
                age: genderAgeValue.age_type,
            },
            brand: {
                id: brandValue.id,
                name: brandValue.name,
            },
            attributes: {
                allInventory: attributesValue.all_inventory,
                colorVariants: attributesValue.colorVariants.map(v => ({
                    uiId: v._uiId,
                    color: v.color,
                    image: resolveAttributesImage(v),
                    sizes: v.sizes.map(s => ({
                        size: s.size,
                        inventory: s.inventory,
                    })),
                })),
                materials: materialValue.materials.map(m => ({
                    name: m.name,
                    ratio: m.ratio,
                })),
            },
            condition: {
                id: conditionValue.id,
                name: conditionValue.name,
            },
            shipping: {
                day: shippingValue.day_id,
                service: shippingValue.service_id,
                place: shippingValue.place_id,
                freeText: shippingValue.free_text,
            },
            price: priceValue.price,
        };
    };

    const submitDraft = async ({ itemId, body, accessToken }: SubmitType) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-upload-draft/${itemId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        console.log("ok:", res.ok);
        console.log("data1:", data);

        if (!res.ok) {
            console.error(data.message);
            return { ok: false, data };
        }

        return { ok: true, data };
    };

    return {
        validateForDraft,
        createBody,
        submitDraft,
    };
};