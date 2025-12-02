'use client';

import styles from "./profile.module.css";
import Link from "next/link";

export default function EditButton() {
    return (
        <Link href={`/edit/profile`} className={styles.editButton}>編集</Link>
    );
};