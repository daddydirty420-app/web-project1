import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import styles from "./list.module.css";

type ListCheckProps = {
    children: ReactNode;
};

export const ListCheck = ({ children }: ListCheckProps) => {
    return (
        <li className="flex gap-2 items-center mb-2">
            <FontAwesomeIcon icon={faCheck} className="text-(--theme) text-base font-medium" />
            <div className={styles.listText}>{children}</div>
        </li>
    );
};
