import Link from "next/link";
import styles from "./inquiry.module.css";

export const LinkElement = () => {
    return (
        <section className={styles.linkSection}>
            <Link href="/guide" className={styles.link}>
                ご利用ガイド
            </Link>

            <Link href="/terms-and-conditions" className={styles.link}>
                利用規約
            </Link>

            <Link href="/privacy-policy" className={styles.link}>
                プライバシーポリシー
            </Link>
        </section>
    );
};
