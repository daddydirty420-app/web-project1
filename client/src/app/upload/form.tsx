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

type Props = {
    itemId: string;
    item: Item;
    category: Categories[];
};

type ItemImage = {
    uploaded: boolean;
    file: File | null;
    preview: string;
};

export default function Form({ itemId, item, category }: Props) {
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

    const [gender, setGender] = useState(item.gender_type ?? "");
    const [age, setAge] = useState(item.age_type ?? "");
    const [brand, setBrand] = useState(item.Brands?.name ?? "");

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
        </UploadUI>
    );
};