"use client";

import { Session } from "next-auth";
import styles from "../ss.module.css";
import SSUI from "../ssUI";
import { ComOrFreeOption } from "../type";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ButtonDiv from "../buttonDiv";

type Props = {
    session: Session | null;
    ComOrFreeOption: ComOrFreeOption[];
};

export default function Form({ session, ComOrFreeOption }: Props) {
    const [selectOption, setSelectOption] = useState<number | null>(null);
    const [check, setCheck] = useState(false);

    const router = useRouter();

    const submit = async () => {
        if (!selectOption || !check) {
            alert("未入力の項目があります。");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-signup/signup1-create`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${session?.accessToken ?? ""}`,
                },
                body: JSON.stringify({ optionId: selectOption }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                console.error(data.message);
                return;
            }

            router.push(`/shop-signup/2/${data.id}`);
        } catch (err) {
            console.error(err);
        }
    };

    const backSubmit = () => router.back();

    return (
        <SSUI title="ショップ登録">
            <h2 className={styles.subtitle}>事業形態</h2>

            <div className={styles.radioFlex}>
                <p className={styles.text14}>事業形態を選択</p>
                <div className={styles.radioColumn}>
                    {ComOrFreeOption.map((option) => (
                        <label key={option.id} className={styles.radio}>
                            <input
                            type="radio"
                            name="comorfree"
                            value={option.name}
                            checked={selectOption === option.id}
                            onChange={() => setSelectOption(option.id)}
                            className="cursor-pointer"
                            />
                            {option.name}
                        </label>
                    ))}
                </div>
            </div>

            <h2 className={styles.subtitle}>利用規約・プライバシーポリシー</h2>

            <p className={styles.linkText}>事前に
                <Link href="/terms-and-conditions" className={styles.link}>利用規約</Link>
                および
                <Link href="/privacy-policy" className={styles.link}>プライバシーポリシー</Link>
                をご確認ください。
            </p>

            <label className={styles.checkbox}>
                <input
                type="checkbox"
                name="checkbox"
                checked={check}
                onChange={() => setCheck(!check)}
                />
                利用規約およびプライバシーポリシーに同意します。
            </label>

            <ButtonDiv nextClick={submit} backClick={backSubmit} />
        </SSUI>
    );
};