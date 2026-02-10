import { ReactNode } from "react";
import AcGStyle from "./styles/accordion-grid.module.css";

type AccordionGridProps = {
    children: ReactNode
};

export const AccordionGrid = ({ children }: AccordionGridProps) => {
    return <div className={AcGStyle.flexGrid}>{children}</div>;
}