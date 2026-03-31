"use client";

import styles from "./seller.module.css";
import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/lib/refreshToken";

type Props = {
    id: string;
    page: "normal" | "admin" | "draft" | "confirm" | "deleted";
};

export const DeleteItem = ({ id, page }: Props) => {
    const [popup, setPopup] = useState(false);
    const router = useRouter();

    const deleteItem = async () => {
        const apiUrl = page === "draft"
        ? `${process.env.NEXT_PUBLIC_API_URL}/items/${id}/draft`
        : `${process.env.NEXT_PUBLIC_API_URL}/items/${id}/logical`;

        const routerPage = page === "draft"
        ? "/my-page"
        : `/item/deleted/${id}`;

        try {
            const accessToken = await refreshToken();
            
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                alert("商品を削除しました");
                setPopup(false);
                router.push(routerPage);
            } else if (data.message) {
                alert(data.message);
                console.error(data.message);
            }
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    return (
        <>
        <p className={styles.deleteText} onClick={() => setPopup(true)}>この商品を削除する</p>

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