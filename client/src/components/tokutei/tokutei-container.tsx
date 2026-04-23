import styles from "@/styles/tokutei.module.css";
import { ReactNode } from "react";

type TokuteiContainerProps = {
    children: ReactNode;
};

export const TokuteiContainer = ({ children }: TokuteiContainerProps) => {
    return <main className={styles.container}>{children}</main>;
};
