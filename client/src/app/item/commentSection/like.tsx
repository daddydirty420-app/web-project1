"use client";

import { updateCommentLikeCache, useLikeCount, useLikeStatus } from "@/hooks/useCommentLike";
import { faThumbsUp as faThumbUpRegular } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as faThumbsUpSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { ApiError } from "../../../lib/api/apiError";
import { fetchCommentLikeAdd, fetchCommentLikeRemove } from "../api/commentLike";
import { Comment } from "../itemPageTypes";
import styles from "./comment.module.css";

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
            await fetchCommentLikeRemove(id);
        } catch (err) {
            updateCommentLikeCache(id, true);

            if (err instanceof ApiError) return;

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
