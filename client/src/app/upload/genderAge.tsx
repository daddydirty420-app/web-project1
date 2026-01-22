"use state";

import styles from "./upload.module.css";

export type GenderAgeValue = {
    gender_type: "men" | "women" | "unisex";
    age_type: "adult" | "kids" | "both";
};

type Props = {
    value: GenderAgeValue;
    onChange: (v: GenderAgeValue) => void;
};

export default function GenderAge({ value, onChange }: Props) {
    const genderTypeLabel: string[] = ["メンズ", "レディース", "ユニセックス"];
    const ageTypeLabel: string[] = ["大人向け", "キッズ向け", "指定なし"];

    return (
        <>
        <div className={styles.select2ColumnWrapper}>

            {/* gender_type */}
            <div className={styles.selectColumn}></div>
        </div>
        </>
    );
};