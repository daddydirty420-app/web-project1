"use client";

import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconBuildingBank } from "@tabler/icons-react";
import Link from "next/link";
import { useInfinitePagination } from "../../../hooks/useInfinitePagination";
import { formatRelativeTime } from "../../../lib/formatRelativeTime";
import { Transfer, TransferHistoryResponse } from "../types";
import { getTransferHistoryApiKey } from "./apiKey";
import styles from "./styles.module.css";

export const TransferList = () => {
    // 無限スクロール
    const { items: history, loadMoreRef } = useInfinitePagination<TransferHistoryResponse, Transfer>({
        apiKey: getTransferHistoryApiKey,
        getItems: (page) => page.history,
        hasMore: (page) => page.hasMore,
    });

    return (
        <>
            {history.length > 0 && (
                <section className={styles.transListWrapper}>
                    {history.map((transfer) => {
                        if (!transfer) return;
                        const detailLink = `/transfer/detail/${transfer.id}`;

                        return (
                            <Link href={detailLink} className={styles.transferSection} key={transfer.id}>
                                <div className={styles.bankIconBox}>
                                    <IconBuildingBank size={20} stroke={1.5} />
                                </div>

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
