import { Item } from "../itemPageTypes";
import styles from "./item.module.css";

type Props = {
    item: Item;
};

export const Price = ({ item }: Props) => {
    return (
        <div className={styles.priceDiv}>
            <h2 className={styles.price}>￥{item.price.toLocaleString()}</h2>
            {!(item.status === "soldout") && item.Sale?.sale_flag && (
                <>
                    {item.Sale?.discount_rate > 0 && (
                        <p className={styles.saleP}>{item.Sale?.discount_rate.toLocaleString()}% OFF</p>
                    )}
                    {item.Sale?.discount_amount > 0 && (
                        <p className={styles.saleP}>{item.Sale?.discount_amount.toLocaleString()}円引き</p>
                    )}
                    <small className={styles.beforePrice}>￥{item.Sale?.before_price.toLocaleString()}</small>
                </>
            )}
        </div>
    );
};
