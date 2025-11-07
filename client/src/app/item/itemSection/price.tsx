import styles from "./item.module.css";
import { Item } from "../itemPageTypes";

type Props = {
    item: Item;
};

export default function Price({ item }: Props) {
    return (
        <div className={styles.priceDiv}>
            <h2 className={styles.price}>￥{item.price.toLocaleString()}</h2>
            {!item.sold_out && item.Sale?.sale_flag && (
                <>
                {item.Sale?.discount_rate > 0 && <p className={styles.saleP}>{item.Sale?.discount_rate.toLocaleString()}% OFF</p>}
                {item.Sale?.discount_amount > 0 && <p className={styles.saleP}>{item.Sale?.discount_amount.toLocaleString()}円引き</p>}
                <small className={styles.beforePrice}>￥{item.Sale?.before_price.toLocaleString()}</small>
                </>
            )}
        </div>
    );
};