import styles from "./colorSize.module.css";
import CStyle from "../itemCommon.module.css";
import { ColorSize } from "../itemPageTypes";
import Image from "next/image";

type Props = {
    cs: ColorSize[];
};

export default function ColorSizeList({ cs }: Props) {
    return (
        <section className={styles.csList}>
            {cs.map((cs, i) => {
                if (!cs) return null;

                return (
                    <div key={i} className={styles.csDiv}>
                        <Image
                        src={cs.image_url}
                        alt="商品画像"
                        width={80}
                        height={80}
                        className={styles.csImage}
                        />
                        {cs.stock_now === 0 && <p className={styles.csSold}>SOLD OUT</p>}
                        {cs.stock_now / cs.stock_all <= 0.2 && cs.stock_now > 0 && <p className={styles.wazuka}>残りわずか</p>}
                        {cs.kind !== null && cs.kind !== "" && (
                            <div className={styles.csTextDiv}>
                                <p className={CStyle.small}>種類：</p>
                                <p className={styles.csText}>{cs.kind}</p>
                            </div>
                        )}
                        {cs.color !== null && cs.color !== "" && (
                            <div className={styles.csTextDiv}>
                                <p className={CStyle.small}>カラー：</p>
                                <p className={styles.csText}>{cs.color}</p>
                            </div>
                        )}
                        {cs.size !== null && cs.size !== "" && (
                            <div className={styles.csTextDiv}>
                                <p className={CStyle.small}>サイズ：</p>
                                <p className={styles.csText}>{cs.size}</p>
                            </div>
                        )}
                    </div>
                )
            })}
        </section>
    );
};