"use client";

import styles from "./comment.module.css";
import { Session } from "next-auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as faThumbsUpSolid } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as faThumbUpRegular } from "@fortawesome/free-regular-svg-icons";
import { Comment } from "../itemPageTypes";
import { updateGoodCommentCache, useGoodCount, useGoodStatus } from "@/hooks/useGoodComment";
import clsx from "clsx";
import { useRouter } from "next/navigation";

type Props = {
    comment: Comment;
    session: Session | null;
}

export default function Good({ comment, session }: Props) {
    const id = comment.id;
    const initialGood = comment.isGoodByMe;
    const initialCount = comment.goodCount;
    const isMyComment = comment.isMyComment;
    const loggedIn = !!session?.user;
    const accessToken = session?.accessToken;
    const { data: goodStatus } = useGoodStatus(id, accessToken ?? "");
    const { data: goodCount } = useGoodCount(id, accessToken ?? "");
    const router = useRouter();

    const good = goodStatus?.isGood ?? initialGood ?? false;
    const count = goodCount?.count ?? initialCount ?? 0;

    const add = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/good-comment/add/${id}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${session?.accessToken ?? ""}`,
            },
        });
        updateGoodCommentCache(id, true);
    };

    const remove = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/good-comment/remove/${id}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${session?.accessToken ?? ""}`,
            },
        });
        updateGoodCommentCache(id, false);
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
    )
}