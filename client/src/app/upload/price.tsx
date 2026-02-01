"use client";

import { InputTitle } from "@/components/inputForm";
import styles from "./upload.module.css";
import { useEffect, useState } from "react";

export type PriceValue = {
    price: number;
};

type Props = {
    value: PriceValue;
    onChange: (v: PriceValue) => void;
};

export default function PriceInput({ value, onChange }: Props) {
    const [gain, setGain] = useState(0);
    const [commission, setCommission] = useState(0);

    useEffect(() => {
        if (value.price > 0) {
            setGain(value.price * 0.9);
            setCommission(value.price * 0.1);
        }
    }, [value.price]);

    const handleChangePrice = (num: number) => {
        onChange({
            ...value,
            price: num,
        });

        setGain(num * 0.9);
        setCommission(num * 0.1);
    };

    return (
        <>
        <div className={styles.inputDiv}>
            <InputTitle title="価格" hissu />
            
            <div className={styles.inputTextFlex}>
                <p className={styles.text14}>￥</p>
                <input
                type="text"
                value={value.price}
                onChange={(e) => handleChangePrice(Number(e.target.value))}
                placeholder="例：30,000"
                className={styles.input}
                inputMode="numeric"
                pattern="[0-9]*"
                required
                />
            </div>

            <p className={styles.centerSmall}>※ 300~1,000,000円の間で設定してください。</p>

            <div className={styles.text2Column}>
                <div className={styles.textFlex}>
                    <p className={styles.textFlexTitle}>利益：</p>
                    <p className={styles.textFlexMain}>￥{gain.toLocaleString()}</p>
                </div>

                <div className={styles.textFlex}>
                    <p className={styles.textFlexTitle}>販売手数料：</p>
                    <p className={styles.textFlexMain}>￥{commission.toLocaleString()}</p>
                </div>
            </div>
        </div>
        </>
    );
};