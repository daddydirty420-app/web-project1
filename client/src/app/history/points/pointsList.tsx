"use client";

import { useInfinitePagination } from "../../../hooks/useInfinitePagination";
import { getPointsHistoryApiKey } from "./apiKey";
import styles from "./styles.module.css";
import { PointsHistory, PointsHistoryResponse, User } from "./type";

type Props = {
    user: User;
};

export const PointsList = ({ user }: Props) => {
    // 無限スクロール
    const { items: history, loadMoreRef } = useInfinitePagination<PointsHistoryResponse, PointsHistory>({
        apiKey: getPointsHistoryApiKey,
        getItems: (page) => page.history,
        hasMore: (page) => page.hasMore,
    });

    return (
        <>
            <section className={styles.currentPointsSection}></section>

            {history.length > 0}

            {history.length === 0}

            <div ref={loadMoreRef} />
        </>
    );
};
