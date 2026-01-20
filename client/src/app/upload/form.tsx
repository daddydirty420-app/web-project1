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

    const initialItemImage = ([]).map((url) => ({
        file: null,
        preview: url,
        uploaded: false,
    }));

    const [itemImages, setItemImages] = useState<ItemImage[]>(initialItemImage);

    const videoRef = useRef<HTMLInputElement | null>(null);
    const thumbnailRef = useRef<HTMLInputElement | null>(null);

    const router = useRouter();

    const handleChangeItemImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);

        const newImages = files.slice(0, 10 - itemImages.length).map(f => ({
            file: f,
            preview: URL.createObjectURL(f),
            uploaded: true,
        }));

        setItemImages(prev => [...prev, ...newImages]);
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

            <div className={styles.itemImageDiv}>
                <div className={styles.itemImageInputDiv}>
                    <InputTitle title="商品画像（最大10枚まで）" hissu />
                    
                    <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleChangeItemImage}
                    disabled={itemImages.length >= 10}
                    className={styles.itemImageInput}
                    placeholder="商品画像をアップロード"
                    required
                    />
                </div>

                <div className={styles.itemImageListDiv}>
                    {itemImages.map((img, index) => (
                        <div key={index} className={styles.itemImagePreviewDiv}>
                            <Image
                            src={img.preview}
                            alt={`商品画像-${index}`}
                            width={100}
                            height={100}
                            className={styles.itemImagePreview}
                            />

                            <FontAwesomeIcon
                            icon={faTrashCan}
                            onClick={() => removeItemImage(index)}
                            className={styles.itemImageRemoveIcon}
                            />
                        </div>
                    ))}
                </div>
            </div>

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