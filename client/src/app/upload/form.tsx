"use client";

import React, { useRef, useState } from "react";
import { Categories, Item } from "./type";
import styles from "./upload.module.css";
import UploadUI from "./uploadUI";
import { useRouter } from "next/navigation";
import { InputStr, InputTitle, Textarea } from "@/components/inputForm";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import VideoInput, { VideoInputValue } from "./videoInput";
import ItemImage from "./itemImage";

type Props = {
    itemId: string;
    item: Item;
    category: Categories;
};

type ItemImage = {
    uploaded: boolean;
    file: File | null;
    preview: string;
};

export default function Form({ itemId, item }: Props) {
    const initialThumbnailPreview = item.Video?.thumbnail_url ?? null;
    const existingVideoUrl = item.Video?.converted_url ?? item.Video?.original_url ?? null;

    const [videoInput, setVideoInput] = useState<VideoInputValue>({
        videoFile: null,
        thumbnailFile: null,
        thumbnailPreview: initialThumbnailPreview,
        title: item.Video?.title ?? "",
        summary: item.Video?.summary ?? "",
    });

    const [itemName, setItemName] = useState(item.name ?? "");
    const [detail, setDetail] = useState(item.detail ?? "");

    const [category, setCategory] = useState(item.Category?.name ?? "");
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

            <InputStr
            title="商品名"
            type="text"
            value={itemName}
            onChange={setItemName}
            placeholder="商品名（50文字以内）"
            hissu
            maxLength={50}
            />

            <Textarea
            title="商品の詳細"
            value={detail}
            onChange={setDetail}
            maxLength={500}
            placeholder="詳細な商品情報（最大500文字まで）"
            />


        </UploadUI>
    );
};