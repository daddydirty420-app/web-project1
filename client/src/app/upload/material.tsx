"use client";

import styles from "./material.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export type MaterialValue = {
    materials: {
        name: string;
        ratio: number;
    }[];
};

type Props = {
    value: MaterialValue;
    onChange: (v: MaterialValue) => void;
};

export default function MaterialInput({ value, onChange }: Props) {

    const createEmptyMaterial = () => ({
        name: "",
        ratio: 1,
    });

    const addMaterial = () => {
        onChange({
            ...value,
            materials: [...value.materials, createEmptyMaterial()],
        });
    };

    const removeMaterial = (index: number) => {
        const nextMaterials = value.materials.filter((_, i) => i !== index);

        onChange({
            ...value,
            materials: nextMaterials,
        });
    };

    const handleChangeName = (name: string, index: number) => {
        onChange({
            ...value,
            materials: value.materials.map((m, i) =>
                i === index
                ? {
                    ...m,
                    name: name,
                } : m
            ),
        });
    };

    const handleChangeRatio = (ratio: number, index: number) => {
        onChange({
            ...value,
            materials: value.materials.map((m, i) =>
                i === index
                ? {
                    ...m,
                    ratio: ratio,
                } : m
            ),
        });
    };

    return (
        <div className={styles.materialDiv}>
            {value.materials.map((m, index) => (
                <div className={styles.materialRow} key={index}>
                    <div className={styles.inputDiv}>
                        <p className={styles.inputTitle}>素材名</p>
                        <input
                        type="text"
                        value={m.name ?? ""}
                        onChange={(e) => handleChangeName(e.target.value, index)}
                        placeholder="例：綿"
                        className={styles.nameInput}
                        />
                    </div>

                    <div className={styles.inputDiv}>
                        <p className={styles.inputTitle}>割合</p>
                        <div className={styles.ratioRow}>
                            <input
                            type="number"
                            min={1}
                            max={100}
                            value={m.ratio}
                            onChange={(e) => handleChangeRatio(Number(e.target.value), index)}
                            placeholder="100"
                            className={styles.ratioInput}
                            />
                            <p className={styles.ratio}>%</p>
                        </div>
                    </div>

                    <FontAwesomeIcon
                    icon={faTrash}
                    className={styles.delete}
                    onClick={() => removeMaterial(index)}
                    />
                </div>
            ))}

            <button
            type="button"
            className={styles.addButton}
            onClick={addMaterial}
            >
                + 素材追加（自由入力）
            </button>
        </div>
    );
};