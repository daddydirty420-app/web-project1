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

    // alertPoint残り日数
    const setAfterDate = (date: Date | string): string => {
        const now = new Date();
        const d = typeof date === "string" ? new Date(date) : date;
        const diffMs = d.getTime() - now.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffDay > 1) {
            return `${diffDay}日`;
        } else {
            return `${diffHour}時間`;
        }
    };

    const pointLots = user.PointLots;

    return (
        <>
            <section className={styles.currentPointsSection}>
                <div className={styles.currentPointsFlex}>
                    <p className={styles.currentPointsTitle}>現在のポイント</p>

                    <p className={styles.currentPoints}>
                        <span className={styles.currentPointsNumber}>{user.points.toLocaleString()}</span>pt
                    </p>
                </div>

                {pointLots && pointLots?.alertPoints > 0 && (
                    <>
                        <div className={styles.alertPointsFlex}>
                            あと{setAfterDate(pointLots.expires_at)}で{pointLots?.alertPoints.toLocaleString()}
                            ptが失効します
                        </div>
                    </>
                )}
            </section>

            {history.length > 0}

            {history.length === 0}

            <div ref={loadMoreRef} />
        </>
    );
};
