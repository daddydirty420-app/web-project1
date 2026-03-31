import Link from "next/link";
import styles from "../lp.module.css";

export const FooterSitemap = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerSitemap}>
                <nav className={styles.sitemapNav}>
                    <Link href='/terms-and-conditions' className={styles.sitemapText}>利用規約</Link>
                    <Link href='/privacy-policy' className={styles.sitemapText}>プライバシーポリシー</Link>
                    <Link href='/tokutei' className={styles.sitemapText}>特定商取引法に関する表記</Link>
                    <Link href='/inquiry' className={styles.sitemapText}>お問い合わせ</Link>
                    <Link href='/guide' className={styles.sitemapText}>ご利用ガイド</Link>
                    <Link href='/company' className={styles.sitemapText}>会社概要</Link>
                    <Link href='/blog/list' className={styles.sitemapText}>FLEX OUTDOORブログ</Link>
                </nav>
            </div>
        </footer>
    );
};