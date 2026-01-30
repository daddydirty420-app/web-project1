"use client";

import { InputStr, Textarea } from "@/components/inputForm";
import styles from "./upload.module.css";

export type ItemNameDetailValue = {
    name: string;
    detail: string;
};

type Props = {
    value: ItemNameDetailValue;
    onChange: (v: ItemNameDetailValue) => void;
};

export default function ItemNameDetail({ value, onChange }: Props) {
    return (
        <div className={styles.twoColumnWrapper}>
            <InputStr
            title="商品名"
            type="text"
            value={value.name}
            onChange={(val) => onChange({
                ...value,
                name: val
            })}
            placeholder="商品名（50文字以内）"
            maxLength={50}
            hissu
            />
        
            <Textarea
            title="商品の詳細"
            value={value.detail}
            onChange={(val) => onChange({
                ...value,
                detail: val
            })}
            maxLength={500}
            placeholder="詳細な商品情報（最大500文字まで）"
            />
        </div>
    );
}