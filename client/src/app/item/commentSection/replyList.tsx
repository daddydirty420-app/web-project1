"use client";

import styles from "./comment.module.css";
import { ProfileImage } from "./profileImage";
import { Comment } from "../itemPageTypes";
import { useEffect, useState } from "react";
import { Pin } from "./pin";
import { CommentDataDiv } from "./commentDataDiv";
import { CommentText } from "./commentText";
import { Good } from "./good";
import { ReportFloat } from "./reportFloat";
import { DeleteComment } from "./deleteComment";
import { refreshToken } from "@/lib/refreshToken";

type Props = {
    parentId: string;
    page: "normal" | "admin";
    loggedIn: boolean;
}

export const ReplyList = ({ parentId, page, loggedIn }: Props) => {
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        const fetchComment = async () => {
            try {
                const accessToken = await refreshToken();

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/reply-comment/${parentId}${page === "admin" ? "?admin=true" : ""}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken ?? ""}`,
                    },
                    cache: "no-store",
                });

                if (!res.ok) {
                    console.error("APIフェッチエラー：", res.status);
                    return;
                }

                const data = await res.json();
                setComments(data.commentListWithExtras);
            } catch (err) {
                console.error(err);
            }
        }

        fetchComment();
    }, [parentId, page]);

    return (
        <>
        <section className={styles.replyListWrapper}>
            {comments?.map((comment) => {
                if (!comment) return null;

                return (
                    <section className={styles.commentListSection} key={comment.id}>
                        <section className={styles.commentFlex}>
                            <ProfileImage user={comment.User} />
                            <div className={styles.commentMain}>
                                {comment.pin && <Pin />}

                                <CommentDataDiv comment={comment} />
                                <CommentText comment={comment} page={page} />

                                <div className={styles.commentEditDiv}>
                                    <Good comment={comment} loggedIn={loggedIn} />
                                    <ReportFloat comment={comment} page={page} />

                                    {comment.isMyComment && <DeleteComment comment={comment} page={page} />}
                                </div>
                            </div>
                        </section>
                    </section>
                );
            })}
        </section>
        </>
    );
}