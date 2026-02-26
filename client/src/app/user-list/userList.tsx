"use client"

import Image from "next/image";
import { User } from "./type";
import styles from "./userList.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faSearch, faStore, faTag } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { FollowButton } from "./followButton";
import React, { useRef, useState } from "react";
import { refreshToken } from "@/lib/refreshToken";

type Props = {
    loggedIn: boolean;
    id: string;
    currentUserId: string;
    userList: User[];
    page: "follow" | "good-item" | "good-comment";
    followTab?: "follow" | "follower" | null;
    myFollow?: boolean;
};

export const UserList = ({ loggedIn, id, currentUserId, userList, page, followTab, myFollow }: Props) => {
    const [previewUserList, setPreviewUserList] = useState<User[]>(userList);
    const [searchValue, setSearchValue] = useState("");

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const followRemove = async (userId: string) => {};

    const search = async (word: string) => {
        if (!word.trim()) {
            setPreviewUserList(userList);
            return;
        };

        let apiUrl = "";

        if (page === "good-item") {
            apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/good-item/good-user-list/search/${id}?keyword=${word.trim()}`;
        } else if (page === "good-comment") {
            apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/good-comment/good-user-list/search/${id}?keyword=${word.trim()}`;
        }

        try {
            const accessToken = await refreshToken();

            const res = await fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken ?? ""}`,
                },
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok) {
                setPreviewUserList(userList);
                console.error(data.message);
                return;
            }

            setPreviewUserList(data.userList);
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            setPreviewUserList(userList);
            console.error(err);
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchValue(val);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            search(val);
        }, 300);
    };

    return (
        <>
        <section className={styles.searchSection}>
            <input
            type="text"
            name="user_search"
            placeholder="ユーザーネームを検索"
            className={styles.searchInput}
            value={searchValue}
            onChange={onChange}
            autoComplete="off"
            />
            <FontAwesomeIcon
            icon={faSearch}
            name="search_icon"
            className={`
                ${styles.searchIcon} 
                ${searchValue.trim() ? styles.activeIcon : ""}
            `}
            onClick={() => {
                if (!searchValue.trim()) return;
                search(searchValue);
            }}
            />
        </section>

        {previewUserList.length > 0 && (
            <section className={styles.userListSection}>
                {previewUserList.map((user) => (
                    <section key={user.id} className={styles.userSection}>
                        <Link
                        href={`/profile/${user.id}`}
                        className={styles.userImageNameFlex}
                        >
                            <Image
                             src={user.profile_image ?? "/default-profile.png"}
                            alt="プロフィール画像"
                             width={45}
                            height={45}
                            className={styles.image}
                             />

                            <div className={styles.nameBlock}>
                                <p className={styles.userName}>{user.user_name}</p>

                                <div className={styles.iconRow}>
                                    {user.honnin_verified && (
                                        <FontAwesomeIcon icon={faCircleCheck} className={styles.honninIcon} />
                                    )}
                                    {user.early_seller && (
                                         <FontAwesomeIcon icon={faTag} className={styles.earlyIcon} />
                                    )}
                                    {user.ShopInfo && (
                                        <FontAwesomeIcon icon={faStore} className={styles.shopIcon} />
                                    )}
                                </div>
                            </div>
                        </Link>

                        {loggedIn && 
                        !(followTab === "follow" && myFollow) && 
                        currentUserId !== user.id && 
                        (
                            <FollowButton user={user} />
                        )}

                        {loggedIn && followTab === "follow" && myFollow && (
                            <button
                            type="button"
                            className={styles.followRemoveButton}
                            onClick={() => followRemove(user.id)}
                            >
                                削除
                            </button>
                        )}
                    </section>
                ))}
            </section>
        )}

        {previewUserList.length === 0 && (
            <>
            {searchValue.trim().length > 0 && (
                <p className={styles.noUser}>ユーザーが見つかりません</p>
            )}

            {searchValue.trim().length === 0 && (
                <p className={styles.noUser}>
                    {["good-item", "good-comment"].includes(page)
                    ? "いいねしたユーザーがいません" 
                    : followTab === "follow" 
                    ? "フォロー中のユーザーがいません" 
                    : "フォロワーがいません"
                    }
                </p>
            )}
            </>
        )}
        </>
    );
};