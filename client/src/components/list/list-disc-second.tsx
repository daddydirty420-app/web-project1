import clsx from "clsx";
import { ReactNode } from "react";
import styles from "./list.module.css";

type ListCheckProps = {
    children: ReactNode;
};

export const ListDiscSecond = ({ children }: ListCheckProps) => {
    return <li className={clsx("mb-2 list-disc", styles.listTextSecond)}>{children}</li>;
};
