"use client";

import { useRouter } from "next/navigation";
import styles from "./followHeader.module.css";

type Props = {
    id: string;
    followTab: "follow" | "follower" | null;
    followCount: number;
    followerCount: number;
};

export const FollowHeader = ({ id, followTab, followCount, followerCount }: Props) => {
    const router = useRouter();

    return (
        <nav className={styles.followHeader}>
            <div className={styles.followButtonFlex}>
                <button
                    type="button"
                    name="follow-tab"
                    onClick={() => router.push(`/user-list/follow/${id}?tab=follow`)}
                    className={`${styles.followHeaderButton} ${followTab === "follow" ? styles.active : ""}`}
                >
                    {followCount.toLocaleString()} フォロー中
                </button>

                <button
                    type="button"
                    name="follower-tab"
                    onClick={() => router.push(`/user-list/follow/${id}?tab=follower`)}
                    className={`${styles.followHeaderButton} ${followTab === "follower" ? styles.active : ""}`}
                >
                    {followerCount.toLocaleString()} フォロワー
                </button>
            </div>
        </nav>
    );
};
