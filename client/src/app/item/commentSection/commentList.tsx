"use client";

import styles from "./comment.module.css";
import { Comment } from "../itemPageTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommentText from "./commentText";
import CommentDataDiv from "./commentDataDiv";
import Good from "./good";
import ReportFloat from "./reportFloat";
import DeleteComment from "./deleteComment";
import ProfileImage from "./profileImage";
import { useState } from "react";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import Pin from "./pin";
import CommentForm from "./commentForm";
import ReplyList from "./replyList";
import { Session } from "next-auth";

type Props = {
    id: string;
    sellerMe?: boolean;
    session: Session | null;
    accessToken: string | null;
    comments: Comment[];
    page: "normal" | "admin";
}

export default function CommentList({ id, sellerMe, session, accessToken, comments, page }: Props) {
    const [replyVisible, setReplyVisible] = useState<{ [key: string]: boolean }>({});

    const toggleReplyVisible = (commentId: string) => {
        setReplyVisible((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    return (
        <>
        <section className={styles.commentListWrapper}>
            {comments?.map((comment) => {
                if (!comment) return null;
                const commentId = comment.id;
                const isVisibleReply = replyVisible[commentId] ?? false;

                return (
                    <section className={styles.commentListSection} key={commentId}>
                        <section className={styles.commentFlex}>
                            <ProfileImage user={comment.User} />
                            <div className={styles.commentMain}>
                                {comment.pin && <Pin />}

                                <CommentDataDiv comment={comment} />
                                <CommentText comment={comment} page={page} />

                                <div className={styles.commentEditDiv}>
                                    <div className={styles.replyDiv} onClick={() => toggleReplyVisible(commentId)}>
                                        <FontAwesomeIcon icon={faCommentDots} className={styles.replyIcon} />
                                        <p className={styles.replyCount}>{comment.replyCount.toLocaleString()}件の返信</p>
                                    </div>
                                    <Good comment={comment} accessToken={accessToken} />
                                    <ReportFloat comment={comment} page={page} />

                                    {(comment.isMyComment || page === "admin") && <DeleteComment comment={comment} accessToken={accessToken} page={page} />}
                                </div>
                            </div>
                        </section>

                        {isVisibleReply && (
                            <section className={styles.replySection}>
                                {page === "normal" && <CommentForm id={id} sellerMe={sellerMe} session={session} accessToken={accessToken} parentId={commentId} />}
                                <ReplyList parentId={commentId} accessToken={accessToken} page={page} />
                            </section>
                        )}
                    </section>
                );
            })}
        </section>
        </>
    );
}