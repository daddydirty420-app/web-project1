"use client"

import { User } from "../type";
import { UserList } from "../userList";
import styles from "./followHeader.module.css";
import { useRouter } from "next/navigation";

type Props = {
    loggedIn: boolean;
    id: string;
    currentUserId: string;
    userList: User[];
    page: "follow" | "good-item" | "good-comment";
    followTab: "follow" | "follower" | null;
    myFollow: boolean;
};

export const FollowPage = ({
    loggedIn,
    id,
    currentUserId,
    userList,
    page,
    followTab,
    myFollow
}: Props) => {
    const router = useRouter();

    return (
        <>
        <section className={styles.followHeader}>
            <button
            type="button"
            name="follow-tab"
            onClick={() => 
                router.push("?tab=follow")
            }
            className={`${styles.followHeaderButton} ${
                followTab === "follow"
                ? styles.active
                : ""
            }`}
            >
                フォロー中
            </button>

            <button
            type="button"
            name="follower-tab"
            onClick={() => 
                router.push("?tab=follower")
            }
            className={`${styles.followHeaderButton} ${
                followTab === "follower"
                ? styles.active
                : ""
            }`}
            >
                フォロワー
            </button>
        </section>
        
        <UserList
        loggedIn={loggedIn}
        id={id}
        currentUserId={currentUserId}
        userList={userList}
        page={page}
        followTab={followTab}
        myFollow={myFollow}
        />
        </>
    );
};