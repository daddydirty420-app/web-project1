import { ReactNode } from "react";
import styles from "../../lp.module.css";

type Props = {
    children: ReactNode;
};

export const Question = ({ children }: Props) => {
    return (
        <div className={styles.questionDiv}>
            <p><span className="text-blue-700">Q</span>：</p>
            <p className="flex-1">{children}</p>
        </div>
    );
};