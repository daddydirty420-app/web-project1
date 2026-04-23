"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../itemCommon.module.css";
import { Item } from "../itemPageTypes";

type Props = {
    id: string;
    item: Item;
    sellerMe?: boolean;
    page: "normal" | "admin" | "draft" | "confirm" | "deleted";
};

export const Detail = ({ id, item, sellerMe, page }: Props) => {
    const [expanded, setExpanded] = useState(false);
    const [overflowing, setoverflowing] = useState(false);
    const detailRef = useRef<HTMLParagraphElement>(null);
    const detailText = item.detail;

    useEffect(() => {
        const el = detailRef.current;
        if (el) {
            setoverflowing(el.scrollHeight > el.clientHeight);
        }
    }, [detailText]);

    const expand = async () => {
        setExpanded(!expanded);
        if (item.status === "soldout" || expanded || sellerMe || page !== "normal") return;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${id}/sort-number/add?number=5`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
        });
    };

    return (
        <>
            <p className={styles.semiTitle}>DETAIL</p>
            <div className={styles.summaryDiv}>
                <p
                    ref={detailRef}
                    className={`${styles.summary} ${!expanded ? styles.clamp : ""}`}
                    style={{
                        maxHeight: expanded ? detailRef.current?.scrollHeight : "calc(1.75em * 2)",
                        transition: "max-height 0.3s ease",
                    }}
                >
                    {detailText}
                </p>
                {overflowing && (
                    <button type="button" onClick={expand} className={styles.moreButton}>
                        {expanded ? "閉じる" : "...もっと見る"}
                    </button>
                )}
            </div>
        </>
    );
};
