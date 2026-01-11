import styles from "./variants.module.css";
import CStyle from "../itemCommon.module.css";
import Image from "next/image";
import { Item } from "../itemPageTypes";

type Props = {
    item: Item;
};

export default function ValiantsList({ item }: Props) {
    return (
        <section className={styles.variantList}>
            {item.attributes.variants?.map((variant, i) => {
                if (!variant) return null;
                const inventory = variant.inventory;
                const isSoldout = inventory?.current === 0;
                const isLowStock = inventory &&
                inventory.current > 0 &&
                inventory.current / inventory.initial <= inventory.low_stock_ratio;

                return (
                    <div key={i} className={styles.variantCard}>
                        <div className={styles.imageWrapper}>
                            <Image
                            src={variant.image_url ?? ""}
                            alt="バリエーション画像"
                            width={80}
                            height={80}
                            className={styles.variantImage}
                            />
                            {isSoldout && <span className={styles.sold}>SOLD OUT</span>}
                            {isLowStock && (
                                <span className={styles.low}>
                                    残りわずか
                                </span>
                            )}
                        </div>

                        <div className={styles.meta}>
                            {variant.color && (
                                <p className={styles.metaText}>
                                    <span>カラー</span>{variant.color}
                                </p>
                            )}
                            {variant.size !== null && variant.size !== "" && (
                                <p className={styles.metaText}>
                                    <span>サイズ</span>{variant.size_label}
                                </p>
                            )}
                        </div>
                    </div>
                )
            })}
        </section>
    );
};