import { ReactNode } from 'react';
import styles from '@/styles/terms.module.css';

type TermsListDivProps = {
    children: ReactNode;
};

export const TermsListDiv = ({ children }: TermsListDivProps) => {
    return (
        <div className={styles.listDiv}>
            {children}
        </div>
    );
}