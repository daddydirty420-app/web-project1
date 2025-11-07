"use client";

import { Session } from "next-auth";
import { Item } from "../itemPageTypes";
import styles from "./deleted.module.css";
import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
    id: string;
    item: Item;
    session: Session | null;
};

export default function Restore({ id, item, session }: Props) {
    const [popup, setPopup] = useState(false);
    const router = useRouter();

    const restore = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-page/restore-item/${id}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${session?.accessToken ?? ""}`,
                },
            });

            if (!res.ok) {
                console.error("APIフェッチエラー：", res.status);
                alert("商品の復元に失敗しました。通信環境を確認し、もう一度ボタンをクリックしてください。");
                return;
            }

            const data = await res.json();
            alert(data.message);
            router.push(`/item/${id}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
        <button
        type="button"
        className={styles.restoreButton}
        onClick={() => setPopup(true)}
        >
            復元する
        </button>

        {popup && (
            <>
            <div className={styles.overlay} onClick={() => setPopup(false)} />

            <div className={styles.popup}>
                <X className={styles.x} onClick={() => setPopup(false)} />
                
                <p className={styles.popupTitle}>商品を復元しますか？</p>

                <p className={styles.itemName}>{item.name}</p>
                <p className={styles.text12}>※商品が売り切れでない場合、再度商品が販売されます。また、売り切れである場合も含めて、商品および関連情報が一般公開されます。また、再生回数等一部データは元に戻らず、0からカウント再開となります。</p>

                <button
                type="button"
                className={styles.popupButton}
                onClick={restore}
                >
                    復元する
                </button>
            </div>
            </>
        )}
        </>
    );
};