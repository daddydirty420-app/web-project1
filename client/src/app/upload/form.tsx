"use client";

import React, { useRef, useState } from "react";
import { Item } from "./type";
import styles from "./upload.module.css";
import UploadUI from "./uploadUI";
import { useRouter } from "next/navigation";
import { InputStr, InputTitle, Textarea } from "@/components/inputForm";
import Image from "next/image";

type Props = {
    itemId: string;
    item: Item;
};

export default function Form({ itemId, item }: Props) {
    const [video, setVideo] = useState<File | string | undefined>(item.Video?.converted_url ?? item.Video?.original_url ?? "");
    const [videoUpload, setVideoUpload] = useState<boolean>(false);

    const [thumbnail, setThumbnail] = useState<File | string | undefined>(item.Video?.thumbnail_url ?? "");
    const [thumbnailPreview, setThumbnailPreview] = useState(item.Video?.thumbnail_url);
    const [thumbnailUpload, setThumbnailUpload] = useState<boolean>(false);

    const [videoTitle, setVideoTitle] = useState(item.Video?.title ?? "");
    const [videoSummary, setVideoSummary] = useState(item.Video?.summary ?? "");

    const [itemName, setItemName] = useState(item.name);

    const videoRef = useRef<HTMLInputElement | null>(null);
    const thumbnailRef = useRef<HTMLInputElement | null>(null);

    const router = useRouter();

    const handleChangeVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setVideo(selectedFile);
            setVideoUpload(true);
        }
    };

    const handleChangeThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setThumbnail(selectedFile);
            setThumbnailPreview(URL.createObjectURL(selectedFile));
            setThumbnailUpload(true);
        }
    };

    const upload = async () => {};

    const draft = async () => {};

    return (
        <UploadUI title="商品をアップロード">
            <h2 className={styles.subtitle}>動画をアップロード</h2>

            <div className={styles.imageInputDiv}>
                <InputTitle title="動画をアップロード" hissu />
                <input
                type="file"
                accept="video/*"
                onChange={handleChangeVideo}
                className={styles.imageInput}
                placeholder="動画ファイルをアップロード"
                ref={videoRef}
                />
                <p className={styles.centerSmall}>※アップロードに少々お時間がかかります。</p>

                <InputTitle title="サムネイルをアップロード" hissu />
                <input
                type="file"
                accept="image/*"
                onChange={handleChangeThumbnail}
                className={styles.imageInput}
                placeholder="画像ファイルをアップロード"
                ref={thumbnailRef}
                required
                />
                <Image
                src={thumbnailPreview || "/no-image(1x1).png"}
                alt="サムネイル"
                width={120}
                height={120}
                className={styles.preview}
                />
            </div>

            <InputStr
            title="動画タイトル"
            type="text"
            value={videoTitle}
            onChange={setVideoTitle}
            placeholder="動画のタイトル（50文字以内）"
            hissu
            maxLength={50}
            />

            <Textarea
            title="動画の概要"
            value={videoSummary}
            onChange={setVideoSummary}
            maxLength={500}
            placeholder="概要（500文字まで）"
            hissu
            />

            <h2 className={styles.subtitle}>商品をアップロード</h2>


        </UploadUI>
    );
};