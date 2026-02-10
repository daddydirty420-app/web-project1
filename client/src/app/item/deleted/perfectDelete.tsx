"use client";

import styles from "./deleted.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { refreshToken } from "@/lib/refreshToken";
import toast from "react-hot-toast";

type Props = {
    id: string;
};

export const PerfectDelete = ({ id }: Props) => {
    const [popup, setPopup] = useState(false);
    const router = useRouter();
    
    const deleteItem = async () => {
        try {
            const accessToken = await refreshToken();
            
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-page/perfect-delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                alert(data.message);
                router.push("/item-list/deleted");
            } else {
                console.error("APIフェッチエラー：", res.status);
                toast.error("商品の削除に失敗しました。");
            }
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    return (
        <>
        <p className={styles.deleteText} onClick={() => setPopup(true)}>完全に削除する</p>

        {popup && (
            <>
            <div className={styles.overlay} onClick={() => setPopup(false)} />

            <div className={styles.popup}>
                <X className={styles.x} onClick={() => setPopup(false)} />

                <p className={styles.popupTitle}>確認</p>
                <p className={styles.text13}>※ 本当にこの商品を完全に削除しますか？完全削除した商品は元には戻りません。なお、削除から30日後には自動で完全削除されます。</p>

                <button
                type="button"
                className={styles.popupButton}
                onClick={deleteItem}
                >
                    完全に削除する
                </button>
            </div>
            </>
        )}
        </>
    );
};