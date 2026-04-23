"use client";

import Link from "next/link";
import styles from "./profile.module.css";

export const EditButton = () => {
    return (
        <Link href={`/edit/profile`} className={styles.editButton}>
            編集
        </Link>
    );
};
