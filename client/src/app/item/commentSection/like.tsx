"use client";

import { updateCommentLikeCache, useLikeCount, useLikeStatus } from "@/hooks/useCommentLike";
import { getAccessToken } from "@/lib/getAccessToken";
import { faThumbsUp as faThumbUpRegular } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as faThumbsUpSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { Comment } from "../itemPageTypes";
import styles from "./comment.module.css";
import { ApiError } from "../../../lib/api/apiError";
import toast from "react-hot-toast";
import { fetchCommentLikeAdd } from "../api/commentLike";

type Props = {
    comment: Comment;
    loggedIn: boolean;
};

export const Like = ({ comment, loggedIn }: Props) => {
    const id = comment.id;
    const initialCount = comment.goodCount;
    const isMyComment = comment.isMyComment;
    const { data: goodStatus } = useLikeStatus(id);
    const { data: goodCount } = useLikeCount(id);
    const router = useRouter();

    const good = goodStatus?.isGood ?? false;
    const count = goodCount?.count ?? initialCount ?? 0;

    const add = async () => {
        updateCommentLikeCache(id, true);

        try {
            await fetchCommentLikeAdd(id);
        } catch (err) {
            updateCommentLikeCache(id, false);

            if (err instanceof ApiError) return;

            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    const remove = async () => {
        updateCommentLikeCache(id, false);

        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください");
                return;
            }

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment-like/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (err) {
            updateCommentLikeCache(id, true);
            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    const userList = () => isMyComment && router.push(`/user-list/comment-like/${id}`);

    return (
        <div className={styles.goodDiv} onClick={userList}>
            {loggedIn && !isMyComment && (
                <>
                    {good ? (
                        <FontAwesomeIcon
                            icon={faThumbsUpSolid}
                            className={clsx(styles.goodIcon, styles.isGood)}
                            onClick={remove}
                        />
                    ) : (
                        <FontAwesomeIcon
                            icon={faThumbUpRegular}
                            className={clsx(styles.goodIcon, styles.isNotGood)}
                            onClick={add}
                        />
                    )}
                </>
            )}

            {(!loggedIn || isMyComment) && <FontAwesomeIcon icon={faThumbUpRegular} className={styles.goodIcon} />}

            <p className={styles.goodCount}>{count.toLocaleString()}</p>
        </div>
    );
};
