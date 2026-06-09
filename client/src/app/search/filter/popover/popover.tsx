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
            <div className={styles.backdrop} onClick={onClose} />

            <section className={styles.popover}>
                <div className={styles.filterContainer}>{children}</div>
            </section>
        </>
    );
};
