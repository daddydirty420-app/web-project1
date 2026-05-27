"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";
import styles from "./styles.module.css";
import { Notification } from "./type";

type NotificationResponse = {
    notificationList: Notification[];
    unreadCount: number;
};

export const NotificationList = () => {
    const [popup, setPopup] = useState(false);

    const router = useRouter();

    // APIフェッチ
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/notification`;

    const { data, mutate } = useSWR<NotificationResponse>(apiUrl, fetcher);

    const notificationList = data?.notificationList;
    const unreadCount = data?.unreadCount;

    // 既読
    const read = async (id: number) => {
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
                        <section key={notification.id} className={styles.notificationSection}></section>
                    ))}
                </section>
            )}
        </>
    );
};
