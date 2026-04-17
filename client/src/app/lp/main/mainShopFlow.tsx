import styles from "../lp.module.css";
import { MainH2 } from "./mainComponent/mainh2";
import { MainH3 } from "./mainComponent/mainh3";
import { ShopStep } from "./mainComponent/shopStep";
import { ShopFlowP } from "./mainComponent/shopFlowP";

export const MainShopFlow = () => {
    return (
        <>
            <MainH2>ショップ登録の流れ</MainH2>

            <ShopStep number={0}>会員登録・ログイン</ShopStep>
            <ShopFlowP>会員登録・ログインを先にお済ませください。</ShopFlowP>

            <ShopStep number={1}>「法人」or「個人事業主」の選択</ShopStep>
            <ShopFlowP>法人と個人事業主でこの後の入力内容に違いがあります。</ShopFlowP>

            <ShopStep number={2}>会社（事業者）情報の入力</ShopStep>
            <ShopFlowP>会社名、代表者氏名、住所、ショップ名など</ShopFlowP>

            <ShopStep number={3}>口座情報の登録</ShopStep>
            <ShopFlowP>必ずご自身が引き出しできる口座を設定してください。</ShopFlowP>
            <small className={styles.small}>※ 入力ミス等があると、お引き出しできない可能性がございます。</small>

            <ShopStep number={4}>代表者身分証のアップロード</ShopStep>
            <ShopFlowP>必要に応じて、許認可証もアップロードしていただきます。</ShopFlowP>

            <ShopStep number={5}>オプションの選択</ShopStep>
            <ShopFlowP>自動振込や事業者情報の公開といった無料のオプションを選択できます。</ShopFlowP>

            <MainH3>
                <span className="text-[var(--theme)]">ここまで約5～10分</span>
            </MainH3>

            <ShopStep number={6}>審査</ShopStep>
            <ShopFlowP>
                審査に約1～2週間ほどお時間を頂戴しております。審査が完了しましたら、メールにてお知らせいたします。
            </ShopFlowP>
            <small className={styles.small}>
                ※ 審査の結果ショップ登録できない場合、ショップ登録時に入力していただいた情報はすべて削除されます。
            </small>

            <ShopStep number={7}>
                <span className="text-[var(--theme)]">出品開始！</span>
            </ShopStep>
            <ShopFlowP>審査が完了したら、いよいよご出品いただけます！</ShopFlowP>
            <small className={styles.small}>
                ※ これまでにご入力いただいた情報は、一部を除き、マイページから編集可能です。
            </small>
        </>
    );
};
