"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./comment.module.css";
import { useEffect, useState } from "react";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import CommentForm from "./commentForm";
import CommentList from "./commentList";
import { Comment } from "../itemPageTypes";
import { refreshToken } from "@/lib/refreshToken";

type Props = {
    id: string;
    sellerMe?: boolean;
    commentCount?: number;
    page: "normal" | "admin";
    loggedIn: boolean;
};

export default function CommentSection({ id, sellerMe, commentCount, page, loggedIn }: Props) {
    const [visible, setVisible] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        if (!visible) return;

        const fetchComment = async () => {
            try {
                const accessToken = await refreshToken();
                
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/all-comment/${id}${page === "admin" ? "?admin=true" : ""}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken ?? ""}`,
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
    }, [visible, id, page]);


    return (
        <>
        <div className={styles.commentShowDiv} onClick={() => setVisible(!visible)}>
            <FontAwesomeIcon icon={faCommentDots} className={styles.commentShowIcon} />
            <p className={styles.commentShowText}>{visible ? "閉じる" : "コメントを見る"}（{commentCount?.toLocaleString()}）</p> 
        </div>

        {visible && (
            <>
            {page === "normal" && <CommentForm id={id} sellerMe={sellerMe} loggedIn={loggedIn} />}
            <CommentList id={id} sellerMe={sellerMe} comments={comments} page={page} loggedIn={loggedIn} />
            </>
        )}
        </>
    );
};