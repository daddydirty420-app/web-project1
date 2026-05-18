"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";
import styles from "./styles.module.css";
import { Notification } from "./type";

type Response = {
    notificationList: Notification[];
    unreadCount: number;
};

export const NotificationList = () => {
    const [popup, setPopup] = useState(false);

    const router = useRouter();

    // APIフェッチ
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/notification`;

    const { data, mutate } = useSWR<Response>(apiUrl, fetcher);

    const notificationList = data?.notificationList;
    const unreadCount = data?.unreadCount;

    return (
        <>
            <section className={styles.unreadCountSection}>
                <small className={styles.unreadCountText}>
                    未読
                    <span className={styles.countSpan}>{unreadCount?.toLocaleString()}</span>件
                </small>
            </section>
        </>
    );
};
