"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./comment.module.css";
import { useEffect, useState } from "react";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import { Session } from "next-auth";
import CommentForm from "./commentForm";
import CommentList from "./commentList";
import { Comment } from "../itemPageTypes";

type Props = {
    id: string;
    sellerMe?: boolean;
    session: Session | null;
    commentCount?: number;
    page: "normal" | "admin";
};

export default function CommentSection({ id, sellerMe, session, commentCount, page }: Props) {
    const [visible, setVisible] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        if (!visible) return;

        const fetchComment = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/all-comment/${id}${page === "admin" ? "?admin=true" : ""}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${session?.accessToken ?? ""}`,
                    },
                    cache: "no-store",
                });


                if (!res.ok) {
                    const errorData = await res.json();
                    alert(errorData.message);
                    return;
                }

                const data = await res.json();
                setComments(data.commentListWithExtras);
            } catch (err) {
                console.error(err);
            }
        }

        fetchComment();
    }, [visible, id, session, page]);


    return (
        <>
        <div className={styles.commentShowDiv} onClick={() => setVisible(!visible)}>
            <FontAwesomeIcon icon={faCommentDots} className={styles.commentShowIcon} />
            <p className={styles.commentShowText}>{visible ? "閉じる" : "コメントを見る"}（{commentCount?.toLocaleString()}）</p> 
        </div>

        {visible && (
            <>
            {page === "normal" && <CommentForm id={id} sellerMe={sellerMe} session={session} />}
            <CommentList id={id} sellerMe={sellerMe} session={session} comments={comments} page={page} />
            </>
        )}
        </>
    );
};