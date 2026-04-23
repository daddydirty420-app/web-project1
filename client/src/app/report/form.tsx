"use client";

import { Button, InputTitle } from "@/components/inputForm";
import { getAccessToken } from "@/lib/getAccessToken";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { sleep } from "../../lib/sleep";
import styles from "./report.module.css";
import { Option } from "./type";

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
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください");
                return;
            }

            let res: Response;

            if (page === "item") {
                res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-report/${id}`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ selected }),
                });
            } else if (page === "comment") {
                res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment-report/${id}`, {
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
                await sleep(1500);

                router.back();
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                toast.error("報告の送信に失敗しました");
                return;
            }

            toast.success("報告を送信しました");
            await sleep(1500);

            router.back();
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください");
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
