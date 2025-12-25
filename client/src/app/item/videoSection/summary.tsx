"use client";

import styles from "../itemCommon.module.css";
import { Item } from "../itemPageTypes";
import { useEffect, useRef, useState } from "react";

type Props = {
    id: string;
    item: Item;
    sellerMe?: boolean;
    page: "normal" | "admin" | "draft" | "confirm" | "deleted";
};

export default function Summary({ id, item, sellerMe, page }: Props) {
    const [expanded, setExpanded] = useState(false);
    const [overflowing, setOverflowing] = useState(false);
    const summaryRef = useRef<HTMLParagraphElement>(null);
    const summaryText = item.Video?.summary || "";

    useEffect(() => {
        const el = summaryRef.current;
        if (el) {
            setOverflowing(el.scrollHeight > el.clientHeight);
        }
    }, [summaryText]);

    const expand = async () => {
        setExpanded(!expanded);
        if (item.status === "soldout" || expanded || sellerMe || page !== "normal") return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-page/sort-add/${id}?number=5`, {
                method: 'PATCH',
                headers: { 'Content-type': 'application/json' },
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
        <p className="text-sm font-semibold">動画の概要</p>
        <div className={styles.summaryDiv}>
            <p
            ref={summaryRef}
            className={`${styles.summary} ${!expanded ? styles.clamp : ""}`}
            style={{
                maxHeight: expanded ? summaryRef.current?.scrollHeight : "3rem",
                transition: "max-height 0.3s ease",
            }}
            >
                {summaryText}
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
        </div>
        </>
    );
};