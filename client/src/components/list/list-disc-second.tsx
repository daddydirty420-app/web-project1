import styles from './list.module.css';
import { ReactNode } from "react";
import clsx from 'clsx';

type ListCheckProps = {
    children: ReactNode
};

export default function ListDiscSecond({ children }: ListCheckProps) {
    return <li className={clsx("mb-2 list-disc", styles.listTextSecond)}>{children}</li>;
}