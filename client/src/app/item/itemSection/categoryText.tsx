import CStyles from "../itemCommon.module.css";
import { Item } from "../itemPageTypes";
import styles from "./item.module.css";

type Props = {
    item: Item;
};

export const CategoryText = ({ item }: Props) => {
    return (
        <>
            <p className={CStyles.semiTitle}>カテゴリー</p>
            <p className={styles.categoryText}>{item.Category?.name}</p>
        </>
    );
};
