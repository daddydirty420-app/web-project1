import styles from "./item.module.css";
import { Item } from "../itemPageTypes";
import clsx from "clsx";

type Props = {
    item: Item;
};

export default function DeliverySection({ item }: Props) {
    const inventory = item.attributes.inventory;
    return (
        <section className={styles.deliverySection}>
            <p className={styles.syohinText}>商品の情報</p>
            <div className={styles.infoFlex}>
                <p className={styles.infoText}>商品の状態：</p>
                <p className={styles.infoData}>{item.ItemConditionOption?.name}</p>
            </div>
            <div className={styles.infoFlex}>
                <p className={styles.infoText}>配送の方法：</p>
                <p className={styles.infoData}>{item.ItemShippingProfile?.ShippingServiceOption?.name}</p>
            </div>
            <div className={styles.infoFlex}>
                <p className={styles.infoText}>発送元地域：</p>
                <p className={styles.infoData}>{item.ItemShippingProfile?.TodouhukenOption?.name}</p>
            </div>
            <div className={styles.infoFlex}>
                <p className={clsx(styles.infoText, styles.font13)}>発送までの日数：</p>
                <p className={styles.infoData}>{item.ItemShippingProfile?.ShippingDayOption?.name}</p>
            </div>
            {inventory && inventory?.initial >= 2 && (
                <div className={styles.infoFlex}>
                    <p className={styles.infoText}>在庫：</p>
                    {inventory.initial <= 4
                    ? inventory.current >= 2
                    : inventory.initial / inventory.current > inventory.low_stock_ratio
                    && <p className={clsx(styles.infoData, "text-[var(--theme)]")}>在庫あり</p>}

                    {inventory.initial <= 4
                    ? inventory.current === 1
                    : (inventory.current / inventory.initial <= inventory.low_stock_ratio && inventory.current >= 1)
                    && <p className={clsx(styles.infoData, "text-[var(--alert)]")}>残りわずか</p>}

                    {inventory.current === 0 && <p className={clsx(styles.infoData, "text-[var(--alert)]")}>SOLD OUT</p>}
                </div>
            )}
        </section>
    );
};