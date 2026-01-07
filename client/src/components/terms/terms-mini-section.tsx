import { ReactNode } from 'react';
import styles from '@/styles/terms.module.css';

type TeamsMiniSectionProps = {
    number: number;
    heading: string;
    children: ReactNode;
};

export default function TeamsMiniSection({ number, heading, children }: TeamsMiniSectionProps) {
    return (
        <div className={styles.miniSectionBox}>
            <h3 className={styles.miniSectionTitle}>
                <span className={styles.articleNumber}>第 {number} 条</span>
                <span className={styles.articleHeading}>{heading}</span>
            </h3>
            {children}
        </div>
    );
}