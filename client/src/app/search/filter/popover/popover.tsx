"use client";

import { ReactNode } from "react";
import styles from "./styles.module.css";

type Props = {
    children: ReactNode;
    onClose: () => void;
};

export const Popover = ({ children, onClose }: Props) => {
    return (
        <>
            <div className={styles.overlay} onClick={onClose} />

            <section className={styles.popover}>{children}</section>
        </>
    );
};
