"use client"

import { useState } from "react";
import styles from "./button.module.css";
import { User } from "./type";
import { refreshToken } from "@/lib/refreshToken";

type Props = {
    user: User;
};

export const FollowButton = ({ user }: Props) => {
    const [isFollowing, setIsFollowing] = useState(user.is_following);

    const add = async () => {
        const next = !isFollowing;

        setIsFollowing(next);

        try {
            const accessToken = await refreshToken();
            
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow/${user.id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (err) {
            setIsFollowing(!next);
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    const remove = async () => {
        const next = !isFollowing;

        setIsFollowing(next);

        try {
            const accessToken = await refreshToken();
            
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow/${user.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (err) {
            setIsFollowing(!next);
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    return (
        <>
        {!isFollowing && (
            <button
            type="button"
            name="follow-button"
            className={`${styles.followButton} ${styles.false}`}
            onClick={add}
            >
                フォロー
            </button>
        )}

        {isFollowing && (
            <button
            type="button"
            name="follow-button"
            className={`${styles.followButton} ${styles.true}`}
            onClick={remove}
            >
                フォロー中
            </button>
        )}
        </>
    );
};