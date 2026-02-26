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
import { normalizeJapanese } from "@/lib/normalizeJapanese";

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
            apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/good-item/good-user-list/search/${id}`;
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
    
    const buildMapping = (str: string) => {
        const normalized = normalizeJapanese(str);
    
        const map: { origIndex: number; normStart: number; normEnd: number }[] = [];
        let normPos = 0;
    
        for (let i = 0; i < str.length; i++) {
            const origChar = str[i];
            const normChar = normalizeJapanese(origChar);
    
            const start = normPos;
            normPos += normChar.length;
            const end = normPos - 1;
    
            map.push({
                origIndex: i,
                normStart: start,
                normEnd: end,
            });
        }
    
        return { normalized, map };
    };
    
    const highlightMatch = (word: string, query: string) => {
        if (!query) return word;
    
        const { normalized: nWord, map } = buildMapping(word);
        const nQuery = normalizeJapanese(query);
    
        const normIndex = nWord.indexOf(nQuery);
        if (normIndex === -1) return word;
    
        const startMap = 
        map.find((m) => m.normStart === normIndex || (m.normStart < normIndex && m.normEnd >= normIndex));
        if (!startMap) return word;
    
        const startOrig = startMap.origIndex;
    
        const endNormIndex = normIndex + nQuery.length - 1;
        const endMap = map.find((m) => m.normStart <= endNormIndex && m.normEnd >= endNormIndex);
        if (!endMap) return word;
    
        const endOrig = endMap.origIndex;
    
        const before = word.slice(0, startOrig);
        const match = word.slice(startOrig, endOrig + 1);
        const after = word.slice(endOrig + 1);
    
        return (
            <>
                {before}
                <strong>{match}</strong>
                {after}
            </>
        );
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
                            <p className={styles.userName}>
                                {highlightMatch(user.user_name, searchValue)}
                            </p>

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
        </>
    );
};