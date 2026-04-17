import { ReactNode } from "react";
import styles from "../../lp.module.css";

type Props = {
    children: ReactNode;
};

export const ShopFlowP = ({ children }: Props) => {
    return <p className={styles.shopFlowP}>{children}</p>;
};
