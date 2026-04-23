import styles from "@/styles/tokutei.module.css";
import { ReactNode } from "react";

type TokuteiSectionProps = {
    header: string;
    children: ReactNode;
};

export const TokuteiSection = ({ header, children }: TokuteiSectionProps) => {
    return (
        <section className={styles.tokuteiSection}>
            <h2 className={styles.header}>{header}</h2>
            <div className={styles.content}>{children}</div>
        </section>
    );
};
