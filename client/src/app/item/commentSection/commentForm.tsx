"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ApiError } from "../../../lib/api/apiError";
import { fetchCommentCreate } from "../api/comment";
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
            await fetchCommentCreate({ itemId: id, sellerMe, parentId, inputComment });

            mutate();

            toast.success("コメントを投稿しました！");
        } catch (err) {
            mutate();

            if (err instanceof ApiError) {
                toast.error("コメントの投稿に失敗しました");
                return;
            }

            alert("システムエラーが発生しました。時間をおいて再試行してください");
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
