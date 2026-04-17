import { ReactNode } from "react";
import styles from "../../lp.module.css";

type Props = {
    children: ReactNode;
};

export const Answer = ({ children }: Props) => {
    return (
        <div className={styles.answerDiv}>
            <p>
                <span className="text-red-600">A</span>：
            </p>
            <p className="flex-1">{children}</p>
        </div>
    );
};
