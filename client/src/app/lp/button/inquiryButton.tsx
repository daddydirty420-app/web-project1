import Link from "next/link";
import styles from "../lp.module.css";

export const InquiryButton = () => {
    return (
        <Link href="/inquiry" className={styles.inquiryButton}>
            お問い合わせ
        </Link>
    );
};
