import { ReactNode } from 'react';
import styles from '@/styles/terms.module.css';

type Props = {
    number: number;
    heading: string;
    children: ReactNode;
};

export const TermsKakko = ({ number, heading, children }: Props) => {
    return (
        <div>
            <h4 className={styles.kakkoTitle}>
                <span className={styles.kakkoNumber}>（ {number} ）</span>
                <span className={styles.kakkoHeading}>「{heading}」</span>
            </h4>
            {children}
        </div>
    );
}