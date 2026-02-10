import { ReactNode } from "react";
import styles from "../../lp.module.css";

type Props = {
    children: ReactNode;
};

export const MainH3 = ({ children }: Props) => {
    return <h3 className={styles.mainH3}>{children}</h3>;
};