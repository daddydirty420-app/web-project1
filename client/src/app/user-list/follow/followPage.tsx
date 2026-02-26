"use client"

import { User } from "../type";
import { UserList } from "../userList";
import styles from "./followHeader.module.css";

type Props = {
    title: string;
    loggedIn: boolean;
    id: string;
    currentUserId: string;
    userList: User[];
    page: "follow" | "good-item" | "good-comment";
    followTab?: "follow" | "follower" | null;
    myFollow?: boolean;
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
    return (
        <>
        <section className={styles.followHeader}></section>
        
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