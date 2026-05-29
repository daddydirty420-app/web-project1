"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { ApiError } from "../../lib/api/apiError";
import { fetcher } from "../../lib/fetcher";
import { formatRelativeTime } from "../../lib/formatRelativeTime";
import { fetchReadTrue } from "./api/client";
import { getKey } from "./getApiKey";
import styles from "./styles.module.css";
import { Notification, NotificationResponse } from "./type";

export const NotificationList = () => {
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const router = useRouter();

    const { data, mutate, size, setSize, isValidating } = useSWRInfinite<NotificationResponse>(
        getKey,
        async (url: string) => {
            return fetcher<NotificationResponse>(url);
        },
    );

    const notificationList = data?.flatMap((page) => page.notificationList) ?? [];
    const unreadCount = data?.[0]?.unreadCount;

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

    // 既読
    const read = async (id: string) => {
        mutate(
            (current) =>
                current
                    ? current.map((page) => ({
                          ...page,
                          notificationList: page.notificationList.map((n) =>
                              n.id === id ? { ...n, read_flag: true } : n,
                          ),
                      }))
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

    // シートアニメーション
    const sheetRef = useRef<HTMLDivElement>(null);

    const closeSheet = () => {
        const sheet = sheetRef.current;
        if (!sheet) return;

        sheet.classList.add(`${styles.closing}`);
        sheet.addEventListener(
            "animationend",
            () => {
                setSelectedNotification(null);
            },
            { once: true },
        );
    };

    return (
        <>
            <section className={styles.unreadCountSection}>
                <small className={styles.unreadCountText}>
                    未読
                    <span className={styles.countSpan}>{unreadCount?.toLocaleString()}</span>件
                </small>
            </section>

            {notificationList.length > 0 && (
                <section className={styles.notificationListSection}>
                    {notificationList.map((notification) => {
                        const messageStyle = notification.read_flag
                            ? styles.message
                            : `${styles.message} ${styles.unreadMessage}`;

                        return (
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
                                    src={notification.message_image ?? "/logo.png"}
                                    alt="お知らせ画像"
                                    width={45}
                                    height={45}
                                    className={styles.messageImage}
                                />

                                <div className={styles.textBlock}>
                                    <p className={messageStyle}>{notification.message}</p>
                                    <p className={styles.date}>{formatRelativeTime(notification.createdAt)}</p>
                                </div>
                            </section>
                        );
                    })}
                </section>
            )}

            {selectedNotification && (
                <>
                    <div className={styles.overlay} onClick={closeSheet} />

                    <section className={styles.sheet} ref={sheetRef}>
                        <div className={styles.handle} onClick={closeSheet} />

                        <div className={styles.sheetFlex}>
                            <Image
                                src={selectedNotification.message_image ?? "/logo.png"}
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

            <div ref={loadMoreRef} />
        </>
    );
};
