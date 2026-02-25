"use client";

import styles from "./comment.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as faThumbsUpSolid } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as faThumbUpRegular } from "@fortawesome/free-regular-svg-icons";
import { Comment } from "../itemPageTypes";
import { updateGoodCommentCache, useGoodCount, useGoodStatus } from "@/hooks/useGoodComment";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/lib/refreshToken";

type Props = {
    comment: Comment;
    loggedIn: boolean;
}

export const Good = ({ comment, loggedIn }: Props) => {
    const id = comment.id;
    const initialCount = comment.goodCount;
    const isMyComment = comment.isMyComment;
    const { data: goodStatus } = useGoodStatus(id);
    const { data: goodCount } = useGoodCount(id);
    const router = useRouter();

    const good = goodStatus?.isGood ?? false;
    const count = goodCount?.count ?? initialCount ?? 0;

    const add = async () => {
        updateGoodCommentCache(id, true);

        try {
            const accessToken = await refreshToken();
            
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/good-comment/add/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (err) {
            updateGoodCommentCache(id, false);
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    const remove = async () => {
        updateGoodCommentCache(id, false);

        try {
            const accessToken = await refreshToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/good-comment/remove/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (err) {
            updateGoodCommentCache(id, true);
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    const userList = () => isMyComment && router.push(`/user-list/good-comment/${id}`);

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

            {(!loggedIn || isMyComment) && (
                <FontAwesomeIcon icon={faThumbUpRegular} className={styles.goodIcon} />
            )}

            <p className={styles.goodCount}>{count.toLocaleString()}</p>
        </div>
    );
}