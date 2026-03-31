import { ReactNode } from "react";
import styles from "../../lp.module.css";

type Props = {
    children: ReactNode;
};

export const MainH2 = ({ children }: Props) => {
    return <h2 className={styles.mainH2}>{children}</h2>;
};