"use client";

import React, { useRef, useState } from "react";
import { Categories, Item, ItemConditionOption, ShippingDayOption, ShippingServiceOption, TodouhukenOption } from "./type";
import styles from "./upload.module.css";
import UploadUI from "./uploadUI";
import { useRouter } from "next/navigation";
import VideoInput, { VideoInputValue } from "./videoInput";
import ItemImage from "./itemImage";
import ItemNameDetail, { ItemNameDetailValue } from "./itemNameDetail";
import Category, { CategoryValue } from "./category";
import GenderAge, { GenderAgeValue } from "./genderAge";
import BrandInput, { BrandValue } from "./brandInput";
import AttributesInput, { AttributesValue } from "./attributes";
import MaterialInput, { MaterialValue } from "./material";
import ConditionInput, { ConditionValue } from "./condition";
import ShippingInput, { ShippingValue } from "./shipping";
import PriceInput, { PriceValue } from "./price";
import toast from "react-hot-toast";
import { refreshToken } from "@/lib/refreshToken";

type Props = {
    itemId: string;
    item: Item;
    category: Categories[];
    allCondition: ItemConditionOption[];
    allDay: ShippingDayOption[];
    allService: ShippingServiceOption[];
    allPlace: TodouhukenOption[];
    hasShop: boolean;
};

type ItemImage = {
    uploaded: boolean;
    file: File | null;
    preview: string;
};

type ItemImageUpload = {
    name: string;
    type: string | null;
    uploaded: boolean;
};

