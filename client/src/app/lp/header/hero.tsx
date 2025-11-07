import styles from "../lp.module.css";
import headerPic from "../../../assets/images/scott-goodwill-y8Ngwq34_Ak-unsplash.jpg";
import Image from "next/image";
import clsx from "clsx";

type Props = {
    shopPage?: boolean;
};

export default function Hero({ shopPage }: Props) {
    return (
        <div className={styles.headerDiv}>
            <Image
            src={headerPic}
            alt="ヘッダー画像　テントの中から森を見つめる"
            fill
            className="object-cover"
            priority
            />
            <div>
                <p className={clsx('absolute top-[25%] left-[5%]', styles.headerText)}>自慢のギアを動画で<span className="text-[var(--theme)]">FLEX</span>！！</p>
                {!shopPage && <p className={clsx('absolute top-[43%] left-[5%]', styles.headerText)}><span className="text-[var(--theme)]">FLEX</span>で楽しい、新体験のアウトドア売買</p>}
                {shopPage && <p className={clsx('absolute top-[43%] left-[5%]', styles.headerText)}>FLEXで商品の販売を加速させましょう！</p>}
            </div>
            <div className={styles.headerFlexDiv}>
                <p className={styles.headerText2}><span className="text-[var(--theme)]">早期出品者大募集中</span>！</p>
                <p className={styles.headerText2}><span className="text-[var(--theme)]">2026年冬</span>オープン</p>
            </div>
        </div>
    )
}