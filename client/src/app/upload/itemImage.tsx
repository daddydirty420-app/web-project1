"use client";

import Image from "next/image";
import styles from "./upload.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { InputTitle } from "@/components/inputForm";

export type ItemImage = {
    file: File | null;
    preview: string;
    uploaded: boolean;
};

type Props = {
    images: ItemImage[];
    onAdd: (files: FileList) => void;
    onRemove: (index: number) => void;
};

export default function ItemImage({ images, onAdd, onRemove }: Props) {
    return (
        <div className={styles.itemImageDiv}>
            <div className={styles.itemImageInputDiv}>
                <InputTitle title="商品画像（最大10枚まで）" hissu />
                    
                <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                    if (e.target.files) {
                        onAdd(e.target.files);
                        e.target.value = "";
                    }
                }}
                disabled={images.length >= 10}
                className={styles.itemImageInput}
                placeholder="商品画像をアップロード"
                required
                />
            </div>

            <div className={styles.itemImageListDiv}>
                {images.map((img, index) => (
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
                        onClick={() => onRemove(index)}
                        className={styles.itemImageRemoveIcon}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};