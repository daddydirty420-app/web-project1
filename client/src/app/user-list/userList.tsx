'use client';

import Image from 'next/image';
import { User } from './type';
import styles from './userList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faSearch, faStore, faTag } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { FollowButton } from './followButton';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { getAccessToken } from '@/lib/getAccessToken';

type Props = {
    loggedIn: boolean;
    id: string;
    currentUserId: string;
    page: 'follow' | 'item-like' | 'comment-like';
    followTab?: 'follow' | 'follower' | null;
    myFollow?: boolean;
};

type Response = {
    userList: User[];
};

export const UserList = ({ loggedIn, id, currentUserId, page, followTab, myFollow }: Props) => {
    const [searchValue, setSearchValue] = useState('');

    const getBasePath = () => {
        if (page === 'item-like') return `item-like/${id}/user`;
        if (page === 'comment-like') return `comment-like/${id}/user`;

        if (page === 'follow') {
            if (followTab === 'follow') return `follow/${id}/user?type=follow`;
            if (followTab === 'follower') return `follow/${id}/user?type=follower`;

            return `follow/${id}?type=follow`; // デフォルト
        }

        return null;
    };

    const basePath = getBasePath();

    const apiUrl = () => {
        if (!basePath) return null;
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/${basePath}`);
        if (searchValue.trim()) {
            url.searchParams.set('keyword', searchValue.trim());
        }
        return url.toString();
    };

    const { data, mutate } = useSWR<Response>(apiUrl, fetcher);

    const userList = data?.userList;

    const followRemove = async (userId: string) => {
        mutate((prev) => {
            if (!prev) return;

            return {
                ...prev,
                previewUserList: prev.userList.filter((user) => user.id !== userId),
            };
        }, false);

        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                mutate();
                alert('認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。');
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!res.ok) {
                mutate();
                const data = await res.json();
                toast.error('フォロー解除に失敗しました');
                console.error(data.message);
                return;
            }

            mutate();
        } catch (err) {
            mutate();
            alert('システムエラーが発生しました。時間をおいて再試行してください。');
            console.error(err);
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchValue(val);
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
                ${searchValue.trim() ? styles.activeIcon : ''}
            `}
                />
            </section>

            {userList && userList?.length > 0 && (
                <section className={styles.userListSection}>
                    {userList.map((user) => (
                        <section key={user.id} className={styles.userSection}>
                            <Link href={`/profile/${user.id}`} className={styles.userImageNameFlex}>
                                <Image
                                    src={user.profile_image ?? '/default-profile.png'}
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

                            {loggedIn && currentUserId !== user.id && (
                                <>
                                    {!(followTab === 'follow' && myFollow) && <FollowButton user={user} />}

                                    {followTab === 'follow' && myFollow && (
                                        <button
                                            type="button"
                                            className={styles.followRemoveButton}
                                            onClick={() => followRemove(user.id)}
                                        >
                                            削除
                                        </button>
                                    )}
                                </>
                            )}
                        </section>
                    ))}
                </section>
            )}

            {userList?.length === 0 && (
                <>
                    {searchValue.trim().length > 0 && <p className={styles.noUser}>ユーザーが見つかりません</p>}

                    {searchValue.trim().length === 0 && (
                        <p className={styles.noUser}>
                            {['item-like', 'comment-like'].includes(page)
                                ? 'いいねしたユーザーがいません'
                                : followTab === 'follow'
                                  ? 'フォロー中のユーザーがいません'
                                  : 'フォロワーがいません'}
                        </p>
                    )}
                </>
            )}
        </>
    );
};
