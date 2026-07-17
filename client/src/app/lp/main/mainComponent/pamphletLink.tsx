import Image from "next/image";
import { SITE } from "../../../../config/site";
import styles from "../../lp.module.css";

export const PamphletLink = () => {
    return (
        <a href="/pamphlet.pdf" target="_blank" rel="noopener noreferrer" className={styles.pamphletLink}>
            <Image
                src="/icon.png"
                alt={`${SITE.appName}〇〇アイコン`}
                width={60}
                height={60}
                className={styles.linkIcon}
            />
            <p className={styles.pamphletP}>
                <span className="text-[var(--theme)]">${SITE.appName}出品ガイド</span>
                <br />
                資料のダウンロードはこちら
            </p>
        </a>
    );
};
