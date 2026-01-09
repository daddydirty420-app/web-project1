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

export default function Explain({ id, item, sellerMe, page }: Props) {
    const [expanded, setExpanded] = useState(false);
    const [overflowing, setoverflowing] = useState(false);
    const explainRef = useRef<HTMLParagraphElement>(null);
    const explainText = item.explain;

    useEffect(() => {
        const el = explainRef.current;
        if (el) {
            setoverflowing(el.scrollHeight > el.clientHeight);
        }
    }, [explainText]);

    const expand = async () => {
        setExpanded(!expanded);
        if (item.status === "soldout" || expanded || sellerMe || page !== "normal") return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item-page/sort-add/${id}?number=5`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
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
        <p className={styles.semiTitle}>DETAIL</p>
        <div className={styles.summaryDiv}>
            <p
            ref={explainRef}
            className={`${styles.summary} ${!expanded ? styles.clamp : ""}`}
            style={{
                maxHeight: expanded
                ? explainRef.current?.scrollHeight
                : "calc(1.75em * 2)",
                transition: "max-height 0.3s ease"
            }}
            >
                {explainText}
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