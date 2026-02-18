"use client"

import Link from "next/link";
import styles from "./ok.module.css";

type Props = {
    itemId: string;
};

export const Button = ({ itemId }: Props) => {
    return (
        <Link
        href={`/item/${itemId}`}
        className={styles.button}
        >
            商品ページへ
        </Link>
    );
}