import styles from "@/styles/terms.module.css";
import { ReactNode } from "react";

type TermsListDivProps = {
    children: ReactNode;
};

export const TermsListDiv = ({ children }: TermsListDivProps) => {
    return <div className={styles.listDiv}>{children}</div>;
};
