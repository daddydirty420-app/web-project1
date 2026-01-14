import styles from "./item.module.css";
import { Item } from "../itemPageTypes";

type Props = {
    item: Item;
};

export default function DeliverySection({ item }: Props) {
    const inventory = item.attributes.inventory;
    return (
        <section className={styles.deliverySection}>
            <p className={styles.syohinText}>商品の情報</p>
            <div className={styles.infoRow}>
                <span className={styles.label}>商品の状態</span>
                <span className={styles.value}>{item.ItemConditionOption?.name}</span>
            </div>
            <div className={styles.infoRow}>
                <span className={styles.label}>配送の方法</span>
                <span className={styles.value}>{item.ItemShippingProfile?.ShippingServiceOption?.name}</span>
            </div>
            <div className={styles.infoRow}>
                <span className={styles.label}>発送元地域</span>
                <span className={styles.value}>{item.ItemShippingProfile?.TodouhukenOption?.name}</span>
            </div>
            <div className={styles.infoRow}>
                <span className={styles.label}>発送までの日数</span>
                <span className={styles.value}>{item.ItemShippingProfile?.ShippingDayOption?.name}</span>
            </div>
            {inventory && inventory.initial >= 2 && (
                <div className={styles.infoRow}>
                    <span className={styles.label}>在庫</span>
                    {inventory.initial <= 4
                    ? inventory.current >= 2
                    : (inventory.initial / inventory.current) > (inventory.initial * inventory.low_stock_ratio)
                    && <span className={`${styles.value} ${styles.full}`}>在庫あり</span>}

                    {inventory.initial <= 4
                    ? inventory.current === 1
                    : (inventory.initial / inventory.current) <= (inventory.initial * inventory.low_stock_ratio) && inventory.current >= 1
                    && <span className={`${styles.value} ${styles.low}`}>残りわずか</span>}

                    {inventory.current === 0 && <span className={`${styles.value} ${styles.sold}`}>SOLD OUT</span>}
                </div>
            )}
        </section>
    );
};