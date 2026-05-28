"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { ApiError } from "../../lib/api/apiError";
import { fetcher } from "../../lib/fetcher";
import { formatRelativeTime } from "../../lib/formatRelativeTime";
import { fetchReadTrue } from "./api/client";
import styles from "./styles.module.css";
import { Notification } from "./type";

type NotificationResponse = {
    notificationList: Notification[];
    unreadCount: number;
};

export const NotificationList = () => {
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

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
                                // urlが無いときだけボトムシートを開く
                                setSelectedNotification(notification);
                            }}
                        >
                            <Image
                                src={notification.message_image ?? "logo.png"}
                                alt="お知らせ画像"
                                width={45}
                                height={45}
                                className={styles.messageImage}
                            />

                            <div className={styles.textBlock}>
                                <p className={styles.message}>{notification.message}</p>
                                <p className={styles.date}>{formatRelativeTime(notification.createdAt)}</p>
                            </div>
                        </section>
                    ))}
                </section>
            )}

            {selectedNotification && (
                <>
                    <div className={styles.overlay} onClick={() => setSelectedNotification(null)} />

                    <section className={styles.sheet}>
                        <div className={styles.handle} />

                        <div className={styles.sheetFlex}>
                            <Image
                                src={selectedNotification.message_image ?? "logo.png"}
                                alt="お知らせ画像"
                                width={45}
                                height={45}
                                className={styles.messageImage}
                            />

                            <div className={styles.sheetTextBlock}>
                                <p className={styles.sheetMessage}>{selectedNotification.message}</p>
                                <p className={styles.sheetDate}>{formatRelativeTime(selectedNotification.createdAt)}</p>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </>
    );
};
