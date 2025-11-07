import { ReactNode } from "react";
import AcGStyle from "./styles/accordion-grid.module.css";

type AccordionGridProps = {
    children: ReactNode
}

export default function AccordionGrid({ children }: AccordionGridProps) {
    return <div className={AcGStyle.flexGrid}>{children}</div>
}