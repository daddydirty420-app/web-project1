"use client"

import Link from "next/link";
import { Item } from "../types/type";
import styles from "./ok.module.css";

type Props = {
    itemId: string;
    item: Item;
};

export const ItemHighlight = ({ itemId, item }: Props) => {
    return (
        <Link
        className={styles.itemHighlight}
        href={`/item/${itemId}`}
        aria-label={`${item.name}`}
        >
            <div className={styles.imageName}></div>
        </Link>
    );
};