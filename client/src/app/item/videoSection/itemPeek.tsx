import Image from "next/image";
import { Item } from "../itemPageTypes";
import styles from "./video.module.css";

type Props = {
    item: Item;
};

export default function ItemPeek({ item }: Props) {
    return (
        <section className={styles.itemPeek}>
            <div className={styles.peekImageName}>
                <Image
                src={item.first_image_url}
                alt="商品画像1枚目"
                width={90}
                height={90}
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