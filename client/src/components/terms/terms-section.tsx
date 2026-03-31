import { ReactNode } from "react";
import styles from '@/styles/terms.module.css';

type Props = {
    number: number;
    heading: string;
    children: ReactNode;
};

export const TermsSection = ({ number, heading, children }: Props) => {
    return (
        <section className={styles.sectionBox}>
            <h2 className={styles.sectionTitle}>第 {number} 章　{heading}</h2>
            {children}
        </section>
    );
}