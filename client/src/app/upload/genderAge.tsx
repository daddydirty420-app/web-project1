"use state";

import { InputTitle } from "@/components/inputForm";
import styles from "./upload.module.css";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

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

export default function GenderAge({ value, onChange, categoryConstraint }: Props) {
    const [genderLabelOptions, setGenderLabelOptions] = useState<string[]>(["メンズ", "レディース", "ユニセックス"]);
    const [ageLabelOptions, setAgeLabelOptions] = useState<string[]>(["大人向け", "キッズ向け", "指定なし"]);

    const [selectedGenderLabel, setSelectedGenderLabel] = useState("");
    const [selectedAgeLabel, setSelectedAgeLabel] = useState("");

    const [openGender, setOpenGender] = useState(false);
    const [openAge, setOpenAge] = useState(false);

    const allGenderOptions = ["men", "women", "unisex"] as const;
    const allAgeOptions = ["adult", "kids", "both"] as const;

    const genderOptions =
    !categoryConstraint?.allowed_gender
    || categoryConstraint.allowed_gender === "unisex"
    ? allGenderOptions
    : [categoryConstraint.allowed_gender];

    const ageOptions =
    !categoryConstraint?.allowed_age
    || categoryConstraint.allowed_age === "both"
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
        const nextGenderLabelOptions = genderOptions.map(
            (g) => genderLabelMap[g]
        );
        const nextAgeLabelOptions = ageOptions.map(
            (a) => ageLabelMap[a]
        );

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
            setSelectedGenderLabel(
                genderLabelMap[nextValue.gender_type]
            );
        }

        if (nextValue.age_type) {
            setSelectedAgeLabel(
                ageLabelMap[nextValue.age_type]
            );
        }
    }, [ageOptions, genderOptions, onChange, value]);

    const handleGenderSet = (label: string) => {
        const map: Record<string, GenderAgeValue["gender_type"]> = {
            "メンズ": "men",
            "レディース": "women",
            "ユニセックス": "unisex",
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
            "大人向け": "adult",
            "キッズ向け": "kids",
            "指定なし": "both", 
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
        <div className={styles.select2ColumnWrapper}>

            {/* gender_type */}
            <div className={styles.selectColumn}>
                <InputTitle title="着用対象（性別）" hissu />

                <input
                type="text"
                value={selectedGenderLabel}
                placeholder="着用対象を選択してください"
                className={styles.input}
                readOnly
                required
                onFocus={() => setOpenGender(true)}
                onBlur={() => setOpenGender(false)}
                />

                {openGender && (
                    <ul className={styles.selectUl}>
                        {genderLabelOptions.map((g) => (
                            <li
                            key={g}
                            onMouseDown={() => handleGenderSet(g)}
                            data-selected={selectedGenderLabel === g}
                            className={styles.selectLi}
                            >
                                {g}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* age_type */}
            <div className={styles.selectColumn}>
                <InputTitle title="着用対象（年齢）" hissu />

                <input
                type="text"
                value={selectedAgeLabel}
                placeholder="着用対象を選択してください"
                className={styles.input}
                readOnly
                required
                onFocus={() => setOpenAge(true)}
                onBlur={() => setOpenAge(false)}
                />

                {openAge && (
                    <ul className={styles.selectUl}>
                        {ageLabelOptions.map((a) => (
                            <li
                            key={a}
                            onMouseDown={() => handleAgeSet(a)}
                            data-selected={selectedAgeLabel === a}
                            className={styles.selectLi}
                            >
                                {a}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
        </>
    );
};