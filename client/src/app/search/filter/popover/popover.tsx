"use client";

import { ReactNode } from "react";
import styles from "./styles.module.css";

type Props = {
    children: ReactNode;
    onClose: () => void;
    isOpen: boolean;
};

export const Popover = ({ children, onClose, isOpen }: Props) => {
    return (
        <>
            <div className={styles.backdrop} onClick={onClose} />

            <section className={`${styles.popover} ${isOpen ? styles.open : ""}`}>
                <div className={styles.filterContainer}>{children}</div>
            </section>
        </>
    );
};
