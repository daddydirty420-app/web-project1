"use client";

import { InputTitle } from "@/components/inputForm";
import { useState } from "react";
import styles from "./upload.module.css";

export type MaterialValue = {
    material: string[];
};

type Props = {
    value: MaterialValue;
    onChange: (v: MaterialValue) => void;
};

export default function MaterialInput({ value, onChange }: Props) {
    const [text, setText] = useState(value.material.join("\n"));

    const handleBlur = () => {
        onChange({
            ...value,
            material: text
            .split("\n")
            .map(v => v.trim())
            .filter(Boolean),
        });
    };

    return (
        <div className={styles.inputDiv}>
            <InputTitle title="素材表記（自由入力）" />
            <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            maxLength={500}
            placeholder="素材表記（自由入力）"
            className={styles.textarea}
            />
        </div>
    );
};