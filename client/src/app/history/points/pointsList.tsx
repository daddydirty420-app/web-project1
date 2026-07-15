"use client";

import { IconCoins, IconShoppingCart } from "@tabler/icons-react";
import { useInfinitePagination } from "../../../hooks/useInfinitePagination";
import { formatRelativeTime } from "../../../lib/formatRelativeTime";
import { PointsHistory, PointsHistoryResponse, User } from "../type";
import { getPointsHistoryApiKey } from "./apiKey";
import styles from "./styles.module.css";

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
            return "残りわずか";
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
                    <div className={styles.alertPointsFlex}>
                        <p className={styles.alertPointsText}>
                            あと<span className={styles.alertBold}>{setAfterDate(pointLots.expires_at)}</span>で
                            <span className={styles.alertBold}>
                                {pointLots?.alertPoints.toLocaleString()}
                                pt
                            </span>
                            が失効します
                        </p>
                    </div>
                )}
            </section>

            {history.length > 0 && (
                <section className={styles.pointsListWrapper}>
                    {history.map((pointsHistory) => {
                        if (!pointsHistory) return;
                        const plus = pointsHistory.points >= 0;

                        return (
                            <section className={styles.pointsHistorySection} key={pointsHistory.id}>
                                <div className={`${styles.pointsIconBox} ${plus ? styles.plus : styles.minus}`}>
                                    {plus ? (
                                        <IconCoins size={20} stroke={1.5} />
                                    ) : (
                                        <IconShoppingCart size={20} stroke={1.5} />
                                    )}
                                </div>

                                <div className={styles.pointsInfo}>
                                    <p className={styles.reason}>{pointsHistory.PointReasonOption.name}</p>

                                    <p className={styles.date}>{formatRelativeTime(pointsHistory.createdAt)}</p>
                                </div>

                                <span className={`${styles.points} ${plus ? styles.plus : styles.minus}`}>
                                    {plus ? "+" : ""}
                                    {pointsHistory.points.toLocaleString()}pt
                                </span>
                            </section>
                        );
                    })}
                </section>
            )}

            {history.length === 0 && <p className={styles.noHistory}>ポイント履歴がありません</p>}

            <div ref={loadMoreRef} />
        </>
    );
};
