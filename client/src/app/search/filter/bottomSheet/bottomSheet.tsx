"use client";

import { ReactNode, useRef } from "react";
import styles from "./styles.module.css";

type Props = {
    children: ReactNode;
    onClose: () => void;
};

export const BottomSheet = ({ children, onClose }: Props) => {
    const sheetRef = useRef<HTMLDivElement>(null);

    const closeSheet = () => {
        const sheet = sheetRef.current;
        if (!sheet) return;

        sheet.classList.add(`${styles.closing}`);
        sheet.addEventListener(
            "animationend",
            () => {
                onClose();
            },
            { once: true },
        );
    };

    return (
        <>
            <div className={styles.overlay} onClick={closeSheet} />

            <section className={styles.sheet} ref={sheetRef}>
                <div className={styles.handle} onClick={closeSheet} />

                {children}
            </section>
        </>
    );
};
