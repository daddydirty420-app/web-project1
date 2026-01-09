"use client";

import Image from "next/image";
import { Item } from "../itemPageTypes";
import styles from "./video.module.css";

type Props = {
    item: Item;
};

export default function ItemPeek({ item }: Props) {
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
            <div className={styles.peekImageName}>
                <Image
                src={item.first_image_url}
                alt="商品画像1枚目"
                width={45}
                height={45}
                className={styles.peekImage}
                />

                <p className={styles.peekName}>{item.name}</p>
            </div>

            <p className={`${styles.peekPrice}
            ${item.status === "soldout" ? `${styles.sold}` : ""}`}>
                {item.status === "soldout" ? "SOLD OUT" : `￥${item.price.toLocaleString()}`}
            </p>
        </section>
    );
}