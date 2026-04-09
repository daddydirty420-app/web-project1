"use client";

import { useState } from "react";
import styles from "../../edit.module.css";
import { ComOrFreeOption, ShopInfo } from "../../type";
import { useRouter } from "next/navigation";
import EditUI from "../../editUI";
import { Button, InputTitle } from "@/components/inputForm";
import clsx from "clsx";
import toast from "react-hot-toast";
import { getAccessToken } from "@/lib/getAccessToken";

type Props = {
    shopId: string;
    shopInfo: ShopInfo;
    ComOrFreeOption: ComOrFreeOption[];
};

export const Form = ({ shopId, shopInfo, ComOrFreeOption }: Props) => {
    const [selectOption, setSelectOption] = useState(shopInfo.ComOrFreeOption?.id ?? "");

    const router = useRouter();

    const submit = async () => {
        if (selectOption === null || selectOption === undefined) {
            toast.error("事業形態を選択してください。");
            return;
        }

        if (shopInfo.ComOrFreeOption?.id === selectOption) {
            toast.error("事業形態が変更されていません。");
            return;
        }

        try {
            const accessToken = await getAccessToken();
                
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-com-free/com-free-edit/${shopId}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ selectOption }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error("事業形態の更新に失敗しました。");
                console.error(data.message);
                return;
            }

            router.push(`/edit/shop/com-free/confirm/${data.editId}`);
        } catch (err) {
            console.error(err);
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
        }
    };

    return (
        <EditUI title="事業形態の変更">
            <section className={styles.radioSection}>
                <InputTitle title="事業形態：" />
                <div className={styles.radioColumn}>
                    {ComOrFreeOption.map((option) => (
                        <label key={option.id} className={styles.radioLabel}>
                            <input
                            type="radio"
                            name="comfree"
                            value={option.name}
                            checked={selectOption === option.id}
                            onChange={() => setSelectOption(option.id)}
                            className={styles.radio}
                            required
                            />
                            <p className={styles.radioText}>{option.name}</p>
                        </label>
                    ))}
                </div>
            </section>

            <p className={clsx(styles.centerSmall, "mt-4")}>※事業形態の変更は審査が必要になります。登録される事業形態の変更は審査が完了し次第となります。審査には1~2週間ほどお時間を頂戴しております。</p>

            <Button onClick={submit}>次へ</Button>
        </EditUI>
    );
};