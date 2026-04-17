import { ReactNode } from 'react';
import styles from '@/styles/tokutei.module.css';

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
