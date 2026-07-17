import Link from "next/link";
import { SITE } from "../../../config/site";
import styles from "../lp.module.css";
import { MainH2 } from "./mainComponent/mainh2";
import { MainH3 } from "./mainComponent/mainh3";
import { MainP } from "./mainComponent/mainP";

export const MainAllUser = () => {
    return (
        <>
            <MainH2>個人でも、事業者でも</MainH2>

            <section className={styles.mainSec}>
                <MainH3>
                    個人でも
                    <br />
                    個人事業主でも
                    <br />
                    法人でも
                    <br />
                    <br />
                    <span className="text-[var(--theme)]">どなたでもご出品いただけます！</span>
                </MainH3>
                <MainP>
                    個人の方は通常のご出品、法人や個人事業主といった事業者の方は、大量出品や在庫管理機能付きの「
                    <span className="text-[var(--theme)]">{SITE.shopName}</span>」をご利用ください。
                </MainP>
                <MainP>
                    通常のご出品であれば、会員登録後すぐにご出品いただけます！不要になったものや新しく仕入れたもの、店舗の在庫など、なんでもお売りください！
                </MainP>
                <small className={styles.small}>
                    ※ 事業者向け「{SITE.shopName}
                    」は審査が必要になります。審査の際、1～2週間ほどお時間を要する場合がございます
                </small>
                <Link href="/lp/shop" className="underline">
                    FLEX Shopの詳細はこちら→
                </Link>
            </section>
        </>
    );
};
