import { ReactNode } from "react";
import styles from "../../lp.module.css";

type Props = {
    children: ReactNode;
};

export default function MainH3({ children }: Props) {
    return <h3 className={styles.mainH3}>{children}</h3>;
};