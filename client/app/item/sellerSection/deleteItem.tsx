"use client";

import styles from "./seller.module.css";
import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/lib/refreshToken";

type Props = {
    id: string;
};

export default function DeleteItem({ id }: Props) {
    const [popup, setPopup] = useState(false);
    const router = useRouter();

    const deleteItem = async () => {
        try {
            const accessToken = await refreshToken();
            
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-page/delete-item-user/${id}`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                alert(data.message);
                setPopup(false);
                router.push(`/item/deleted/${id}`);
            } else {
                const errorData = await res.json();
                alert(errorData.message);
                console.error(errorData.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
        <p className={styles.deleteText} onClick={() => setPopup(true)}>商品を削除する</p>

        {popup && (
            <>
            <div className={styles.overlay} onClick={() => setPopup(false)} />

            <div className={styles.popup}>
                <X className={styles.x} onClick={() => setPopup(false)} />

                <p className={styles.popupTitle}>確認</p>
                <p className={styles.text13}>※ 本当にこの商品を削除しますか？削除した場合、商品データが無くなってしまいます。（売上金は無くなりません）</p>

                <button type="button" className={styles.popupButton} onClick={deleteItem}>削除する</button>
            </div>
            </>
        )}
        </>
    );
};