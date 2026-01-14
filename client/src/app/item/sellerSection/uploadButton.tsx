"use client";

import styles from "./seller.module.css";
import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/lib/refreshToken";

type Props = {
    id: string;
};

export default function UploadButton({ id }: Props) {
    const router = useRouter();

    const copy = async () => {
        try {
            const accessToken = await refreshToken();
            
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-page/copy-upload/${id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                const newItemId = data.newItemId;
                const url = `/upload/copy/${newItemId}`;
                router.push(url);
            } else {
                const errorData = await res.json();
                console.error(errorData.message);
            }
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    return (
        <div className={styles.buttonDiv}>
            <button type="button" className={styles.blackButton} onClick={copy}>コピー出品</button>
            <Link href={`/upload/edit/${id}`} className={clsx(styles.blackButton, styles.edit)}>商品を編集する</Link>
        </div>
    );
};