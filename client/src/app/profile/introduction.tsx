"use client";

import styles from "./profile.module.css";
import { Res } from "./profileTypes";
import { useEffect, useRef, useState } from "react";

type Props = {
    data: Res;
};

export const Introduction = ({ data }: Props) => {
    const [expanded, setExpanded] = useState(false);
    const [overflowing, setOverflowing] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);
    const text = data.user.user_introduction || "";

    useEffect(() => {
        const el = textRef.current;
        if (el) {
            setOverflowing(el.scrollHeight > el.clientHeight);
        }
    }, [text]);

    return (
        <div className={styles.introductionDiv}>
            <p
                ref={textRef}
                className={`${styles.introduction} ${!expanded ? styles.clamp : ""}`}
                style={{
                    maxHeight: expanded ? textRef.current?.scrollHeight : "6rem",
                    transition: "max-height 0.3s ease",
                }}
            >
                {text}
            </p>
            {overflowing && (
                <button type="button" onClick={() => setExpanded(!expanded)} className={styles.moreButton}>
                    {expanded ? "閉じる" : "...もっと見る"}
                </button>
            )}
        </div>
    );
};
