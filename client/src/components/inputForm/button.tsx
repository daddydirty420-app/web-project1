import { ReactNode } from "react";
import styles from "./inputForm.module.css";

type Props = {
    onClick: () => void;
    children: ReactNode;
    disabled?: boolean;
};

export const Button = ({ onClick, children, disabled }: Props) => {
    return (
        <button type="button" onClick={onClick} className={styles.button} disabled={disabled}>
            {children}
        </button>
    );
};
