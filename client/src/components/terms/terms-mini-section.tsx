import { ReactNode } from 'react';
import styles from '@/styles/terms.module.css';

type Props = {
    number: number;
    heading: string;
    children: ReactNode;
};

export const TermsMiniSection = ({ number, heading, children }: Props) => {
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