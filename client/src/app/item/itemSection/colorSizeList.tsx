import styles from "./colorSize.module.css";
import CStyle from "../itemCommon.module.css";
import Image from "next/image";
import { Item } from "../itemPageTypes";

type Props = {
    item: Item;
};

export default function ColorSizeList({ item }: Props) {
    return (
        <section className={styles.variantList}>
            {item.attributes.variants?.map((variant, i) => {
                if (!variant) return null;

                return (
                    <div key={i} className={styles.variantDiv}>
                        <Image
                        src={variant.image_url ?? ""}
                        alt="商品画像"
                        width={80}
                        height={80}
                        className={styles.variantImage}
                        />
                        {variant.inventory?.current === 0 && <p className={styles.csSold}>SOLD OUT</p>}
                        {variant.inventory && (variant.inventory?.current / variant.inventory?.initial) <= variant.inventory?.low_stock_ratio 
                        && 
                        variant.inventory?.current > 0
                        && 
                        <p className={styles.wazuka}>
                            残りわずか
                        </p>}
                        {variant.color !== null && variant.color !== "" && (
                            <div className={styles.csTextDiv}>
                                <p className={CStyle.small}>カラー：</p>
                                <p className={styles.csText}>{variant.color}</p>
                            </div>
                        )}
                        {variant.size !== null && variant.size !== "" && (
                            <div className={styles.csTextDiv}>
                                <p className={CStyle.small}>サイズ：</p>
                                <p className={styles.csText}>{variant.size_label}</p>
                            </div>
                        )}
                    </div>
                )
            })}
        </section>
    );
};