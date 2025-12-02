import { ReactNode } from "react";
import styles from "../../lp.module.css";

type Props = {
    children: ReactNode;
};

export default function MainP({ children }: Props) {
    return <p className={styles.mainP}>{children}</p>;
};