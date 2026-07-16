"use client";

import { AlertMoney } from "../../../components";
import { useInfinitePagination } from "../../../hooks/useInfinitePagination";
import { getUriagekinHistoryApiKey } from "../apiKey";
import styles from "../styles.module.css";
import { UriagekinHistory, UriagekinHistoryResponse, User } from "../type";

type Props = {
    user: User;
};

export const UriagekinList = ({ user }: Props) => {
    // 無限スクロール
    const { items: history, loadMoreRef } = useInfinitePagination<UriagekinHistoryResponse, UriagekinHistory>({
        apiKey: getUriagekinHistoryApiKey,
        getItems: (page) => page.history,
        hasMore: (page) => page.hasMore,
    });

    const uriagekinLots = user.UriagekinLots;

    return (
        <>
            <section className={styles.currentMoneySection}>
                <div className={styles.currentMoneyFlex}>
                    <p className={styles.currentMoneyTitle}>現在のポイント</p>

                    <p className={styles.currentMoney}>
                        <span className={styles.currentMoneyNumber}>{user.uriagekin.toLocaleString()}</span>pt
                    </p>
                </div>

                {uriagekinLots && uriagekinLots?.alertUriagekin > 0 && <AlertMoney uriagekinLots={uriagekinLots} mode="uriagekin" />}
            </section>
        </>
    );
};
