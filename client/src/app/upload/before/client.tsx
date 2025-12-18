"use client";

import Link from "next/link";
import styles from "../upload.module.css";
import UploadUI from "../uploadUI";
import { refreshToken } from "@/lib/refreshToken";
import { useRouter } from "next/navigation";

export default function Client() {
    const router = useRouter();

    const newItem = async () => {
        try {
            const accessToken = await refreshToken();
                        
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-upload/new-item-create`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "通信エラーが発生しました。")
                return;
            }

            router.push(`/upload/${data.itemId}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <UploadUI title="出品する">
            <button
            type="button"
            onClick={newItem}
            className={styles.newItemButton}
            >
                新しく出品する
            </button>

            <Link
            href="/item-list/draft"
            className={styles.draftListButton}
            >
                下書き一覧
            </Link>
        </UploadUI>
    );
};