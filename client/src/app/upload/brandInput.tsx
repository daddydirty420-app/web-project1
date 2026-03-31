"use client";

import { InputTitle } from "@/components/inputForm";
import styles from "./upload.module.css";
import { useEffect, useRef, useState } from "react";

export type BrandValue = {
    id: string | null;
    name: string;
};

type Props = {
    value: BrandValue;
    onChange: (v: BrandValue) => void;
};

export const BrandInput = ({ value, onChange }: Props) => {
    const [brandName, setBrandName] = useState("");
    const [openSuggest, setOpenSuggest] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);

    const [suggestions, setSuggestions] = useState<{
        id: string;
        name: string;
        name_normalized: string;
    }[]>([]);

    const suggestTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (value.id) {
            setBrandName(value.name);
        }
    }, [value.id, value.name]);

    useEffect(() => {
        if (brandName.length === 0) {
            setSuggestions([]);
            return;
        }
        if (isSelecting) {
            setSuggestions([]);
            return;
        }

        if (suggestTimeout.current) clearTimeout(suggestTimeout.current);

        suggestTimeout.current = setTimeout(async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands/suggest?keyword=${brandName}`, {
                    cache: "no-store",
                });

                const data = await res.json();

                if (!res.ok) {
                    console.error("ブランド名検索エラー：", data.message);
                    setSuggestions([]);
                    setOpenSuggest(false);
                    return;
                }

                setSuggestions(data.brands);
            } catch (err) {
                console.error(err);
                setSuggestions([]);
            }
        }, 300);

        return () => {
            if (suggestTimeout.current) clearTimeout(suggestTimeout.current);
        };
    }, [brandName, isSelecting, value.name]);

    const handleChangeBrand = (name: string) => {
        setBrandName(name);
        
        onChange({
            ...value,
            name
        });
    };

    return (
        <div className={styles.selectDiv}>
            <InputTitle title="ブランド名を入力" />
            <input
            type="text"
            value={brandName}
            onChange={(e) => handleChangeBrand(e.target.value)}
            placeholder="ブランド名を入力"
            onFocus={() => setOpenSuggest(true)}
            onBlur={() => setTimeout(() => setOpenSuggest(false), 150)}
            className={styles.input}
            />

            {openSuggest && suggestions.length > 0 && (
                <ul className={styles.selectUl}>
                    {suggestions.map((brand, i) => (
                        <li
                        key={i}
                        onMouseDown={() => {
                            setIsSelecting(true);
                            setBrandName(brand.name);
                            onChange({
                                id: brand.id,
                                name: brand.name,
                            });
                            setOpenSuggest(false);

                            setTimeout(() => setIsSelecting(false), 500);
                        }}
                        className={styles.selectLi}
                        >
                            {brand.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};