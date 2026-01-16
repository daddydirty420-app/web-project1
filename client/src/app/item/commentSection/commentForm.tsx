"use client";

import { useState } from "react";
import styles from "./comment.module.css";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/lib/refreshToken";
import toast from "react-hot-toast";

type Props = {
    id: string;
    sellerMe?: boolean;
    parentId?: string;
    loggedIn: boolean;
}

export default function CommentForm({ id, sellerMe, parentId, loggedIn }: Props) {
    const [inputComment, setInputComment] = useState<string>("");
    const router = useRouter();

    const upload = async () => {
        if (inputComment.length === 0) {
            toast.error("コメントを入力してください。");
            return;
        }

        try {
            const accessToken = await refreshToken();
            
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/upload/${id}?sellerMe=${sellerMe}&parentId=${parentId}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ inputComment }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                toast.error("コメントの投稿に失敗しました。");
                console.error(errorData.message);
                return;
            }

            toast.success("コメントを投稿しました！");
            setInputComment("");
            router.refresh();
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    return (
        <>
        <label className={styles.commentLabel}>
            <textarea
            name="commentInput"
            value={inputComment}
            onChange={(e) => setInputComment(e.target.value)}
            maxLength={150}
            placeholder="コメントを入力（150文字以内）"
            required
            className={styles.commentInput}
            />
        </label>

        <button type="button" className={styles.commentUploadButton} onClick={loggedIn ? upload : () => router.push("/login")}>投稿する</button>
        </>
    );
};