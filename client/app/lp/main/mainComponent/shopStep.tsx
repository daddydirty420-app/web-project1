import { ReactNode } from "react";
import styles from "../../lp.module.css";

type Props = {
    number: number;
    children: ReactNode;
};

export default function ShopStep({ number, children }: Props) {
    return <p className={styles.shopStep}>STEP{number}：<strong>{children}</strong></p>;
};