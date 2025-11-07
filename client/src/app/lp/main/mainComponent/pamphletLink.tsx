import styles from "../../lp.module.css";
import Image from "next/image";

export default function PamphletLink() {
    return (
        <a
        href="/pamphlet.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.pamphletLink}
        >
            <Image
            src="/icon.png"
            alt="FLEX OUTDOORアイコン"
            width={60}
            height={60}
            className={styles.linkIcon}
            />
            <p className={styles.pamphletP}><span className="text-[var(--theme)]">FLEX OUTDOOR出品ガイド</span><br />資料のダウンロードはこちら</p>
        </a>
    );
};