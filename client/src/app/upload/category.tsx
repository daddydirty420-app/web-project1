"use client";

import { useEffect, useRef, useState } from "react";
import { Categories } from "./type";
import styles from "./upload.module.css";
import toast from "react-hot-toast";
import { InputTitle } from "@/components/inputForm";

export type CategoryValue = {
    id: string | null;
    name: string;
    parent_id: number | null;
    level: number | null;
};

type Props = {
    level1List: Categories[];
    value: CategoryValue;
    onChange: (v: CategoryValue) => void;
};

export default function Category({ level1List, value, onChange }: Props) {
    const [level2List, setLevel2List] = useState<Categories[]>([]);
    const [displayLevel1, setDisplayLevel1] = useState("");
    const [displayLevel2, setDisplayLevel2] = useState("");
    const [loading, setLoading] = useState(false);
    const [openLevel1, setOpenLevel1] = useState(false);
    const [openLevel2, setOpenLevel2] = useState(false);

    const initializedRef = useRef(false);

    useEffect(() => {
        if (initializedRef.current) return;
        if (!value.id || value.level === null) return;

        if (value.level === 1) {
            setDisplayLevel1(value.name);
            return;
        }

        if (value.level === 2 && value.parent_id) {
            const parent = level1List.find(
                (cat) => cat.id === String(value.parent_id)
            );

            setDisplayLevel1(parent?.name ?? "");
            setDisplayLevel2(value.name);

            fetchLevel2(value.parent_id);
        }

        initializedRef.current = true;
    }, [value, level1List]);

    const handleLevel1Set = (cat: CategoryValue) => {
        setLoading(true);

        onChange({
            ...value,
            id: cat.id,
            name: cat.name,
            parent_id: null,
            level: 1
        });

        setDisplayLevel1(cat.name);
        setDisplayLevel2("");
        setOpenLevel1(false);

        const idNum = Number(cat.id);

        fetchLevel2(idNum);
    };

    const fetchLevel2 = async (parentId: number) => {
        setLoading(true);
        setLevel2List([]);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-upload/category2/${parentId}`, {
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data.message);
                toast.error("詳細カテゴリーの取得に失敗しました。");
                setLoading(false);
                return;
            }

            const category2 = data.category2;

            setLevel2List(category2);
            setLoading(false);
        } catch (err) {
            toast.error("詳細カテゴリーの取得に失敗しました。");
            console.error(err);
            setLoading(false);
        }
    };

    const handleLevel2Set = (cat: CategoryValue) => {
        const display1 = displayLevel1;

        onChange({
            ...value,
            id: cat.id,
            name: cat.name,
            parent_id: cat.parent_id,
            level: 2,
        });

        setDisplayLevel2(cat.name);
        setOpenLevel2(false);
        setDisplayLevel1(display1);
    };

    return (
        <div className={styles.categoryWrapper}>

            {/* category1 */}
            <div className={styles.categoryColumn}>
                <InputTitle title="カテゴリー" hissu />

                <input
                type="text"
                value={displayLevel1}
                placeholder="カテゴリーを選択してください"
                className={styles.categoryInput}
                readOnly
                onFocus={() => setOpenLevel1(true)}
                onBlur={() => setOpenLevel1(false)}
                />

                {openLevel1 && (
                    <ul className={styles.categoryList}>
                        {level1List.map((cat) => (
                            <li
                            key={cat.id}
                            onMouseDown={() => handleLevel1Set(cat)}
                            className={styles.listLi}
                            >
                                {cat.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* category2 */}
            <div className={styles.categoryColumn}>
                <InputTitle title="詳細カテゴリー" />

                <input
                type="text"
                value={displayLevel2}
                placeholder="カテゴリーを選択してください"
                className={styles.categoryInput}
                readOnly
                onFocus={() => setOpenLevel2(true)}
                onBlur={() => setOpenLevel2(false)}
                />

                {!loading && openLevel2 && (
                    <ul className={styles.categoryList}>
                        {level2List.map((cat) => (
                            <li
                            key={cat.id}
                            onMouseDown={() => handleLevel2Set(cat)}
                            className={styles.listLi}
                            >
                                {cat.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
