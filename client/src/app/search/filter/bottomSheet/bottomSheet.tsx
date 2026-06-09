"use client";

import { ReactNode } from "react";
import styles from "./styles.module.css";

type Props = {
    children: ReactNode;
};

export const BottomSheet = ({ children }: Props) => {
    return (
        <>
            <div className={styles.sheetOverlay} />

            <section className={styles.bottomSheet}>
                <div className={styles.handle} />

                {children}
            </section>
        </>
    );
};
