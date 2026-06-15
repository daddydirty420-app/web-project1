"use client";

import { faBuildingColumns, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { fetcher } from "../../../lib/fetcher";
import { formatRelativeTime } from "../../../lib/formatRelativeTime";
import { TransferHistoryResponse } from "../types";
import { getTransferHistoryApiKey } from "./apiKey";
import styles from "./styles.module.css";

export const TransferList = () => {
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // SWRInfinite
    const { data, mutate, size, setSize, isValidating } = useSWRInfinite<TransferHistoryResponse>(
        getTransferHistoryApiKey,
        async (url: string) => {
            return fetcher<TransferHistoryResponse>(url);
        },
    );

    const history = data?.flatMap((page) => page.history) ?? [];

    // 追加フェッチ
    const loadMore = useCallback(async () => {
        setIsLoadingMore(true);

        await setSize((prev) => prev + 1);

        setIsLoadingMore(false);
    }, [setSize]);

    const isReachingEnd = data && !data[data.length - 1]?.hasMore;

    // 最下部検知
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const target = loadMoreRef.current;
        if (!target) return;

        if (isReachingEnd || isValidating) return;

        const observer = new IntersectionObserver(
            async ([entry]) => {
                if (!entry.isIntersecting) return;

                if (isLoadingMore) return;

                await loadMore();
            },
            {
                threshold: 0.1,
                rootMargin: "200px",
            },
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, [isLoadingMore, isReachingEnd, isValidating, loadMore]);

    return (
        <>
            {history.length > 0 && (
                <section className={styles.transListWrapper}>
                    {history.map((transfer) => {
                        if (!transfer) return;
                        const detailLink = `/transfer/detail/${transfer.id}`;

                        return (
                            <Link href={detailLink} className={styles.transferSection} key={transfer.id}>
                                <FontAwesomeIcon icon={faBuildingColumns} className={styles.bankIcon} />

                                <div className={styles.transInfo}>
                                    <p className={styles.transMoney}>￥{transfer.trans_money.toLocaleString()}</p>

                                    <p className={styles.transDate}>{formatRelativeTime(transfer.createdAt)}</p>
                                </div>

                                <span
                                    className={`${styles.transFlag} ${transfer.trans_finish ? styles.finish : styles.yet}`}
                                >
                                    {transfer.trans_finish ? "振込済み" : "未振込"}
                                </span>

                                <FontAwesomeIcon icon={faChevronRight} className={styles.chevron} />
                            </Link>
                        );
                    })}
                </section>
            )}

            {history.length === 0 && <p className={styles.noHistory}>振込申請履歴がありません</p>}

            <div ref={loadMoreRef} />
        </>
    );
};
