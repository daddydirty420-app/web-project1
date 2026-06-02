"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { fetcher } from "../../lib/fetcher";
import { SearchResponse } from "../item-list/type";
import { getSearchItemListApiKey } from "./apiKey";

export const SearchItemList = async () => {
    const [viewMode, setViewMode] = useState<"item" | "video">("item");
    const [limitVL, setLimitVL] = useState(15);
    const [limitIL, setLimitIL] = useState(36);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // SWRInfinite
    const { data, mutate, size, setSize, isValidating } = useSWRInfinite<SearchResponse>(
        getSearchItemListApiKey,
        async (url: string) => {
            return fetcher<SearchResponse>(url);
        },
    );

    const items = data?.flatMap((page) => page.itemList) ?? [];

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

    
};
