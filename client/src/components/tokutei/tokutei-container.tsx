import { ReactNode } from "react";
import styles from '@/styles/tokutei.module.css';

type TokuteiContainerProps = {
    children: ReactNode,
};

export default function TokuteiContainer({ children }: TokuteiContainerProps) {
    return (
        <main className={styles.container}>
            {children}
        </main>
    );
}