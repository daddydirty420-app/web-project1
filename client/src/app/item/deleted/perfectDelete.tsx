"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ApiError } from "../../../lib/api/apiError";
import { sleep } from "../../../lib/sleep";
import { fetchPerfectDeleteItem } from "../api/deleteItem";
import styles from "./deleted.module.css";

type Props = {
    id: string;
};

export const PerfectDelete = ({ id }: Props) => {
    const [popup, setPopup] = useState(false);
    const router = useRouter();

    const deleteItem = async () => {
        try {
            await fetchPerfectDeleteItem(id);

            toast.success("商品を削除しました");
            await sleep(1500);

            router.push("/my-page");
        } catch (err) {
            if (err instanceof ApiError) {
                toast.error("商品の削除に失敗しました");
                return;
            }

            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    return (
        <>
            <p className={styles.deleteText} onClick={() => setPopup(true)}>
                完全に削除する
            </p>

            {popup && (
                <>
                    <div className={styles.overlay} onClick={() => setPopup(false)} />

                    <div className={styles.popup}>
                        <X className={styles.x} onClick={() => setPopup(false)} />

                        <p className={styles.popupTitle}>確認</p>
                        <p className={styles.text13}>
                            ※
                            本当にこの商品を完全に削除しますか？完全削除した商品は元には戻りません。なお、削除から30日後には自動で完全削除されます。
                        </p>

                        <button type="button" className={styles.popupButton} onClick={deleteItem}>
                            完全に削除する
                        </button>
                    </div>
                </>
            )}
        </>
    );
};
