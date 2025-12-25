"use client";

import { useState } from "react";
import { Item } from "../itemPageTypes";
import styles from "./admin.module.css";
import { X } from "lucide-react";
import { refreshToken } from "@/lib/refreshToken";

type Props = {
    id: string;
    item: Item;
}

export default function DeleteButton({ id, item }: Props) {
    const [popup, setPopup] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");

    const deleteItem = async () => {
        if (!deleteReason || deleteReason === "") return;

        try {
            const accessToken = await refreshToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-admin/delete-item/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ deleteReason }),
            });

            if (res.ok) {
                const data = await res.json();
                alert(data.message);
                setPopup(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
        <p className={styles.title}>{item.name}</p>
        <button type="button" className={styles.deleteButton} onClick={() => setPopup(true)}>item削除</button>

        {popup && (
            <>
            <div className={styles.overlay} onClick={() => setPopup(false)} />
            
            <div className={styles.popup}>
                <X className={styles.x} onClick={() => setPopup(false)} />
                
                <p className={styles.popupTitle}>本当に削除しますか？</p>
                <p className={styles.text13}>※本当にこの商品を削除しますか？削除した場合、商品のデータがすべて無くなってしまいます。</p>

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

                <button type="button" className={styles.popupButton} onClick={deleteItem}>削除する</button>
            </div>
            </>
        )}
        </>
    );
}