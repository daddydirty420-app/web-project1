import styles from "./item.module.css";
import { Item } from "../itemPageTypes";

type Props = {
    item: Item;
};

export default function CategoryText({ item }: Props) {
    return (
        <>
        <p className={styles.categoryP}>カテゴリー</p>
        <p className={styles.categoryText}>{item.Category?.name}</p>
        </>
    );
};