import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import styles from './list.module.css';
import { ReactNode } from "react";

type ListCheckProps = {
    children: ReactNode
};

export default function ListCheck({ children }: ListCheckProps) {
    return (
        <li className="flex gap-2 items-center mb-2">
            <FontAwesomeIcon icon={faCheck} className="text-(--theme) text-base font-medium" />
            <div className={styles.listText}>{children}</div>
        </li>
    );
}