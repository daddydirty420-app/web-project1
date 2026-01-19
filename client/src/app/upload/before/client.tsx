"use client";

import Link from "next/link";
import styles from "../upload.module.css";
import UploadUI from "../uploadUI";
import { refreshToken } from "@/lib/refreshToken";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error("通信エラーが発生しました。");
                return;
            }

            const itemId = data.itemId;
            console.log(itemId);

            router.push(`/upload/${itemId}`);
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
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