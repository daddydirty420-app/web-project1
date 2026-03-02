"use client";

import styles from "./comment.module.css";
import { Comment, Item, User } from "../itemPageTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CommentText } from "./commentText";
import { CommentDataDiv } from "./commentDataDiv";
import { Good } from "./good";
import { ReportFloat } from "./reportFloat";
import { DeleteComment } from "./deleteComment";
import { ProfileImage } from "./profileImage";
import { useState } from "react";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import { Pin } from "./pin";
import { CommentForm } from "./commentForm";
import { ReplyList } from "./replyList";
import { KeyedMutator } from "swr";

type Props = {
    id: string;
    sellerMe?: boolean;
    comments: Comment[];
    page: "normal" | "admin";
    loggedIn: boolean;
    item: Item;
    me: User | null;
    mutate: KeyedMutator<Comment[]>;
}

export const CommentList = ({ id, sellerMe, comments, page, loggedIn, item, me, mutate }: Props) => {
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
                                    <Good comment={comment} loggedIn={loggedIn} />
                                    <ReportFloat comment={comment} page={page} />

                                    {(comment.isMyComment || page === "admin") && <DeleteComment comment={comment} page={page} />}
                                </div>
                            </div>
                        </section>

                        <section className={`${styles.replySection} ${isVisibleReply ? styles.replyOpen : ""}`}>
                            {page === "normal" && <CommentForm id={id} sellerMe={sellerMe} parentId={commentId} loggedIn={loggedIn} item={item} me={me} mutate={mutate} />}
                            <ReplyList parentId={commentId} page={page} loggedIn={loggedIn} />
                        </section>
                    </section>
                );
            })}
        </section>
        </>
    );
}