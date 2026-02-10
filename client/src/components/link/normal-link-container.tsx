import { ReactNode } from "react";
import styles from './normal-link.module.css';

type NormalLinkContainerProps = {
    children: ReactNode,
};

export const NormalLinkContainer = ({ children }: NormalLinkContainerProps) => {
    return (
        <div className={styles.normalContainer}>
            {children}
        </div>
    );
}