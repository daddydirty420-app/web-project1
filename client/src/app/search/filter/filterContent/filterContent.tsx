"use client";

import styles from "./styles.module.css";

type Props = {
    onClose: () => void;
};

export const FilterContent = ({ onClose }: Props) => {
    const handleSort = async () => {};

    return (
        <fieldset>
            <legend className={styles.filterTitle}>並び替え</legend>

            <div className={styles.sortDiv}>
                <label className={styles.sortLabel}>
                    <input type="radio" name="sort" value="popular" className={styles.input} />
                    <span>人気順（デフォルト）</span>

                    <span className={styles.radio} />
                </label>

                <label className={styles.sortLabel}>
                    <input type="radio" name="sort" value="new" className={styles.input} />
                    <span>新着順</span>

                    <span className={styles.radio} />
                </label>

                <label className={styles.sortLabel}>
                    <input type="radio" name="sort" value="priceAsc" className={styles.input} />
                    <span>価格が安い順</span>

                    <span className={styles.radio} />
                </label>
                <label className={styles.sortLabel}>
                    <input type="radio" name="sort" value="priceDesc" className={styles.input} />
                    <span>価格が高い順</span>

                    <span className={styles.radio} />
                </label>
            </div>
        </fieldset>
    );
};
