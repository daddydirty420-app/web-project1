"use state";

import { InputTitle } from "@/components/inputForm";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "./upload.module.css";

export type GenderAgeValue = {
    gender_type: "men" | "women" | "unisex" | null;
    age_type: "adult" | "kids" | "both" | null;
};

type Props = {
    value: GenderAgeValue;
    onChange: (v: GenderAgeValue) => void;
    categoryConstraint: {
        allowed_gender: "men" | "women" | "unisex" | null;
        allowed_age: "adult" | "kids" | "both" | null;
    } | null;
};

export const GenderAge = ({ value, onChange, categoryConstraint }: Props) => {
    const [genderLabelOptions, setGenderLabelOptions] = useState<string[]>(["メンズ", "レディース", "ユニセックス"]);
    const [ageLabelOptions, setAgeLabelOptions] = useState<string[]>(["大人向け", "キッズ向け", "指定なし"]);

    const [selectedGenderLabel, setSelectedGenderLabel] = useState("");
    const [selectedAgeLabel, setSelectedAgeLabel] = useState("");

    const allGenderOptions = ["men", "women", "unisex"] as const;
    const allAgeOptions = ["adult", "kids", "both"] as const;

    const genderOptions =
        !categoryConstraint?.allowed_gender || categoryConstraint.allowed_gender === "unisex"
            ? allGenderOptions
            : [categoryConstraint.allowed_gender];

    const ageOptions =
        !categoryConstraint?.allowed_age || categoryConstraint.allowed_age === "both"
            ? allAgeOptions
            : [categoryConstraint.allowed_age];

    const genderLabelMap = {
        men: "メンズ",
        women: "レディース",
        unisex: "ユニセックス",
    } as const;
    const ageLabelMap = {
        adult: "大人向け",
        kids: "キッズ向け",
        both: "指定なし",
    } as const;

    useEffect(() => {
        const nextGenderLabelOptions = genderOptions.map((g) => genderLabelMap[g]);
        const nextAgeLabelOptions = ageOptions.map((a) => ageLabelMap[a]);

        setGenderLabelOptions(nextGenderLabelOptions);
        setAgeLabelOptions(nextAgeLabelOptions);

        let nextValue = value;

        if (genderOptions.length === 1 && value.gender_type !== genderOptions[0]) {
            nextValue = {
                ...nextValue,
                gender_type: genderOptions[0],
            };
        }

        if (ageOptions.length === 1 && value.age_type !== ageOptions[0]) {
            nextValue = {
                ...nextValue,
                age_type: ageOptions[0],
            };
        }

        if (nextValue !== value) {
            onChange(nextValue);
        }

        if (nextValue.gender_type) {
            setSelectedGenderLabel(genderLabelMap[nextValue.gender_type]);
        }

        if (nextValue.age_type) {
            setSelectedAgeLabel(ageLabelMap[nextValue.age_type]);
        }
    }, [ageOptions, genderOptions, onChange, value]);

    const handleGenderSet = (label: string) => {
        const map: Record<string, GenderAgeValue["gender_type"]> = {
            メンズ: "men",
            レディース: "women",
            ユニセックス: "unisex",
        };

        const gender = map[label];

        if (!gender) {
            toast.error("着用対象（性別）が正しく選択されていません");
            return;
        }

        setSelectedGenderLabel(label);

        if (value.gender_type !== gender) {
            onChange({
                ...value,
                gender_type: gender,
            });
        }
    };

    const handleAgeSet = (label: string) => {
        const map: Record<string, GenderAgeValue["age_type"]> = {
            大人向け: "adult",
            キッズ向け: "kids",
            指定なし: "both",
        };

        const age = map[label];

        if (!age) {
            toast.error("着用対象（年齢）が正しく設定されていません。");
            return;
        }

        setSelectedAgeLabel(label);

        if (value.age_type !== age) {
            onChange({
                ...value,
                age_type: age,
            });
        }
    };

    return (
        <>
            <div className={styles.twoColumnWrapper}>
                {/* gender_type */}
                <div className={styles.radioSection}>
                    <InputTitle title="着用対象（性別）" hissu />

                    <div className={styles.radioColumn}>
                        {genderLabelOptions.map((g) => (
                            <label key={g} className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="gender_type"
                                    value={g}
                                    checked={selectedGenderLabel === g}
                                    onChange={() => handleGenderSet(g)}
                                    className={styles.radio}
                                    required
                                />
                                <p className={styles.radioText}>{g}</p>
                            </label>
                        ))}
                    </div>
                </div>

                {/* age_type */}
                <div className={styles.radioSection}>
                    <InputTitle title="着用対象（年齢）" hissu />

                    <div className={styles.radioColumn}>
                        {ageLabelOptions.map((a) => (
                            <label key={a} className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="age_type"
                                    value={a}
                                    checked={selectedAgeLabel === a}
                                    onChange={() => handleAgeSet(a)}
                                    className={styles.radio}
                                    required
                                />
                                <p className={styles.radioText}>{a}</p>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
