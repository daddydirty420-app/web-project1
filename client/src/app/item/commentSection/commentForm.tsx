"use client";

import { getAccessToken } from "@/lib/getAccessToken";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Comment, Item, User } from "../itemPageTypes";
import styles from "./comment.module.css";

type Props = {
    id: string;
    sellerMe?: boolean;
    parentId?: string;
    loggedIn: boolean;
    mutate: (updater?: ((current: Comment[]) => Comment[]) | Comment[], revalidate?: boolean) => void;
    item: Item;
    me: User | null;
};

export const CommentForm = ({ id, sellerMe, parentId, loggedIn, item, me, mutate }: Props) => {
    const [inputComment, setInputComment] = useState<string>("");
    const router = useRouter();

    const upload = async () => {
        if (!loggedIn || !me) {
            toast.error("ログインしてください");
            router.push("/login");
            return;
        }

        if (inputComment.length === 0) {
            toast.error("コメントを入力してください");
            return;
        }

        // 楽観的更新
        const optimisticComment: Comment = {
            id: crypto.randomUUID(),

            text: inputComment,
            sort_number: Date.now(), // 仮のソート用（あとでサーバー値に同期）
            item_id: id,
            user_id: me.id,
            parent_comment_id: parentId ?? "",

            createdAt: new Date(),
            updatedAt: new Date(),

            pin: false,
            replyCount: 0,
            isMyComment: true,
            isGoodByMe: false,
            goodCount: 0,
            reportCount: 0,

            User: me,
            Item: item,
        };

        mutate((current: Comment[] = []) => [optimisticComment, ...current], false);

        setInputComment("");

        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                throw new Error("AUTH_ERROR");
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/comment/${id}?sellerMe=${sellerMe}&parentId=${parentId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ inputComment }),
                },
            );

            if (!res.ok) {
                throw new Error("UPLOAD_ERROR");
            }

            mutate();

            toast.success("コメントを投稿しました！");
        } catch (err) {
            mutate();

            if (err instanceof Error) {
                if (err.message === "AUTH_ERROR") {
                    alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください");
                } else if (err.message === "UPLOAD_ERROR") {
                    toast.error("コメントの投稿に失敗しました");
                } else {
                    alert("システムエラーが発生しました。時間をおいて再試行してください");
                }
            }
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

            <button
                type="button"
                className={styles.commentUploadButton}
                onClick={loggedIn ? upload : () => router.push("/login")}
            >
                投稿する
            </button>
        </>
    );
};
