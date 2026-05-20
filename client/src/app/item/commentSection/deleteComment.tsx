"use client";

import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ApiError } from "../../../lib/api/apiError";
import { sleep } from "../../../lib/sleep";
import { fetchCommentDelete } from "../api/comment";
import { Comment } from "../itemPageTypes";
import Portial from "../portial";
import styles from "./comment.module.css";

type Props = {
    comment: Comment;
    page: "normal" | "admin";
};

export const DeleteComment = ({ comment, page }: Props) => {
    const [popup, setPopup] = useState(false);
    const router = useRouter();

    const deleteComment = async () => {
        try {
            await fetchCommentDelete({ commentId: comment.id, page });

            toast.success("コメントを削除しました");
            await sleep(1500);

            router.refresh();
        } catch (err) {
            if (err instanceof ApiError) {
                toast.error("コメント削除エラー");
                return;
            }

            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    return (
        <>
            <div className={styles.deleteDiv} onClick={() => setPopup(true)}>
                <FontAwesomeIcon icon={faTrashCan} className={styles.deleteIcon} />
                <p className={styles.deleteText}>削除</p>
            </div>

            {popup && (
                <Portial>
                    <div className={styles.overlay} onClick={() => setPopup(false)} />

                    <div className={styles.popup}>
                        <X className={styles.x} onClick={() => setPopup(false)} />

                        <p className={styles.popupTitle}>確認</p>
                        <p className={styles.popupText}>※ 本当にこのコメントを削除しますか？</p>
                        <p className={styles.popupComment}>「{comment.text}」</p>

                        <button type="button" className={styles.popupButton} onClick={deleteComment}>
                            削除する
                        </button>
                    </div>
                </Portial>
            )}
        </>
    );
};
