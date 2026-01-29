"use client";

import { Textarea } from "@/components/inputForm";

export type MaterialValue = {
    material: string[];
};

type Props = {
    value: MaterialValue;
    onChange: (v: MaterialValue) => void;
};

export default function MaterialInput({ value, onChange }: Props) {
    return (
        <Textarea
        title="素材表記（自由入力）"
        value={value.material.join("\n")}
        onChange={(val) => onChange({
            ...value,
            material: val.split("\n").map(v => v.trim()).filter(Boolean),
        })}
        maxLength={500}
        placeholder="素材表記（自由入力）"
        />
    );
};