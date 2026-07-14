"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { useInfinitePagination } from "../../../hooks/useInfinitePagination";
import { fetcher } from "../../../lib/fetcher";
import { getPointsHistoryApiKey } from "./apiKey";
import styles from "./styles.module.css";
import { PointsHistory, PointsHistoryResponse, User } from "./type";

type Props = {
    user: User;
};

export const PointsList = ({ user }: Props) => {
    // 無限スクロール
    const { data, items: history, mutate, loadMoreRef, isLoadingMore, isReachingEnd, isValidating } = useInfinitePagination<
        PointsHistoryResponse,
        PointsHistory
    >({ apiKey: getPointsHistoryApiKey, getItems: (page) => page.history, hasMore: (page) => page.hasMore });

    return (
        <>
            <section className={styles.currentPointsSection}></section>

            {history.length > 0}

            {history.length === 0}

            <div ref={loadMoreRef} />
        </>
    );
};
