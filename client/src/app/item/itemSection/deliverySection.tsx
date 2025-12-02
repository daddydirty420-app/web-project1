import styles from "./item.module.css";
import { Item } from "../itemPageTypes";
import clsx from "clsx";

type Props = {
    item: Item;
};

export default function DeliverySection({ item }: Props) {
    return (
        <section className={styles.deliverySection}>
            <p className={styles.syohinText}>商品の情報</p>
            <div className={styles.infoFlex}>
                <p className={styles.infoText}>商品の状態：</p>
                <p className={styles.infoData}>{item.ItemConditionOption?.name}</p>
            </div>
            <div className={styles.infoFlex}>
                <p className={styles.infoText}>配送の方法：</p>
                <p className={styles.infoData}>{item.ParentDelivery?.ShippingServiceOption?.name}</p>
            </div>
            <div className={styles.infoFlex}>
                <p className={styles.infoText}>発送元地域：</p>
                <p className={styles.infoData}>{item.ParentDelivery?.DeliveryTodouhuken?.name}</p>
            </div>
            <div className={styles.infoFlex}>
                <p className={clsx(styles.infoText, styles.font13)}>発送までの日数：</p>
                <p className={styles.infoData}>{item.ParentDelivery?.ShippingDayOption?.name}</p>
            </div>
            {item.stock_all >= 2 && (
                <div className={styles.infoFlex}>
                    <p className={styles.infoText}>在庫：</p>
                    {item.stock_all <= 4 ? item.stock_now >= 2 : item.stock_now / item.stock_all > 0.2 && <p className={clsx(styles.infoData, "text-[var(--theme)]")}>在庫あり</p>}
                    {item.stock_all <= 4 ? item.stock_now === 1 : (item.stock_now / item.stock_all <= 0.2 && item.stock_now >= 1) && <p className={clsx(styles.infoData, "text-[var(--alert)]")}>残りわずか</p>}
                    {item.stock_now === 0 && <p className={clsx(styles.infoData, "text-[var(--alert)]")}>SOLD OUT</p>}
                </div>
            )}
        </section>
    );
};