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
    return (
        <>
        
        </>
    );
};