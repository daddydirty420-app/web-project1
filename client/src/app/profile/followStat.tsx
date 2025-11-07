'use client'

import Link from "next/link";
import styles from './profile.module.css';
import { useFollowCount } from "@/hooks/useFollow";
import { Session } from "next-auth";

type Props = {
    userId: string;
    type: "follow" | "follower";
    initialCount: number;
    session: Session | null;
};

export default function FollowStat({ userId, type, initialCount, session }: Props) {
    const accessToken = session?.accessToken;
    const { data } = useFollowCount(userId, accessToken ?? "");
    if (!accessToken) return null;

    const count = type === "follow" 
    ? data?.followCount ?? initialCount ?? 0
    : data?.followerCount ?? initialCount ?? 0;

    const href = type === "follow"
    ? `/user-list/follow/${userId}`
    : `/user-list/follower/${userId}`;

    const label = type === "follow" ? "フォロー" : "フォロワー";

    return (
        <Link href={href} className={styles.followCountDiv}>
            <p className={styles.followNumber}>{count.toLocaleString()}</p>
            <p className={styles.followText}>{label}</p>
        </Link>
    );
};