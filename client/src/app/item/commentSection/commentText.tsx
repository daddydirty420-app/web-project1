"use client";

import styles from "./comment.module.css";
import { Comment } from "../itemPageTypes";
import { useEffect, useRef, useState } from "react";

type Props = {
    comment: Comment;
    page: "normal" | "admin";
}

export const CommentText = ({ comment, page }: Props) => {
    const [expanded, setExpanded] = useState(false);
    const [overflowing, setOverflowing] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);
    const text = comment.text || "";

    useEffect(() => {
        const el = textRef.current;
        if (el) {
            setOverflowing(el.scrollHeight > el.clientHeight);
        }
    }, [text]);

    const expand = async () => {
        setExpanded(!expanded);
        if (comment.pin || expanded || page === "admin") return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/${comment.id}/sort-number/add?number=2`, {
                method: "PATCH",
            });

            if (!res.ok) {
                console.error("APIエラー：", res.status);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
        <p
        ref={textRef}
        className={`${styles.text} ${!expanded ? styles.clamp : ""}`}
        style={{
            maxHeight: expanded ? textRef.current?.scrollHeight : "5.2rem",
            transition: "max-height 0.3s ease",
        }}
        >
            {text}
        </p>
        {overflowing && (
            <button
            type="button"
            onClick={expand}
            className={styles.moreButton}
            >
                {expanded ? "閉じる" : "...もっと見る"}
            </button>
        )}
        </>
    );
}