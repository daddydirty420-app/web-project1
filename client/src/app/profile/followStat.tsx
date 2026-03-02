'use client'

import Link from "next/link";
import styles from './profile.module.css';
import { useFollowCount } from "@/hooks/useFollow";

type Props = {
    userId: string;
    type: "follow" | "follower";
    initialCount: number;
};

export const FollowStat = ({ userId, type, initialCount }: Props) => {
    const { data } = useFollowCount(userId);

    const count = type === "follow" 
    ? data?.followCount ?? initialCount ?? 0
    : data?.followerCount ?? initialCount ?? 0;

    const href = type === "follow"
    ? `/user-list/follow/${userId}?tab=follow`
    : `/user-list/follower/${userId}?tab=follower`;

    const label = type === "follow" ? "フォロー" : "フォロワー";

    return (
        <Link href={href} className={styles.followCountDiv}>
            <p className={styles.followNumber}>{count.toLocaleString()}</p>
            <p className={styles.followText}>{label}</p>
        </Link>
    );
};