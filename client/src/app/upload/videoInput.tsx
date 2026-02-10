"use client";

import { InputStr, InputTitle, Textarea } from "@/components/inputForm";
import styles from "./upload.module.css";
import Image from "next/image";

export type VideoInputValue = {
    videoFile: File | null;
    thumbnailFile: File | null;
    thumbnailPreview: string | null;
    title: string;
    summary: string;
    videoUploaded: boolean;
    thumbnailUploaded: boolean;
};

type Props = {
    videoRef: React.RefObject<HTMLInputElement | null>;
    thumbnailRef: React.RefObject<HTMLInputElement | null>;
    value: VideoInputValue;
    onChange: (v: VideoInputValue) => void;
    existingVideoUrl: string | null;
};

export const VideoInput = ({ value, onChange, videoRef, thumbnailRef, existingVideoUrl }: Props) => {
    const handleChangeVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        onChange({
            ...value,
            videoFile: e.target.files[0],
            videoUploaded: false,
        });
    };

    const handleChangeThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        const preview = URL.createObjectURL(file);

        onChange({
            ...value,
            thumbnailFile: file,
            thumbnailPreview: preview,
        });
    };

    const handleChangeTitle = (title: string) => {
        onChange({
            ...value,
            title
        });
    };

    const handleChangeSummary = (summary: string) => {
        onChange({
            ...value,
            summary
        });
    };

    return (
        <>
        <div className={styles.imageInputDiv}>
            <div>
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

                {value.videoFile ? (
                    <video
                    src={URL.createObjectURL(value.videoFile)}
                    className={styles.videoPreview}
                    width={320}
                    controls
                    />
                ) : existingVideoUrl ? (
                    <video
                    src={existingVideoUrl}
                    className={styles.videoPreview}
                    width={320}
                    controls
                    />
                ) : null}
            </div>

            <div>
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
                src={value.thumbnailPreview || "/no-image(1x1).png"}
                alt="サムネイル"
                width={220}
                className={styles.preview}
                />
            </div>
        </div>
        
        <div className={styles.twoColumnWrapper}>
            <InputStr
            title="動画タイトル"
            type="text"
            value={value.title}
            onChange={handleChangeTitle}
            placeholder="動画のタイトル（50文字以内）"
            hissu
            maxLength={50}
            />
        
            <Textarea
            title="動画の概要"
            value={value.summary}
            onChange={handleChangeSummary}
            maxLength={500}
            placeholder="概要（500文字まで）"
            />
        </div>
        </>
    );
}