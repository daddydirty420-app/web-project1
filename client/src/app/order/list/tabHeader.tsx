"use client"

import { useRouter } from "next/navigation";
import styles from "./header.module.css";

type Props = {
    page: "purchased" | "sold";
    tab: "all" | "wait" | "shipping" | "complete";
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
                    router.push(`/order/list/${page}?tab=all`)
                }
                className={`${styles.headerButton} ${
                    tab === "all"
                    ? styles.active
                    : ""
                }`}
                >
                    すべて
                </button>

                <button
                type="button"
                name="wait-tab"
                onClick={() => 
                    router.push(`/order/list/${page}?tab=wait`)
                }
                className={`${styles.headerButton} ${
                    tab === "wait"
                    ? styles.active
                    : ""
                }`}
                >
                    発送待ち
                </button>

                <button
                type="button"
                name="shipping-tab"
                onClick={() => 
                    router.push(`/order/list/${page}?tab=shipping`)
                }
                className={`${styles.headerButton} ${
                    tab === "shipping"
                    ? styles.active
                    : ""
                }`}
                >
                    配送中
                </button>

                <button
                type="button"
                name="complete-tab"
                onClick={() => 
                    router.push(`/order/list/${page}?tab=complete`)
                }
                className={`${styles.headerButton} ${
                    tab === "complete"
                    ? styles.active
                    : ""
                }`}
                >
                    受取済み
                </button>
            </div>
        </nav>
    );
};