import styles from "../lp.module.css";

type Props = {
    shopPage?: boolean;
};
export default function HeaderGreen({ shopPage }: Props) {
    return (
        <div className={styles.headerGreen}>
        {!shopPage && <h1 className={styles.headerh1}>【史上初】動画で商品紹介<br />キャンプ・登山用品専用フリーマーケットサイト</h1>}
        {shopPage && <h1 className={styles.headerh1}>【史上初】動画で商品紹介<br />キャンプ・登山用品専用フリマ/ネットショップ</h1>}
        </div>
    )
}