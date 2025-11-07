"use client";

import { useState } from "react";
import styles from "./comment.module.css";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

type Props = {
    id: string;
    sellerMe?: boolean;
    session: Session | null;
    parentId?: string;
}

export default function CommentForm({ id, sellerMe, session, parentId }: Props) {
    const [inputComment, setInputComment] = useState<string>("");
    const router = useRouter();
    const loggedIn = !!session?.user;

    const upload = async () => {
        if (inputComment.length === 0) {
            alert("コメントを入力してください。");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/upload/${id}?sellerMe=${sellerMe}&parentId=${parentId}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${session?.accessToken ?? ""}`,
                },
                body: JSON.stringify({ inputComment }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert(errorData.message);
                return;
            }

            alert("コメントを投稿しました！");
            setInputComment("");
            router.refresh();
        } catch (err) {
            console.error(err);
        }
    }

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