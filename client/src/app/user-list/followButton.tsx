"use client";

import { getAccessToken } from "@/lib/getAccessToken";
import { useState } from "react";
import toast from "react-hot-toast";
import { ApiError } from "../../lib/api/apiError";
import styles from "./button.module.css";
import { removeFollow } from "./follow/api/follow";
import { User } from "./type";

type Props = {
    user: User;
};

export const FollowButton = ({ user }: Props) => {
    const [isFollowing, setIsFollowing] = useState(user.is_following);

    const add = async () => {
        const next = !isFollowing;

        setIsFollowing(next);

        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください");
                return;
            }

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow/${user.id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (err) {
            setIsFollowing(!next);
            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    const remove = async () => {
        const next = !isFollowing;

        setIsFollowing(next);

        try {
            await removeFollow(user.id);
        } catch (err) {
            setIsFollowing(!next);

            if (err instanceof ApiError) {
                if (err.statusCode === 409) {
                    toast.error("フォローしていません");
                } else {
                    toast.error("フォロー解除に失敗しました");
                }

                return;
            }

            alert("システムエラーが発生しました。時間をおいて再試行してください");
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
