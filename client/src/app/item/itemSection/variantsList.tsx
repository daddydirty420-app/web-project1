import styles from "./variants.module.css";
import Image from "next/image";
import { Item } from "../itemPageTypes";

type Props = {
    item: Item;
};

export const VariantsList = ({ item }: Props) => {
    return (
        <section className={styles.variantList}>
            {item.attributes.colorVariants?.map((variant, i) => {
                if (!variant) return null;
                const initialInventory = variant.sizes?.reduce(
                    (sum, s) => sum + (s.inventory.initial ?? 0),
                    0,
                ) ?? 0;
                const currentInventory = variant.sizes?.reduce(
                    (sum, s) => sum + (s.inventory.current ?? 0),
                    0,
                ) ?? 0;

                const isSoldout = currentInventory === 0;
                const isLowStock = currentInventory &&
                currentInventory > 0 &&
                currentInventory / initialInventory <= 0.2;

                return (
                    <div key={i} className={styles.variantCard}>
                        <div className={styles.imageWrapper}>
                            <Image
                            src={variant.image_url ?? ""}
                            alt="バリエーション画像"
                            width={100}
                            height={100}
                            className={styles.variantImage}
                            />
                            {isSoldout && (
                                <div className={styles.sold}>
                                    <span className={styles.soldText}>SOLD</span>
                                </div>
                            )}
                            {isLowStock && (
                                <div className={styles.low}>
                                    <span className={styles.lowText}>残りわずか</span>
                                </div>
                            )}
                        </div>

                        <div className={styles.meta}>
                            {variant.color && (
                                <p className={styles.metaText}>
                                    <span>カラー</span>{variant.color}
                                </p>
                            )}

                            {variant.sizes && variant.sizes?.length > 0 && (
                                <div className={styles.sizeList}>
                                    {variant.sizes?.map((size, i) => {
                                        if (!size) return;

                                        const current = size.inventory.current;
                                        const soldout = current === 0;
                                        const lowStock = current <= size.inventory.low_stock_ratio && current > 0;

                                        return (
                                            <div key={i} className={styles.sizeRow}>
                                                <p className={styles.metaText}>
                                                    <span className={styles.sizeLabel}>{size.size}</span>
                                                </p>

                                                <div className={styles.stockBadge}>
                                                    {soldout && (
                                                        <span className={styles.soldMini}>SOLD OUT</span>
                                                    )}

                                                    {lowStock && (
                                                        <span className={styles.lowMini}>残りわずか</span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </section>
    );
};