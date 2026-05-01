"use client";

import { getAccessToken } from "@/lib/getAccessToken";
import { X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { sleep } from "../../../lib/sleep";
import { Item } from "../itemPageTypes";
import styles from "./admin.module.css";
import { useRouter } from "next/navigation";

type Props = {
    id: string;
    item: Item;
};

export const DeleteButton = ({ id, item }: Props) => {
    const [popup, setPopup] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");

    const router = useRouter();

    const deleteItem = async () => {
        if (!deleteReason || deleteReason === "") {
            toast.error("削除理由を入力してください");
            return;
        }

        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/items/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ deleteReason }),
            });

            await res.json();

            if (!res.ok) {
                toast.error("商品の削除に失敗しました");
                await sleep(2000);

                setDeleteReason("");
                setPopup(false);
                return;
            }
            toast.success("商品を削除しました");
            await sleep(2000);

            setDeleteReason("");
            setPopup(false);
            router.refresh();
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    return (
        <>
            <p className={styles.title}>{item.name}</p>
            <button type="button" className={styles.deleteButton} onClick={() => setPopup(true)}>
                item削除
            </button>

            {popup && (
                <>
                    <div className={styles.overlay} onClick={() => setPopup(false)} />

                    <div className={styles.popup}>
                        <X className={styles.x} onClick={() => setPopup(false)} />

                        <p className={styles.popupTitle}>本当に削除しますか？</p>

                        <p className={styles.text13}>
                            ※本当にこの商品を削除しますか？削除した場合、商品のデータがすべて無くなってしまいます。
                        </p>

                        <label>
                            <input
                                type="text"
                                name="deleteReason"
                                value={deleteReason}
                                onChange={(e) => setDeleteReason(e.target.value)}
                                placeholder="削除理由"
                                className={styles.input}
                                required
                            />
                        </label>

                        <button type="button" className={styles.popupButton} onClick={deleteItem}>
                            削除する
                        </button>
                    </div>
                </>
            )}
        </>
    );
};