export default function Form({
    itemId,
    item,
    category,
    allCondition,
    allDay,
    allService,
    allPlace,
    hasShop
}: Props) {
    const initialThumbnailPreview = item.Video?.thumbnail_url ?? null;
    const existingVideoUrl = item.Video?.converted_url ?? item.Video?.original_url ?? null;

    const [videoInput, setVideoInput] = useState<VideoInputValue>({
        videoFile: null,
        thumbnailFile: null,
        thumbnailPreview: initialThumbnailPreview,
        title: item.Video?.title ?? "",
        summary: item.Video?.summary ?? "",
        videoUploaded: !!existingVideoUrl,
        thumbnailUploaded: !!initialThumbnailPreview,
    });

    const [itemNameDetail, setItemNameDetail] = useState<ItemNameDetailValue>({
        name: item.name ?? "",
        detail: item.detail ?? "",
    });

    const [categoryValue, setCategoryValue] = useState<CategoryValue>({
        id: item.Category?.id ?? "",
        name: item.Category?.name ?? "",
        parent_id: item.Category?.parent_id ?? null,
        level: item.Category?.level ?? 0,
    });

    const [categoryConstraint, setCategoryConstraint] = useState<{
        allowed_gender: "men" | "women" | "unisex" | null;
        allowed_age: "adult" | "kids" | "both" | null;
    } | null>(
        item.Category ? {
            allowed_gender: item.Category?.allowed_gender ?? null,
            allowed_age: item.Category?.allowed_age ?? null,
        } : null
    );

    const [genderAgeValue, setGenderAgeValue] = useState<GenderAgeValue>({
        gender_type: item.gender_type ?? "unisex",
        age_type: item.age_type ?? "both",
    });

    const [brandValue, setBrandValue] = useState<BrandValue>({
        id: item.Brands?.id ?? null,
        name: item.Brands?.name ?? "",
    });

    const initialAttributesValue: AttributesValue = {
        all_inventory: item.attributes?.inventory?.current ?? 1,
        colorVariants: item.attributes?.colorVariants?.map((v) => ({
            _uiId: crypto.randomUUID(),
            color: v.color ?? null,
            image: null,
            sizes: (v.sizes ?? []).map((s) => ({
                size: s.size ?? null,
                inventory: s.inventory.current ?? 1,
            })),
        })) ?? [],
    };

    const initialAttributesImageUrlMap = new Map<string, string>();

    item.attributes?.colorVariants?.forEach((v, i) => {
        if (v.image_url && initialAttributesValue.colorVariants[i]) {
            initialAttributesImageUrlMap.set(
                initialAttributesValue.colorVariants[i]._uiId,
                v.image_url,
            );
        }
    });

    const [attributesValue, setAttributesValue] = useState<AttributesValue>(initialAttributesValue);

    const [attributesImageMap, setAttributesImageMap] = useState<Map<string, string>>(initialAttributesImageUrlMap);

    const [materialValue, setMaterialValue] = useState<MaterialValue>({
        material: item.attributes?.material ?? [],
    });

    const [conditionValue, setConditionValue] = useState<ConditionValue>({
        id: item.ItemConditionOption?.id ?? null,
        name: item.ItemConditionOption?.name ?? "",
    });

    const shipping = item.ItemShippingProfile;

    const [shippingValue, setShippingValue] = useState<ShippingValue>({
        day_id: shipping?.ShippingDayOption?.id ?? null,
        day_name: shipping?.ShippingDayOption?.name ?? null,
        service_id: shipping?.ShippingServiceOption?.id ?? null,
        service_name: shipping?.ShippingServiceOption?.name ?? null,
        place_id: shipping?.TodouhukenOption?.id ?? null,
        place_name: shipping?.TodouhukenOption?.name ?? null,
        free_text: shipping?.shipping_service_free_text ?? null,
    });

    const [priceValue, setPriceValue] = useState<PriceValue>({
        price: item.price && !Number.isNaN(item.price)
        ? String(item.price)
        : "",
    });

    const initialItemImage = (item.image_url ?? []).map((url) => ({
        file: null,
        preview: url,
        uploaded: true,
    }));

    const [itemImages, setItemImages] = useState<ItemImage[]>(initialItemImage);

    const videoRef = useRef<HTMLInputElement | null>(null);
    const thumbnailRef = useRef<HTMLInputElement | null>(null);

    const router = useRouter();

    const addItemImage = (files: FileList) => {
        const newImages = Array.from(files).slice(0, 10 - itemImages.length).map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            uploaded: false,
        }));

        setItemImages((prev) => [...prev, ...newImages]);
    };

    const removeItemImage = (index: number) => {
        setItemImages(prev => prev.filter((_, i) => i !== index));
    };

    const upload = async () => {
        const required = {
            videoFile: {
                ok: !!videoInput.videoFile,
                message: "動画ファイルを選択してください",
            },
            thumbnailFile: {
                ok: !!videoInput.thumbnailFile,
                message: "サムネイルを選択してください",
            },
            title: {
                ok: videoInput.title.trim().length > 0,
                message: "動画タイトルを入力してください",
            },
            itemImages: {
                ok: itemImages.length > 0,
                message: "商品画像を選択してください",
            },
            name: {
                ok: itemNameDetail.name.trim().length > 0,
                message: "商品名を入力してください",
            },
            category: {
                ok: !!categoryValue.id,
                message: "カテゴリーを選択してください",
            },
            gender_type: {
                ok: !!genderAgeValue.gender_type,
                message: "着用対象（性別）を選択してください",
            },
            age_type: {
                ok: !!genderAgeValue.age_type,
                message: "着用対象（年齢）を選択してください",
            },
            all_inventory: {
                ok: attributesValue.all_inventory > 0,
                message: "出品点数を1点以上入力してください",
            },
            condition: {
                ok: !!conditionValue.id,
                message: "商品の状態を選択してください",
            },
            shipping_day: {
                ok: !!shippingValue.day_id,
                message: "発送までの日数を選択してください",
            },
            shipping_service: {
                ok: !!shippingValue.service_id,
                message: "配送方法を選択してください",
            },
            shipping_place: {
                ok: !!shippingValue.place_id,
                message: "発送元地域を選択してください",
            },
            price: {
                ok: priceValue.price.trim().length > 0
                && !Number.isNaN(Number(priceValue.price))
                && Number(priceValue.price) >= 300
                && Number(priceValue.price) <= 1000000,
                message: "価格を300~1,000,000円の間で設定してください",
            },
        };

        const errors = Object.values(required)
        .filter(r => !r.ok)
        .map(r => r.message);

        if (errors.length) {
            toast.error(errors[0]);
            console.log("バリデーションエラー：", errors);
            return;
        }
    };

    const draft = async () => {
        let itemImagesUpload: ItemImageUpload[] = [];

        if (itemImages.length > 0) {
            itemImagesUpload = itemImages.map(img => {
                if (!img.uploaded && img.file instanceof File) {
                    return {
                        name: img.file!.name,
                        type: img.file!.type,
                        uploaded: false, // 新規アップロード
                    };
                }

                const fileName = (img.preview ?? "").split("/").pop() || "unknown";

                return {
                    name: fileName,
                    type: null,
                    uploaded: true,
                }
            });
        }

        const resolveAttributesImage = (v: typeof attributesValue.colorVariants[number]) => {
            if (v.image) {
                return {
                    name: v.image.name,
                    type: v.image.type,
                    uploaded: false,
                };
            }

            const existingUrl = initialAttributesImageUrlMap.get(v._uiId);
            if (existingUrl) {
                return {
                    name: existingUrl.split("/").pop(),
                    type: null,
                    uploaded: true,
                };
            }

            return null;
        };

        const body = {
            video: {
                name: videoInput.videoFile?.name,
                type: videoInput.videoFile?.type,
                uploaded: videoInput.videoUploaded,
            },
            thumbnail: {
                name: videoInput.thumbnailFile?.name,
                type: videoInput.thumbnailFile?.type,
                uploaded: videoInput.thumbnailUploaded,
            },
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
                        inventory: s.inventory
                    })),
                })),
                material: materialValue.material,
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

        try {
            const accessToken = await refreshToken();
                        
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-upload-draft/${itemId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data.message);
                toast.error("下書き保存に失敗しました");
                return;
            }

            // 動画アップロード
            if (data.videoSignedUrl && videoInput.videoFile instanceof File) {
                const videoRes = await fetch(data.videoSignedUrl, {
                    method: "PUT",
                    headers: {
                        "Content-Type": videoInput.videoFile.type,
                    },
                    body: videoInput.videoFile,
                });

                if (!videoRes.ok) {
                    toast.error("動画のアップロードに失敗しました");
                    return;
                } else {
                    // ffmpeg変換
                    const convertRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-upload/convert-video/${item.Video?.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                    });

                    const data = await convertRes.json();

                    if (convertRes.ok) {
                        console.log(data.message);
                    } else {
                        console.warn(data.message);
                    }
                }
            }

            // サムネイルアップロード
            if (data.thumbnailSignedUrl && videoInput.thumbnailFile instanceof File) {
                const thumbnailRes = await fetch(data.thumbnailSignedUrl, {
                    method: "PUT",
                    headers: {
                        "Content-Type": videoInput.thumbnailFile.type,
                    },
                    body: videoInput.thumbnailFile,
                });

                if (!thumbnailRes.ok) {
                    toast.error("サムネイルのアップロードに失敗しました");
                    return;
                }
            }

            // 商品画像アップロード
            if (data.itemImageSignedUrls.length > 0) {
                const uploadItemImages = itemImages.filter(
                    img => !img.uploaded && img.file instanceof File
                );

                const uploadPromises = data.itemImageSignedUrls.map((signedUrl, i) => {
                    const target = uploadItemImages[i];

                    if (!target || !(target.file instanceof File)) {
                        console.warn(`画像${i + 1}枚目が見つかりません。スキップします。`);
                        return Promise.resolve();
                    }

                    const file = target.file;

                    return fetch(signedUrl, {
                        method: "PUT",
                        headers: {
                            "Content-Type": file.type,
                        },
                        body: file,
                    }).then(res => {
                        if (!res.ok) {
                            throw new Error(`画像${i + 1}枚目のアップロードに失敗`);
                        }
                    });
                });

                try {
                    await Promise.all(uploadPromises);
                } catch (err) {
                    console.error(err);
                    toast.error("商品画像のアップロードに失敗しました");
                    return;
                }
            }

            // attributes.imagesアップロード
            const hasAttributesImages = Object.keys(data.attributesImageSignedUrls).length > 0;

            if (hasAttributesImages) {
                const uploadImages = attributesValue.colorVariants
                .map(v => v.image)
                .filter((img): img is File => img instanceof File);

                const signedUrlMap = data.attributesImageSignedUrls as Record<string, string>;
                const imageUrls = Object.values(signedUrlMap);

                await Promise.all(imageUrls.map(async (signedUrl, i) => {
                    const target = uploadImages[i];

                    if (!target || !(target instanceof File)) {
                        console.warn(`画像${i + 1}枚目が見つかりません。スキップします。`);
                        return;
                    }

                    const uploadRes = await fetch(signedUrl, {
                        method: "PUT",
                        headers: {
                            "Content-Type": target.type,
                        },
                        body: target,
                    });

                    if (!uploadRes.ok) {
                        toast.error("商品画像のアップロードに失敗しました");
                        return;
                    }
                }));
            }

            toast.success("下書き保存しました");
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    return (
        <UploadUI title="商品をアップロード">
            <h2 className={styles.subtitle}>動画をアップロード</h2>

            <VideoInput
            value={videoInput}
            onChange={setVideoInput}
            videoRef={videoRef}
            thumbnailRef={thumbnailRef}
            existingVideoUrl={existingVideoUrl}
            />

            <h2 className={styles.subtitle}>商品をアップロード</h2>

            <ItemImage
            images={itemImages}
            onAdd={addItemImage}
            onRemove={removeItemImage}
            />

            <ItemNameDetail
            value={itemNameDetail}
            onChange={setItemNameDetail}
            />

            <Category
            level1List={category}
            value={categoryValue}
            onChange={setCategoryValue}
            onConstraintChange={setCategoryConstraint}
            />

            <GenderAge
            value={genderAgeValue}
            onChange={setGenderAgeValue}
            categoryConstraint={categoryConstraint}
            />

            <BrandInput
            value={brandValue}
            onChange={setBrandValue}
            />

            {hasShop && (
                <AttributesInput
                value={attributesValue}
                onChange={setAttributesValue}
                imageUrlMap={attributesImageMap}
                />
            )}

            <MaterialInput
            value={materialValue}
            onChange={setMaterialValue}
            />

            <ConditionInput
            allCondition={allCondition}
            value={conditionValue}
            onChange={setConditionValue}
            />

            <h2 className={styles.subtitle}>配送について</h2>

            <ShippingInput
            allDay={allDay}
            allService={allService}
            allPlace={allPlace}
            value={shippingValue}
            onChange={setShippingValue}
            />

            <h2 className={styles.subtitle}>価格</h2>

            <PriceInput
            value={priceValue}
            onChange={setPriceValue}
            />
                
            <button
            type="button"
            className={styles.uploadButton}
            onClick={upload}
            >
                出品する
            </button>

            <button
            type="button"
            className={styles.draftButton}
            onClick={draft}
            >
                下書き保存する
            </button>
        </UploadUI>
    );
};