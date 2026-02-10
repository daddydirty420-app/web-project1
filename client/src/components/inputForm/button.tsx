import { ReactNode } from "react";
import styles from "./imputForm.module.css";

type Props = {
    onClick: () => void;
    children: ReactNode;
};

export const Button = ({ onClick, children }: Props) => {
    return (
        <button
        type="button"
        onClick={onClick}
        className={styles.button}
        >
            {children}
        </button>
    );
};