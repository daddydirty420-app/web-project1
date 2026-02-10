import { ReactNode } from "react";
import styles from "../../lp.module.css";

type Props = {
    children: ReactNode;
};

export const MainP = ({ children }: Props) => {
    return <p className={styles.mainP}>{children}</p>;
};