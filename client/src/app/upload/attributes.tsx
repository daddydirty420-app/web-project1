"use client";

import { useEffect, useMemo, useState } from "react";
import CStyles from "./upload.module.css";
import styles from "./attributesCard.module.css";
import { InputTitle } from "@/components/inputForm";
import Image from "next/image";
import { X } from "lucide-react";

export type AttributesValue = {
    all_inventory: number;
    variants: Array<{
        _uiId: string;
        color: string | null;
        size: string | null;
        image: File | null;
        inventory: number;
    }>;
};

type Props = {
    value: AttributesValue;
    onChange: (v: AttributesValue) => void;
    imageUrlMap: Map<string, string>;
};

export default function AttributesInput({ value, onChange, imageUrlMap }: Props) {
    const [showVariants, setShowVariants] = useState(false);

    const previewMap = useMemo(() => {
        const map = new Map<string, string>();

        value.variants.forEach((variant) => {
            if (variant.image) {
                map.set(
                    variant._uiId,
                    URL.createObjectURL(variant.image)
                );
            }
        });

        return map;
    }, [value.variants]);

    useEffect(() => {
        if (value.variants.length > 0) {
            setShowVariants(true);
        }
    }, [value.variants.length]);

    useEffect(() => {
        return () => {
            previewMap.forEach((url) => {
                URL.revokeObjectURL(url);
            });
        };
    }, [previewMap]);

    const handleAllInventory = (num: number) => {
        onChange({
            ...value,
            all_inventory: num,
        });

        if (num > 1 && value.variants.length === 0) {
            setShowVariants(true);
            onChange({
                ...value,
                all_inventory: num,
                variants: [createEnptyVariant()],
            });
        }
    };

    const createEnptyVariant = () => ({
        _uiId: crypto.randomUUID(),
        color: null,
        size: null,
        size_label: null,
        image: null,
        inventory: 0,
    });

    const handleChangeCardImage = (file: File, uiId: string) => {
        onChange({
            ...value,
            variants: value.variants.map((v) => 
                v._uiId === uiId ? { ...v, image: file } : v
            ),
        });
    };

    const handleChangeVariantColor = (uiId: string, color: string) => {
        onChange({
            ...value,
            variants: value.variants.map((v) => 
                v._uiId === uiId ? { ...v, color }: v
            ),
        })
    };

    const handleChangeVariantSize = (uiId: string, size: string) => {
        onChange({
            ...value,
            variants: value.variants.map((v) => 
                v._uiId === uiId ? { ...v, size }: v
            ),
        })
    };

    const handleChangeVariantInventory = (uiId: string, inventory: number) => {
        onChange({
            ...value,
            variants: value.variants.map((v) => 
                v._uiId === uiId ? { ...v, inventory }: v
            ),
        })
    };

    const cardRemove = (uiId: string) => {
        const nextVariants = value.variants.filter(v => v._uiId !== uiId);

        onChange({
            ...value,
            variants: nextVariants,
        });

        if (nextVariants.length === 0) {
            setShowVariants(false);
        }
    };

    const addVariant = () => {
        onChange({
            ...value,
            variants: [...value.variants, createEnptyVariant()],
        });
    };

    return (
        <>
        <div className={CStyles.inputDiv}>
            <InputTitle title="出品点数" hissu />
            <input
            type="number"
            value={value.all_inventory}
            onChange={(e) => handleAllInventory(Number(e.target.value))}
            placeholder="1"
            className={CStyles.input}
            />
        </div>

        {showVariants && (
            <div className={styles.cardWrapper}>
                {value.variants.map((variant) => {
                    const previewUrl =  previewMap.get(variant._uiId) ?? imageUrlMap.get(variant._uiId) ?? null;

                    return (
                        <div className={styles.variantsCard} key={variant._uiId}>
                            <X className={styles.cardX} onClick={() => cardRemove(variant._uiId)} />

                            <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleChangeCardImage(file, variant._uiId);
                                e.currentTarget.value = "";
                            }}
                            placeholder="画像をアップロード"
                            className={styles.cardImageInput}
                            required
                            />
                                
                            <Image
                            src={previewUrl ?? ""}
                            alt="attributes_preview"
                            width={80}
                            height={80}
                            className={styles.cardPreview}
                            />

                            <div className={styles.cardInputDiv}>
                                <p className={styles.cardInputTitle}>カラー</p>
                                <input
                                type="text"
                                value={variant.color ?? ""}
                                onChange={(e) => handleChangeVariantColor(variant._uiId, e.target.value)}
                                placeholder="カラーを入力してください"
                                className={styles.cardInput}
                                required
                                />
                            </div>

                            <div className={styles.cardInputDiv}>
                                <p className={styles.cardInputTitle}>サイズ</p>
                                <input
                                type="text"
                                value={variant.size ?? ""}
                                onChange={(e) => handleChangeVariantSize(variant._uiId, e.target.value)}
                                placeholder="サイズを入力してください"
                                className={styles.cardInput}
                                required
                                />
                            </div>

                            <div className={styles.cardInputDiv}>
                                <p className={styles.cardInputTitle}>在庫数</p>
                                <input
                                type="number"
                                value={variant.inventory ?? 1}
                                onChange={(e) => handleChangeVariantInventory(variant._uiId, Number(e.target.value))}
                                placeholder="在庫数を入力してください"
                                className={styles.cardInput}
                                required
                                />
                            </div>
                        </div>
                    );
                })}

                {/* +カード */}
                <div className={styles.addCard} onClick={addVariant}>
                    <span className={styles.addIcon}>+</span>
                    <p className={styles.addText}>追加する</p>
                </div>
            </div>
        )}
        </>
    );
};