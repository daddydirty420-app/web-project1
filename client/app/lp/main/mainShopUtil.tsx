import styles from "../lp.module.css";
import MainH2 from "./mainComponent/mainh2";
import MainH3 from "./mainComponent/mainh3";
import MainP from "./mainComponent/mainP";

export default function MainShopUtil() {
    return (
        <>
        <MainH2>FLEX Shopの機能</MainH2>

        <section className={styles.mainSec}>
            <MainH3>複数在庫出品</MainH3>
            <MainP>1つの商品につき、<strong>在庫を何点でも登録できます</strong>。
            <br />また、新しく入荷したら、商品の編集画面で<strong>すぐに在庫の追加が可能です</strong>。
            <br /><strong>専用の在庫管理画面</strong>も用意しております。
            </MainP>
        </section>

        <section className={styles.mainSec}>
            <MainH3>詳細な売上データの閲覧</MainH3>
            <MainP>商品1点ずつの売上データだけでなく、<strong>商品ごとの売上データや日々の売上推移、登録からの月ごとの売上推移</strong>など、詳細な売上データを閲覧することができ、貴社のマーケティングに役立ちます。
            <br />また、売上データ閲覧時に、すぐに振込申請することも可能です。
            </MainP>
        </section>

        <section className={styles.mainSec}>
            <MainH3>売上金の自動振込</MainH3>
            <MainP>任意でオプション設定から自動振込をお申込みいただくと、<strong>毎月自動で指定された口座へ売上金を入金いたします</strong>。
            <br />これにより、振込申請に時間をかけることなく、<strong>振込申請し忘れによる売上金の未回収を防げます</strong>。
            </MainP>
            <small className={styles.small}>※ その他にも、FLEX Shop限定のさまざまな機能がございます。</small>
            <small className={styles.small}>※ FLEX Shop登録による料金はかかりません。販売手数料は通常と同じく10%です。配送や振込ルールも基本的に変更はありません。</small>
            <small className={styles.small}>※ 事業者向け「FLEX Shop」は審査が必要になります。審査の際、1～2週間ほどお時間を要する場合がございます。</small>
        </section>
        </>
    );
};