"use client";

import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

type Props = {
    onClose: () => void;
    sort: "popular" | "new" | "priceAsc" | "priceDesc";
    keyword: string;
};

export const FilterContent = ({ onClose, sort, keyword }: Props) => {
    const router = useRouter();

    const handleSort = (sortValue: string) => {
        if (sortValue === sort) return;

        onClose();

        router.push(`/search?keyword=${keyword}&sort=${sortValue}`);
    };

    return (
        <fieldset>
            <legend className={styles.filterTitle}>並び替え</legend>

            <div className={styles.sortDiv}>
                <label className={styles.sortLabel} onClick={() => handleSort("popular")}>
                    <input type="radio" name="sort" value="popular" className={styles.input} />
                    <span>人気順（デフォルト）</span>

                    <span className={styles.radio} />
                </label>

                <label className={styles.sortLabel} onClick={() => handleSort("new")}>
                    <input type="radio" name="sort" value="new" className={styles.input} />
                    <span>新着順</span>

                    <span className={styles.radio} />
                </label>

                <label className={styles.sortLabel} onClick={() => handleSort("priceAsc")}>
                    <input type="radio" name="sort" value="priceAsc" className={styles.input} />
                    <span>価格が安い順</span>

                    <span className={styles.radio} />
                </label>
                <label className={styles.sortLabel} onClick={() => handleSort("priceDesc")}>
                    <input type="radio" name="sort" value="priceDesc" className={styles.input} />
                    <span>価格が高い順</span>

                    <span className={styles.radio} />
                </label>
            </div>
        </fieldset>
    );
};
