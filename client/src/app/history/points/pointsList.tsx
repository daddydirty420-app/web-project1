"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { fetcher } from "../../../lib/fetcher";
import { getPointsHistoryApiKey } from "./apiKey";
import styles from "./styles.module.css";
import { PointsHistoryResponse, User } from "./type";

type Props = {
    user: User;
};

export const PointsList = ({ user }: Props) => {
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // SWRInfinite
    const { data, mutate, size, setSize, isValidating } = useSWRInfinite<PointsHistoryResponse>(
        getPointsHistoryApiKey,
        async (url: string) => {
            return fetcher<PointsHistoryResponse>(url);
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
            <section className={styles.currentPointsSection}></section>

            {history.length > 0}

            {history.length === 0}

            <div ref={loadMoreRef} />
        </>
    );
};
