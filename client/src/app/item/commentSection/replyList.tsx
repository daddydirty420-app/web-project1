"use client";

import styles from "./comment.module.css";
import { Session } from "next-auth";
import ProfileImage from "./profileImage";
import { Comment } from "../itemPageTypes";
import { useEffect, useState } from "react";
import Pin from "./pin";
import CommentDataDiv from "./commentDataDiv";
import CommentText from "./commentText";
import Good from "./good";
import ReportFloat from "./reportFloat";
import DeleteComment from "./deleteComment";

type Props = {
    parentId: string;
    session: Session | null;
    page: "normal" | "admin";
}

export default function ReplyList({ parentId, session, page }: Props) {
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        const fetchComment = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/reply-comment/${parentId}${page === "admin" ? "?admin=true" : ""}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${session?.accessToken ?? ""}`,
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
    }, [parentId, session, page]);

    return (
        <>
        <section className={styles.replyListWrapper}>
            {comments?.map((comment) => {
                if (!comment) return null;

                return (
                    <section className={styles.commentFlex} key={comment.id}>
                        <ProfileImage user={comment.User} />
                        <div className={styles.commentMain}>
                            {comment.pin && <Pin />}

                            <CommentDataDiv comment={comment} />
                            <CommentText comment={comment} page={page} />

                            <div className={styles.commentEditDiv}>
                                <Good comment={comment} session={session} />
                                <ReportFloat comment={comment} page={page} />

                                {comment.isMyComment && <DeleteComment comment={comment} session={session} page={page} />}
                            </div>
                        </div>
                    </section>
                );
            })}
        </section>
        </>
    );
}