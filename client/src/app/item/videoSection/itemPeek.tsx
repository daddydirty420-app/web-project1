"use client";

import Image from "next/image";
import { Item } from "../itemPageTypes";
import styles from "./peek.module.css";

type Props = {
    item: Item;
};

export const ItemPeek = ({ item }: Props) => {
    const handleScroll = () => {
        const target = document.getElementById("itemName");
        target?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <section
        className={styles.itemPeek}
        onClick={handleScroll}
        role="button"
        aria-label="商品説明へスクロール"
        >
            <div className={styles.imageName}>
                <Image
                src={item.first_image_url}
                alt="商品画像1枚目"
                width={45}
                height={45}
                className={styles.image}
                />

                <div className={styles.nameType}>
                    <p className={styles.name}>{item.name}</p>

                    {(
                        ["men", "women", "unisex"].includes(item.gender_type) ||
                        item.age_type === "kids"
                    ) && (
                        <div className={styles.typeRow}>
                            {item.gender_type === "men" && (
                                <span className={styles.typeText}>メンズ</span>
                            )}
                            {item.gender_type === "women" && (
                                <span className={styles.typeText}>レディース</span>
                            )}
                            {item.gender_type === "unisex" && (
                                <span className={styles.typeText}>ユニセックス</span>
                            )}

                            {item.age_type === "kids" && (
                                <>
                                <span className={styles.typeText}>/</span>
                                <span className={styles.typeText}>キッズ</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <p className={`${styles.price}
            ${item.status === "soldout" ? `${styles.sold}` : ""}`}>
                {item.status === "soldout" ? "SOLD OUT" : `￥${item.price.toLocaleString()}`}
            </p>
        </section>
    );
}