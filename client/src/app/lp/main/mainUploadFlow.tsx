import styles from "../lp.module.css";
import { MainP } from "./mainComponent/mainP";
import { MainH3 } from "./mainComponent/mainh3";
import { MainH2 } from "./mainComponent/mainh2";
import { UploadButton } from "../button/uploadButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faCamera, faCirclePlay } from "@fortawesome/free-solid-svg-icons";

type Props = {
    loggedIn: boolean;
};

export const MainUploadFlow = ({ loggedIn }: Props) => {
    return (
        <>
        <MainH2>出品の流れ</MainH2>
        
        <section className={styles.mainnSec}>
            <MainH3><span className="text-[var(--theme)]">STEP 1</span></MainH3>
            <MainP>事前準備：以下のものを準備しましょう。</MainP>
            <div className={styles.syuppinIconFlex}>
                <div className={styles.syuppinIconDiv}>
                    <p className={styles.syuppinIconP}>商品</p>
                    <FontAwesomeIcon icon={faBoxOpen} className={styles.syuppinIcon} />
                </div>
                <div className={styles.syuppinIconDiv}>
                    <p className={styles.syuppinIconP}>動画</p>
                    <FontAwesomeIcon icon={faCirclePlay} className={styles.syuppinIcon} />
                </div>
                <div className={styles.syuppinIconDiv}>
                    <p className={styles.syuppinIconP}>商品画像</p>
                    <FontAwesomeIcon icon={faCamera} className={styles.syuppinIcon} />
                </div>
            </div>
        </section>

        <section className={styles.mainSec}>
            <MainH3><span className="text-[var(--theme)]">STEP 2</span></MainH3>
            <UploadButton loggedIn={loggedIn} />
            <MainP>「出品する」ボタンを押して、動画や商品画像、商品説明などを入力して、商品をアップロード。これで、出品完了！</MainP>
        </section>

        <section className={styles.mainSec}>
            <MainH3>購入後～配送～取引完了</MainH3>
            <MainP>取引成立後、事前に設定していただいた配送手段、発送日の通りにご発送ください。購入者が商品を受け取り、出品者評価を完了したら、取引完了です。</MainP>
        </section>

        <section className={styles.mainSec}>
            <MainH3>売上金、振込ルール</MainH3>
            <MainP>取引完了後、売上金が計上されます。計上日から180日後までが保管期限です。</MainP>
            <MainP>売上金は<strong>振込申請</strong>または<strong>ポイント変換</strong>のどちらかで受け取れます。</MainP>
            <ul className={styles.lpListUl}>
                <li className={styles.lpList}>
                    <p><strong>振込申請</strong>：</p>
                    <p className="flex-1">申請後、翌々週の金曜日に指定の口座へ入金</p>
                </li>
                <li className={styles.lpList}>
                    <p><strong>ポイント変換</strong>：</p>
                    <p className="flex-1"><span className="text-[var(--theme)]">FLEX OUTDOOR</span>限定で使えるポイントに即時変換（<strong>手数料無料でお得！</strong>）</p>
                </li>
            </ul>
        </section>
        </>
    );
};