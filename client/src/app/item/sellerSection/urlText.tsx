"use client";

import { usePathname } from "next/navigation";
import styles from "./seller.module.css";

export default function UrlText() {
    const pathname = usePathname();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const fullUrl = `${baseUrl}${pathname}`;

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(fullUrl);
            alert("リンクをコピーしました！");
        } catch (err) {
            console.error(err);
            alert("コピー失敗！");
        }
    };

    return (
        <>
        <p className={styles.linkP}>購入者向けリンク<br />（SNSやブログ等にリンクを貼る場合、下記URLをお貼りください）</p>
        <p className={styles.urlText} onClick={copy}>{fullUrl}</p>
        </>
    );
};