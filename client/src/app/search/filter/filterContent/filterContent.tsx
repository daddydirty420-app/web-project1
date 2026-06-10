"use client";

import styles from "./styles.module.css";

type Props = {
    onClose: () => void;
};

export const FilterContent = ({ onClose }: Props) => {
    return (
        <>
            <p className={styles.filterTitle}>並び替え</p>

            <ul className={styles.sortUl}>
                <li className={styles.sortLi}>
                    <span>人気順（デフォルト）</span>

                    <span className={styles.radio} />
                </li>

                <li className={styles.sortLi}>
                    <span>新着順</span>

                    <span className={styles.radio} />
                </li>

                <li className={styles.sortLi}>
                    <span>価格が安い順</span>

                    <span className={styles.radio} />
                </li>
                <li className={styles.sortLi}>
                    <span>価格が高い順</span>

                    <span className={styles.radio} />
                </li>
            </ul>
        </>
    );
};
