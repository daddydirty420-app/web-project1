"use client";

import { getAccessToken } from "@/lib/getAccessToken";
import { useEffect, useState } from "react";
import { Comment } from "../itemPageTypes";
import styles from "./comment.module.css";
import { CommentDataDiv } from "./commentDataDiv";
import { CommentText } from "./commentText";
import { DeleteComment } from "./deleteComment";
import { Like } from "./like";
import { Pin } from "./pin";
import { ProfileImage } from "./profileImage";
import { ReportFloat } from "./reportFloat";

type Props = {
    parentId: string;
    page: "normal" | "admin";
    loggedIn: boolean;
    sellerMe?: boolean;
    optimisticComments?: Comment[];
    refreshTrigger?: number;
};

export const ReplyList = ({ parentId, page, loggedIn, sellerMe, optimisticComments = [], refreshTrigger }: Props) => {
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        const fetchComment = async () => {
            try {
                const accessToken = await getAccessToken();

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/comment/${parentId}/reply?sellerMe=${sellerMe}${page === "admin" ? "?admin=true" : ""}`,
                    {
                        method: "GET",
                        headers: {
                            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
                        },
                        cache: "no-store",
                    },
                );

                if (!res.ok) {
                    console.error("APIフェッチエラー：", res.status);
                    return;
                }

                const data = await res.json();
                setComments(data.commentList);
            } catch (err) {}
        };

        fetchComment();
    }, [parentId, page, refreshTrigger]);

    const allComments = [...optimisticComments, ...comments];

    const isOptimistic = (id: string) => {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    };

    return (
        <>
            <section className={styles.replyListWrapper}>
                {allComments?.map((comment) => {
                    if (!comment) return null;
                    const optimistic = isOptimistic(String(comment.id));

                    return (
                        <section className={styles.commentListSection} key={comment.id}>
                            <section className={styles.commentFlex}>
                                <ProfileImage user={comment.User} />
                                <div className={styles.commentMain}>
                                    {comment.pin && <Pin />}

                                    <CommentDataDiv comment={comment} />
                                    <CommentText comment={comment} page={page} />

                                    <div className={styles.commentEditDiv}>
                                        {!optimistic && (
                                            <>
                                                <Like comment={comment} loggedIn={loggedIn} />
                                                <ReportFloat comment={comment} page={page} />

                                                {comment.isMyComment && <DeleteComment comment={comment} page={page} />}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </section>
                    );
                })}
            </section>
        </>
    );
};
