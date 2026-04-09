"use client"

import { useState } from "react";
import styles from "./report.module.css";
import { Option } from "./type";
import { useRouter } from "next/navigation";
import { Button, InputTitle } from "@/components/inputForm";
import toast from "react-hot-toast";
import { getAccessToken } from "@/lib/getAccessToken";

type Props = {
    id: string;
    options: Option[];
    page: "item" | "comment";
};

export const Form = ({ id, options, page }: Props) => {
    const [selected, setSelected] = useState<string>("");

    const router = useRouter();

    const submit = async () => {
        if (!selected || selected === "") {
            toast.error("報告内容が選択されていません");
            return;
        }

        try {
            const accessToken = await getAccessToken();
        
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            let res: Response;

            if (page === "item") {
                res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report/item/report-create/${id}`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ selected }),
                });
            } else if (page === "comment") {
                res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report/comment/report-create/${id}`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ selected }),
                });
            } else {
                console.error("ページが正しくありません");
                toast.error("ページが正しくありません");
                router.back();
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                toast.error("報告の送信に失敗しました");
                console.error(data.message);
                return;
            }

            toast.success("報告を送信しました");
            console.log(data.message);
            router.back();
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    return (
        <>
        <section className={styles.radioSection}>
            <InputTitle title="報告内容を選択してください" hissu />

            <div className={styles.radioColumn}>
                {options.map((option) => (
                    <label key={option.id} className={styles.radioLabel}>
                        <input
                        type="radio"
                        name="report"
                        value={option.name}
                        checked={selected === option.id}
                        onChange={() => setSelected(option.id)}
                        className={styles.radio}
                        required
                        />
                        <p className={styles.radioText}>{option.name}</p>
                    </label>
                ))}
            </div>
        </section>

        <Button onClick={submit}>報告する</Button>
        </>
    );
};