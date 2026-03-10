"use client"

import { useRouter } from "next/navigation";
import styles from "./header.module.css";

type Props = {
    page: "uploaded" | "sold";
    tab: "all" | "selling" | null;
};

export const TabHeader = ({ page, tab }: Props) => {
    const router = useRouter();

    return (
        <nav className={styles.header}>
            <div className={styles.buttonFlex}>
                <button
                type="button"
                name="all-tab"
                onClick={() =>
                    router.push(`/item-list/uploaded?tab=all`)
                }
                className={`${styles.headerButton} ${
                    tab === "all"
                    ? styles.active
                    : ""
                }`}
                >
                    全商品
                </button>
                
                <button
                type="button"
                name="selling-tab"
                onClick={() =>
                    router.push(`/item-list/uploaded?tab=selling`)
                }
                className={`${styles.headerButton} ${
                    tab === "selling"
                    ? styles.active
                    : ""
                }`}
                >
                    販売中のみ
                </button>
                
                <button
                type="button"
                name="sold"
                onClick={() =>
                    router.push(`/transaction-list/sold`)
                }
                className={`${styles.headerButton} ${
                    page === "sold"
                    ? styles.active
                    : ""
                }`}
                >
                    売却済み
                </button>
            </div>
        </nav>
    );
};
