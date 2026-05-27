"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { ApiError } from "../../lib/api/apiError";
import { fetcher } from "../../lib/fetcher";
import { fetchReadTrue } from "./api/client";
import styles from "./styles.module.css";
import { Notification } from "./type";

type NotificationResponse = {
    notificationList: Notification[];
    unreadCount: number;
};

export const NotificationList = () => {
    const [modalId, setModalId] = useState<string | null>(null);

    const router = useRouter();

    // APIフェッチ
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/notification`;

    const { data, mutate } = useSWR<NotificationResponse>(apiUrl, fetcher);

    const notificationList = data?.notificationList;
    const unreadCount = data?.unreadCount;

    // 既読
    const read = async (id: string) => {
        mutate(
            (current) =>
                current
                    ? {
                          ...current,
                          notificationList: current.notificationList.map((n) =>
                              n.id === id ? { ...n, read_flag: true } : n,
                          ),
                      }
                    : undefined,
            false,
        );

        try {
            await fetchReadTrue(id);

            mutate();
        } catch (err) {
            mutate();

            if (err instanceof ApiError) return;

            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    // モーダル表示
    const modalNotification = notificationList?.find((n) => n.id === modalId);

    return (
        <>
            <section className={styles.unreadCountSection}>
                <small className={styles.unreadCountText}>
                    未読
                    <span className={styles.countSpan}>{unreadCount?.toLocaleString()}</span>件
                </small>
            </section>

            {notificationList && notificationList.length > 0 && (
                <section className={styles.notificationListSection}>
                    {notificationList.map((notification) => (
                        <section
                            key={notification.id}
                            className={styles.notificationSection}
                            onClick={() => {
                                read(notification.id);
                                if (notification.url) {
                                    router.push(notification.url);
                                    return;
                                }
                                // urlが無いときだけモーダルを開く
                                setModalId(notification.id);
                            }}
                        ></section>
                    ))}
                </section>
            )}

            {modalNotification}
        </>
    );
};
