"use client";

import { updateFollowCache, useFollowStatus } from "@/hooks/useFollow";
import clsx from "clsx";
import toast from "react-hot-toast";
import { ApiError } from "../../lib/api/apiError";
import { addFollow, removeFollow } from "./api/api";
import styles from "./followButton.module.css";

type Props = {
    targetUserId: string;
    currentUserId: string | null;
};

export const FollowButton = ({ targetUserId, currentUserId }: Props) => {
    const { data: status } = useFollowStatus(targetUserId);

    if (!currentUserId || !targetUserId) return null;

    const add = async () => {
        updateFollowCache(targetUserId, currentUserId, true);

        try {
            await addFollow(targetUserId);
        } catch (err) {
            // ロールバック
            updateFollowCache(targetUserId, currentUserId, false);

            if (err instanceof ApiError) {
                if (err.code === "ALREADY_FOLLOWING") {
                    toast.error("すでにフォローしています");
                } else {
                    toast.error("フォロー失敗しました");
                }

                return;
            }

            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    const remove = async () => {
        updateFollowCache(targetUserId, currentUserId, false);

        try {
            await removeFollow(targetUserId);
        } catch (err) {
            updateFollowCache(targetUserId, currentUserId, true);

            if (err instanceof ApiError) {
                if (err.code === "NOT_FOLLOWING") {
                    toast.error("フォローしていません");
                } else {
                    toast.error("フォロー解除に失敗しました");
                }

                return;
            }

            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    if (!currentUserId) {
        return <button type="button">Loading...</button>;
    }

    const currentIdStr = currentUserId.toString();

    return (
        <>
            {currentUserId && currentIdStr !== targetUserId && (
                <>
                    {!status?.isFollowing && (
                        <button
                            type="button"
                            name="follow-button"
                            className={clsx(styles.followButton, styles.false)}
                            onClick={add}
                        >
                            フォローする
                        </button>
                    )}
                    {status?.isFollowing && (
                        <button
                            type="button"
                            name="follow-button"
                            className={clsx(styles.followButton, styles.true)}
                            onClick={remove}
                        >
                            フォロー中
                        </button>
                    )}
                </>
            )}
        </>
    );
};
