"use client";

import React, { useRef, useState } from "react";
import { Categories, Item } from "./type";
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

type Props = {
    itemId: string;
    item: Item;
    category: Categories[];
    hasShop: boolean;
};

type ItemImage = {
    uploaded: boolean;
    file: File | null;
    preview: string;
};

export default function Form({ itemId, item, category, hasShop }: Props) {
    const initialThumbnailPreview = item.Video?.thumbnail_url ?? null;
    const existingVideoUrl = item.Video?.converted_url ?? item.Video?.original_url ?? null;

    const [videoInput, setVideoInput] = useState<VideoInputValue>({
        videoFile: null,
        thumbnailFile: null,
        thumbnailPreview: initialThumbnailPreview,
        title: item.Video?.title ?? "",
        summary: item.Video?.summary ?? "",
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
        gender_type: item.gender_type ?? null,
        age_type: item.age_type ?? null,
    });

    const [brandValue, setBrandValue] = useState<BrandValue>({
        id: item.Brands?.id ?? null,
        name: item.Brands?.name ?? "",
    });

    const initialAttributesValue: AttributesValue = {
        all_inventory: item.attributes?.inventory?.current ?? 1,
        variants: item.attributes?.variants?.map((v) => ({
            _uiId: crypto.randomUUID(),
            color: v.color ?? null,
            size: v.size ?? null,
            image: null,
            inventory: v.inventory?.initial ?? 0,
        })) ?? [],
    };

    const initialAttributesImageUrlMap = new Map<string, string>();

    item.attributes.variants?.forEach((v, i) => {
        if (v.image_url && initialAttributesValue.variants[i]) {
            initialAttributesImageUrlMap.set(
                initialAttributesValue.variants[i]._uiId,
                v.image_url,
            );
        }
    });

    const [attributesValue, setAttributesValue] = useState<AttributesValue>(initialAttributesValue);

    const [attributesImageMap, setAttributesImageMap] = useState<Map<string, string>>(initialAttributesImageUrlMap);

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

    const upload = async () => {};

    const draft = async () => {};

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
            images={initialItemImage}
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
        </UploadUI>
    );
};