import { ReactNode } from "react";
import styles from "./styles/accordion-grid.module.css";

type AccordionGridProps = {
    children: ReactNode;
};

export const AccordionGrid = ({ children }: AccordionGridProps) => {
    return <div className={styles.flexGrid}>{children}</div>;
};
